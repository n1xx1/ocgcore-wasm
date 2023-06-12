import {
  OcgAttribute,
  OcgDuelMode,
  OcgLinkMarker,
  OcgLocation,
  OcgLogType,
  OcgPosition,
  OcgQueryFlags,
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
  scriptReader: (name: string) => Promise<string | null> | string | null;
  errorHandler?: (type: OcgLogType, text: string) => void;
}

export type OcgQuery = {
  flags: OcgQueryFlags;
  controller: number;
  location: OcgLocation;
  sequence: number;
  overlaySequence: number;
};

export type OcgQueryLocation = Omit<OcgQuery, "sequence" | "overlaySequence">;
