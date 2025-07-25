import { OcgAttribute, OcgLocation, OcgPosition, OcgRace } from "./type_core";
import { OcgMessageSelectUnselectCard } from "./type_message";

/** Response type enum. */
export enum OcgResponseType {
  SELECT_BATTLECMD,
  SELECT_IDLECMD,
  SELECT_EFFECTYN,
  SELECT_YESNO,
  SELECT_OPTION,
  SELECT_CARD,
  SELECT_CARD_CODES,
  SELECT_UNSELECT_CARD,
  SELECT_CHAIN,
  SELECT_DISFIELD,
  SELECT_PLACE,
  SELECT_POSITION,
  SELECT_TRIBUTE,
  SELECT_COUNTER,
  SELECT_SUM,
  SORT_CARD,
  ANNOUNCE_RACE,
  ANNOUNCE_ATTRIB,
  ANNOUNCE_CARD,
  ANNOUNCE_NUMBER,
  ROCK_PAPER_SCISSORS,
}

export enum SelectBattleCMDAction {
  SELECT_CHAIN,
  SELECT_BATTLE,
  TO_M2,
  TO_EP,
}

export type OcgResponseSelectBattleCMD = {
  type: OcgResponseType.SELECT_BATTLECMD;
  action: SelectBattleCMDAction;
  index: number | null;
};

export enum SelectIdleCMDAction {
  SELECT_SUMMON,
  SELECT_SPECIAL_SUMMON,
  SELECT_POS_CHANGE,
  SELECT_MONSTER_SET,
  SELECT_SPELL_SET,
  SELECT_ACTIVATE,
  TO_BP,
  TO_EP,
  SHUFFLE,
}

export type OcgResponseSelectIdleCMD = {
  type: OcgResponseType.SELECT_IDLECMD;
  action: SelectIdleCMDAction;
  index: number | null;
};

export type OcgResponseSelectEffectYN = {
  type: OcgResponseType.SELECT_EFFECTYN;
  yes: boolean;
};

export type OcgResponseSelectYesNo = {
  type: OcgResponseType.SELECT_YESNO;
  yes: boolean;
};

export type OcgResponseSelectOption = {
  type: OcgResponseType.SELECT_OPTION;
  index: number;
};

export type OcgResponseSelectCard = {
  type: OcgResponseType.SELECT_CARD;
  indicies: number[] | null;
};

export type OcgResponseSelectCardCodes = {
  type: OcgResponseType.SELECT_CARD_CODES;
  codes: number[] | null;
};

export type OcgResponseSelectUnselectCard = {
  type: OcgResponseType.SELECT_UNSELECT_CARD;
  /**
   * If index is null: cancel the selection. If index is less then the length of
   * {@link OcgMessageSelectUnselectCard#select_cards}: select the card at the
   * specified index. Otherwise unselect a card of
   * {@link OcgMessageSelectUnselectCard#unselect_cards} at index -
   * {@link OcgMessageSelectUnselectCard#select_cards}.length
   */
  index: number | null;
};

export type SelectFieldPlace = {
  player: number;
  location: OcgLocation;
  sequence: number;
};

export type OcgResponseSelectChain = {
  type: OcgResponseType.SELECT_CHAIN;
  /**
   * If the index is null: cancel the selection. Otherwise chain the card
   * at that index from {@link OcgMessageSelectChain#selects}.
   */
  index: number | null;
};

export type OcgResponseSelectDisfield = {
  type: OcgResponseType.SELECT_DISFIELD;
  places: SelectFieldPlace[];
};

export type OcgResponseSelectPlace = {
  type: OcgResponseType.SELECT_PLACE;
  places: SelectFieldPlace[];
};

export type OcgResponseSelectPosition = {
  type: OcgResponseType.SELECT_POSITION;
  position: OcgPosition;
};

export type OcgResponseSelectTribute = {
  type: OcgResponseType.SELECT_TRIBUTE;
  indicies: number[] | null; // null -> cancel
};

export type OcgResponseSelectCounter = {
  type: OcgResponseType.SELECT_COUNTER;
  counters: number[];
};

export type OcgResponseSelectSum = {
  type: OcgResponseType.SELECT_SUM;
  indicies: number[];
};

export type OcgResponseSortCard = {
  type: OcgResponseType.SORT_CARD;
  order: number[] | null;
};

export type OcgResponseAnnounceRace = {
  type: OcgResponseType.ANNOUNCE_RACE;
  races: OcgRace[];
};

export type OcgResponseAnnounceAttrib = {
  type: OcgResponseType.ANNOUNCE_ATTRIB;
  attributes: OcgAttribute[];
};

export type OcgResponseAnnounceCard = {
  type: OcgResponseType.ANNOUNCE_CARD;
  card: number;
};

export type OcgResponseAnnounceNumber = {
  type: OcgResponseType.ANNOUNCE_NUMBER;
  value: number;
};

export type OcgResponseRockPaperScissors = {
  type: OcgResponseType.ROCK_PAPER_SCISSORS;
  value: 1 | 2 | 3;
};

export type OcgResponse =
  | OcgResponseSelectBattleCMD
  | OcgResponseSelectIdleCMD
  | OcgResponseSelectEffectYN
  | OcgResponseSelectYesNo
  | OcgResponseSelectOption
  | OcgResponseSelectCard
  | OcgResponseSelectCardCodes
  | OcgResponseSelectUnselectCard
  | OcgResponseSelectChain
  | OcgResponseSelectDisfield
  | OcgResponseSelectPlace
  | OcgResponseSelectPosition
  | OcgResponseSelectCounter
  | OcgResponseSelectSum
  | OcgResponseSelectTribute
  | OcgResponseSortCard
  | OcgResponseAnnounceRace
  | OcgResponseAnnounceAttrib
  | OcgResponseAnnounceCard
  | OcgResponseAnnounceNumber
  | OcgResponseRockPaperScissors;
