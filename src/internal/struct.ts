export interface LibraryModule extends EmscriptenModule {
  setValue: typeof setValue;
  getValue: typeof getValue;
  UTF8ToString: typeof UTF8ToString;
  lengthBytesUTF8: typeof lengthBytesUTF8;
  stringToUTF8: typeof stringToUTF8;
}

export function CStruct<T extends readonly StructRecord[]>(
  m: LibraryModule,
  structure: T
) {
  const layout = produceStructure(structure);
  return {
    new(): StructDeclaration<T> {
      const ptr = m._malloc(layout.__size);
      return structProxy(m, ptr, layout, true);
    },
    from(ptr: number): StructDeclaration<T> {
      return structProxy(m, ptr, layout, false);
    },
  };
}

function structProxy(
  m: LibraryModule,
  ptr: number,
  layout: StructDefinition,
  owned: boolean,
  ownedStrings: number[] = []
): any {
  return new Proxy(
    {},
    {
      get(target, prop: string) {
        if (prop === "free") {
          return () => {
            for (const s of ownedStrings) {
              m._free(s);
            }
            if (owned) {
              m._free(ptr);
              ptr = 0;
              owned = false;
            }
          };
        }
        if (prop == "__ptr") {
          return ptr;
        }
        const f = layout[prop];
        if (f === undefined || ptr === undefined) {
          return undefined;
        }
        const { type, offset } = f;
        if (typeof type === "object") {
          return structProxy(m, ptr, type, false, ownedStrings);
        }
        if (type === "string") {
          const sptr = m.getValue(ptr + offset, "*");
          return m.UTF8ToString(sptr);
        }
        if (type === "i64") {
          const low = m.getValue(ptr + offset, "i32");
          const high = m.getValue(ptr + offset + 4, "i32");
          return BigInt(low) | (BigInt(high) << 32n);
        }
        return m.getValue(ptr + offset, type);
      },
      set(target, prop: string, value) {
        const f = layout[prop];
        if (f === undefined || ptr === undefined) {
          return false;
        }
        const { type, offset } = f;
        if (typeof type === "object") {
          return false;
        }
        if (type === "string") {
          const prevIndex = ownedStrings.indexOf(m.getValue(ptr + offset, "*"));
          if (prevIndex >= -1) {
            m._free(ownedStrings.splice(prevIndex, 1)[0]);
          }
          const s = m.lengthBytesUTF8(value) + 1;
          const p = m._malloc(s);
          m.stringToUTF8(value, p, s);
          m.setValue(ptr + offset, p, "*");
          ownedStrings.push(p);
          return true;
        }
        if (type === "i64") {
          const vb = value as bigint;
          m.setValue(ptr + offset, Number(vb & 4294967295n), "i32");
          m.setValue(ptr + offset + 4, Number(vb >> 32n), "i32");
          return true;
        }
        m.setValue(ptr + offset, value, type);
        return true;
      },
    }
  );
}

function produceStructure(
  s: readonly StructRecord[],
  offset = 0
): StructDefinition {
  const def = {} as StructDefinition;
  let size = 0;
  for (const [f, t] of s) {
    const align = getTypeAlign(t);
    const padding = (align - ((offset + size) % align)) % align;
    const aligned = offset + size + padding;

    if (Array.isArray(t)) {
      const subStructure = produceStructure(t, aligned);
      def[f] = {
        offset: aligned,
        type: subStructure,
      };
      size += subStructure.__size;
      continue;
    }

    const type = t as Exclude<StructRecord[1], readonly StructRecord[]>;
    def[f] = {
      offset: aligned,
      type,
    };
    size += padding + getTypeSize(type);
  }
  def.__size = size;
  return def;
}

function isPointerType(
  type: Emscripten.CType | "string"
): type is Extract<typeof type, `${string}*`> {
  return type.endsWith("*");
}

function isStructRecord(
  type: StructRecord[1]
): type is readonly StructRecord[] {
  return Array.isArray(type);
}

function getTypeAlign(type: StructRecord[1]) {
  while (isStructRecord(type)) {
    type = type[0][1];
  }
  if (isPointerType(type)) {
    return 4;
  }
  switch (type) {
    case "i8":
      return 1;
    case "i16":
      return 2;
    case "i32":
      return 4;
    case "i64":
      return 8;
    case "float":
      return 4;
    case "double":
      return 8;
    case "string":
      return 4;
  }
}

function getTypeSize(type: Emscripten.CType | "string") {
  if (isPointerType(type)) {
    return 4;
  }
  switch (type) {
    case "i8":
      return 1;
    case "i16":
      return 2;
    case "i32":
      return 4;
    case "string":
      return 4;
    case "i64":
      return 8;
    case "float":
      return 4;
    case "double":
      return 8;
  }
}

type StructDefinition = {
  [id: string]: {
    offset: number;
    type: "string" | Emscripten.CType | StructDefinition;
  };
} & { __size: number };

type StructRecord = readonly [
  string,
  Emscripten.CType | "string" | readonly StructRecord[]
];

type Cast<X, Y> = X extends Y ? X : Y;

type implStructDeclaration<T> = T extends readonly (readonly [
  infer Key,
  unknown
])[]
  ? {
      [K in Cast<Key, string>]: ConvertCtype<
        Extract<T[number], readonly [K, unknown]>[1]
      >;
    }
  : never;

type StructDeclaration<T> = implStructDeclaration<T> & {
  __ptr: number;
  __layout: StructDefinition;
  __owned: boolean;
  free(): void;
};

type ConvertCtype<T> = T extends "string"
  ? string
  : "i64" extends T
  ? bigint
  : T extends Emscripten.CType
  ? number
  : T extends readonly StructRecord[]
  ? StructDeclaration<T>
  : never;
