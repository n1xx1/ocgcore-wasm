export type MappedMap<E extends readonly (readonly [any, any])[]> = Omit<
  Map<E[any][0], E[any][1]>,
  "get"
> & {
  get<K extends E[any][0]>(
    this: MappedMap<E>,
    key: K
  ): Extract<E[any], readonly [K, any]>[1];
};

export function makeMap<const E extends readonly (readonly [any, any])[]>(
  e: E
) {
  return new Map(e) as MappedMap<E>;
}
