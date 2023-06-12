import { OcgLocation, OcgPosition } from "./type_core";

export enum OcgResponseType {
  SELECT_BATTLECMD,
  SELECT_IDLECMD,
  SELECT_EFFECTYN,
  SELECT_YESNO,
  SELECT_OPTION,
  SELECT_CARD,
  SELECT_UNSELECT_CARD,
  SELECT_CHAIN,
  SELECT_DISFIELD,
  SELECT_PLACE,
  SELECT_POSITION,
  SELECT_TRIBUTE,
  SELECT_COUNTER,
  SELECT_SUM,
  SELECT_RELEASE,
  SELECT_FUSION,
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
  index?: number;
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
  index?: number;
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
  indicies?: number[];
};

export type OcgResponseSelectUnselectCard = {
  type: OcgResponseType.SELECT_UNSELECT_CARD;
  finish?: boolean;
  cancel?: boolean;
};

export type SelectFieldPlace = {
  player: number;
  location: OcgLocation;
  sequence: number;
};

export type OcgResponseSelectChain = {
  type: OcgResponseType.SELECT_CHAIN;
} & ({ cancel: true; index?: never } | { cancel?: false; index: number });

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
  indicies?: number[];
};

export type OcgResponseSelectCounter = {
  type: OcgResponseType.SELECT_COUNTER;
  counters: number[];
};

export type OcgResponseSelectSum = {
  type: OcgResponseType.SELECT_SUM;
  indicies: number[];
};

export type OcgResponseSelectRelease = {
  type: OcgResponseType.SELECT_RELEASE;
};

export type OcgResponseSelectFusion = {
  type: OcgResponseType.SELECT_FUSION;
};

export type OcgResponseSortCard = {
  type: OcgResponseType.SORT_CARD;
};

export type OcgResponseAnnounceRace = {
  type: OcgResponseType.ANNOUNCE_RACE;
};

export type OcgResponseAnnounceAttrib = {
  type: OcgResponseType.ANNOUNCE_ATTRIB;
};

export type OcgResponseAnnounceCard = {
  type: OcgResponseType.ANNOUNCE_CARD;
};

export type OcgResponseAnnounceNumber = {
  type: OcgResponseType.ANNOUNCE_NUMBER;
};

export type OcgResponseRockPaperScissors = {
  type: OcgResponseType.ROCK_PAPER_SCISSORS;
};

export type OcgResponse =
  | OcgResponseSelectBattleCMD
  | OcgResponseSelectIdleCMD
  | OcgResponseSelectEffectYN
  | OcgResponseSelectYesNo
  | OcgResponseSelectOption
  | OcgResponseSelectCard
  | OcgResponseSelectUnselectCard
  | OcgResponseSelectChain
  | OcgResponseSelectDisfield
  | OcgResponseSelectPlace
  | OcgResponseSelectPosition
  | OcgResponseSelectCounter
  | OcgResponseSelectSum
  | OcgResponseSelectRelease
  | OcgResponseSelectTribute
  | OcgResponseSelectFusion
  | OcgResponseSortCard
  | OcgResponseAnnounceRace
  | OcgResponseAnnounceAttrib
  | OcgResponseAnnounceCard
  | OcgResponseAnnounceNumber
  | OcgResponseRockPaperScissors;
