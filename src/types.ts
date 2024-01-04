import { DepromisifyFunction } from "./internal/utils";
import {
  OcgAttribute,
  OcgDuelMode,
  OcgLinkMarker,
  OcgLocation,
  OcgLogType,
  OcgPosition,
  OcgProcessResult,
  OcgQueryFlags,
  OcgRace,
  OcgType,
} from "./type_core";
import { OcgFieldState, OcgMessage } from "./type_message";
import { OcgResponse } from "./type_response";

export * from "./type_message";
export * from "./type_core";

export interface OcgCardData {
  code: number;
  alias: number;
  setcodes: number[];
  type: OcgType;
  level: number;
  attribute: OcgAttribute;
  race: OcgRace;
  attack: number;
  defense: number;
  lscale: number;
  rscale: number;
  link_marker: OcgLinkMarker;
}

export interface OcgNewCardInfo {
  team: number;
  duelist: number;
  code: number;
  controller: number;
  location: OcgLocation;
  sequence: number;
  position: OcgPosition;
}

export interface OcgDuelOptions {
  flags: OcgDuelMode;
  seed: [bigint, bigint, bigint, bigint];
  team1: {
    startingLP: number;
    startingDrawCount: number;
    drawCountPerTurn: number;
  };
  team2: {
    startingLP: number;
    startingDrawCount: number;
    drawCountPerTurn: number;
  };
  cardReader: (card: number) => Promise<OcgCardData> | OcgCardData;
  scriptReader: (name: string) => Promise<string> | string;
  errorHandler?: (type: OcgLogType, text: string) => void;
}

export type OcgDuelOptionsSync = {
  [F in keyof OcgDuelOptions]: DepromisifyFunction<OcgDuelOptions[F]>;
};

export type OcgQuery = {
  flags: OcgQueryFlags;
  controller: number;
  location: OcgLocation;
  sequence: number;
  overlaySequence: number;
};

export type OcgQueryLocation = Omit<OcgQuery, "sequence" | "overlaySequence">;

export type OcgCardQueryInfo = {
  code?: number;
  position?: OcgPosition;
  alias?: number;
  type?: OcgType;
  level?: number;
  rank?: number;
  attribute?: OcgAttribute;
  race?: OcgRace;
  attack?: number;
  defense?: number;
  baseAttack?: number;
  baseDefense?: number;
  reason?: number;
  cover?: number;
  reasonCard?: {
    controller: number;
    location: OcgLocation;
    sequence: number;
    position: OcgPosition;
  } | null;
  equipCard?: {
    controller: number;
    location: OcgLocation;
    sequence: number;
    position: OcgPosition;
  } | null;
  targetCards?: {
    controller: number;
    location: OcgLocation;
    sequence: number;
    position: OcgPosition;
  }[];
  overlayCards?: number[];
  counters?: Record<number, number>;
  owner?: number;
  status?: number;
  isPublic?: boolean;
  leftScale?: number;
  rightScale?: number;
  link?: {
    rating: number;
    marker: OcgLinkMarker;
  };
  isHidden?: boolean;
};

export const DuelHandleSymbol = Symbol("duel-handle");

export interface OcgDuelHandle {
  [DuelHandleSymbol]: number;
}

export interface OcgCore {
  getVersion: () => readonly [number, number];
  createDuel: (options: OcgDuelOptions) => Promise<OcgDuelHandle | null>;
  destroyDuel: (handle: OcgDuelHandle) => void;
  duelNewCard: (
    handle: OcgDuelHandle,
    cardInfo: OcgNewCardInfo
  ) => Promise<void>;
  startDuel: (handle: OcgDuelHandle) => Promise<void>;
  duelProcess: (handle: OcgDuelHandle) => Promise<OcgProcessResult>;
  duelGetMessage: (handle: OcgDuelHandle) => OcgMessage[];
  duelSetResponse: (handle: OcgDuelHandle, response: OcgResponse) => void;
  loadScript: (
    handle: OcgDuelHandle,
    name: string,
    content: string
  ) => Promise<boolean>;
  duelQueryCount: (
    handle: OcgDuelHandle,
    team: number,
    location: OcgLocation
  ) => number;
  duelQuery: (
    handle: OcgDuelHandle,
    query: OcgQuery
  ) => Partial<OcgCardQueryInfo> | null;
  duelQueryLocation: (
    handle: OcgDuelHandle,
    query: OcgQueryLocation
  ) => (Partial<OcgCardQueryInfo> | null)[];
  duelQueryField: (handle: OcgDuelHandle) => OcgFieldState;
}

export type OcgCoreSync = {
  [F in keyof Omit<OcgCore, "createDuel">]: DepromisifyFunction<OcgCore[F]>;
} & { createDuel: (options: OcgDuelOptionsSync) => OcgDuelHandle | null };
