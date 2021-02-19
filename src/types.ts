import {
  OcgAttribute,
  OcgDuelMode,
  OcgLinkMarker,
  OcgLocation,
  OcgLogType,
  OcgPosition,
  OcgRace,
  OcgType,
} from "./type_core";

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
  con: number;
  loc: OcgLocation;
  seq: number;
  pos: OcgPosition;
}

export interface OcgDuelOptions {
  flags: OcgDuelMode;
  seed: number;
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
  cardReader: (card: number) => OcgCardData;
  scriptReader: (name: string) => boolean;
  errorHandler?: (type: OcgLogType, text: string) => void;
}
