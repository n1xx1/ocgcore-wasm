export const DuelHandleSymbol = Symbol("duel-handle");

/**
 * Internal representation of a duel.
 */
export interface OcgDuelHandle {
  [DuelHandleSymbol]: number;
}
