export type InternalMappedMap<E extends readonly (readonly [any, any])[]> =
  Omit<Map<E[any][0], E[any][1]>, "get"> & {
    get<K extends E[any][0]>(
      this: InternalMappedMap<E>,
      key: K
    ): Extract<E[any], readonly [K, any]>[1];
  };

export function makeMap<const E extends readonly (readonly [any, any])[]>(
  e: E
) {
  return new Map(e) as InternalMappedMap<E>;
}

export type InternalDepromisifyFunction<Fn> = Fn extends (
  ...args: infer Args
) => infer Ret
  ? (...args: Args) => Awaited<Ret>
  : Fn;
