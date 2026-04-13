/** Internal typing for type-safe Map objects. */
export type InternalMappedMap<E extends readonly (readonly [any, any])[]> =
  Omit<Map<E[any][0], E[any][1]>, "get"> & {
    get<K extends E[any][0]>(
      this: InternalMappedMap<E>,
      key: K
    ): Extract<E[any], readonly [K, any]>[1];
  };

/** Internal utility to create type-safe Map objects. */
export function makeMap<const E extends readonly (readonly [any, any])[]>(
  e: E
) {
  return new Map(e) as InternalMappedMap<E>;
}

/** Internal utility to convert an async function to a normal one. */
export type InternalDepromisifyFunction<Fn> = Fn extends (
  ...args: infer Args
) => infer Ret
  ? (...args: Args) => Awaited<Ret>
  : Fn;
