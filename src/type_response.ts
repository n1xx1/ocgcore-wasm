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
export interface OcgResponseSelectBattleCMD {
  type: OcgResponseType.SELECT_BATTLECMD;
  action: SelectBattleCMDAction;
  index?: number;
}

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
export interface OcgResponseSelectIdleCMD {
  type: OcgResponseType.SELECT_IDLECMD;
  action: SelectIdleCMDAction;
  index?: number;
}
export interface OcgResponseSelectEffectYN {
  type: OcgResponseType.SELECT_EFFECTYN;
  yes: boolean;
}
export interface OcgResponseSelectYesNo {
  type: OcgResponseType.SELECT_YESNO;
  yes: boolean;
}
export interface OcgResponseSelectOption {
  type: OcgResponseType.SELECT_OPTION;
  index: number;
}
export interface OcgResponseSelectCard {
  type: OcgResponseType.SELECT_CARD;
  indicies?: number[];
}
export interface OcgResponseSelectUnselectCard {
  type: OcgResponseType.SELECT_UNSELECT_CARD;
  finish?: boolean;
  cancel?: boolean;
}
export interface SelectFieldPlace {
  player: number;
  location: OcgLocation;
  sequence: number;
}
export interface OcgResponseSelectChain {
  type: OcgResponseType.SELECT_CHAIN;
  cancel?: boolean;
  index?: number;
}
export interface OcgResponseSelectDisfield {
  type: OcgResponseType.SELECT_DISFIELD;
  places: SelectFieldPlace[];
}
export interface OcgResponseSelectPlace {
  type: OcgResponseType.SELECT_PLACE;
  places: SelectFieldPlace[];
}
export interface OcgResponseSelectPosition {
  type: OcgResponseType.SELECT_POSITION;
  position: OcgPosition;
}
export interface OcgResponseSelectTribute {
  type: OcgResponseType.SELECT_TRIBUTE;
  indicies?: number[];
}
export interface OcgResponseSelectCounter {
  type: OcgResponseType.SELECT_COUNTER;
  counters: number[];
}
export interface OcgResponseSelectSum {
  type: OcgResponseType.SELECT_SUM;
  indicies: number[];
}
export interface OcgResponseSelectRelease {
  type: OcgResponseType.SELECT_RELEASE;
}
export interface OcgResponseSelectFusion {
  type: OcgResponseType.SELECT_FUSION;
}
export interface OcgResponseSortCard {
  type: OcgResponseType.SORT_CARD;
}
export interface OcgResponseAnnounceRace {
  type: OcgResponseType.ANNOUNCE_RACE;
}
export interface OcgResponseAnnounceAttrib {
  type: OcgResponseType.ANNOUNCE_ATTRIB;
}
export interface OcgResponseAnnounceCard {
  type: OcgResponseType.ANNOUNCE_CARD;
}
export interface OcgResponseAnnounceNumber {
  type: OcgResponseType.ANNOUNCE_NUMBER;
}
export interface OcgResponseRockPaperScissors {
  type: OcgResponseType.ROCK_PAPER_SCISSORS;
}

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
