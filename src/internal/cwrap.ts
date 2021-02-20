export type JSType = "number" | "string" | "array" | "boolean";

export type Convert<T> = T extends "void"
  ? void
  : "number" extends T
  ? number
  : "string" extends T
  ? string
  : "array" extends T
  ? number
  : "boolean" extends T
  ? boolean
  : never;

export type ConvertArgs<Args extends readonly any[]> = Args extends readonly [
  infer T,
  ...infer Rest
]
  ? [Convert<T>, ...ConvertArgs<Rest>]
  : [];

export function betterCwrap(m: { cwrap: typeof cwrap }) {
  return function <Ret extends JSType | "void", Args extends readonly JSType[]>(
    name: string,
    ret: Ret,
    args: Args
  ): (...args: ConvertArgs<Args>) => Convert<Ret> {
    return m.cwrap.apply(m, [name, ret === "void" ? null : ret, args]);
  };
}
