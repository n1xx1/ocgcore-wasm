import { InternalDepromisifyFunction } from "./internal/utils";
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
import { OcgDuelHandle } from "./type_handle";
import { OcgFieldState, OcgMessage } from "./type_message";
import { OcgResponse } from "./type_response";

export type { OcgDuelHandle };

/**
 * Card data definition. These values should be imported as is from the
 * cards.cdb of the card database you want to use. These will be requested
 * in {@link OcgDuelOptions#cardReader}.
 *
 * EdoPro card database: {@link https://github.com/ProjectIgnis/BabelCDB}
 */
export interface OcgCardData {
  /** Passcode. */
  code: number;
  /** The passcode alias, 0 if it doesn't have any. */
  alias: number;
  /** Codes of all the sets (archetypes) this card is a part of. */
  setcodes: number[];
  /** Card type. */
  type: OcgType | (number & {});
  /** Level, rank or link rating, 0 if not applicable. */
  level: number;
  /** Monster attribute, 0 if not applicable. */
  attribute: OcgAttribute | (number & {});
  /** Monster race, 0 if not applicable. */
  race: OcgRace | (bigint & {});
  /** Monster card attack, 0 if not applicable. */
  attack: number;
  /** Monster card defense, 0 if not applicable. */
  defense: number;
  /** Left pendulum scale, 0 if not applicable. */
  lscale: number;
  /** Right pendulum scale, 0 if not applicable. */
  rscale: number;
  /** Link markers bitmask. */
  link_marker: OcgLinkMarker | (number & {});
}

/**
 * Card creation definition. Used in {@link OcgCore#duelNewCard}.
 */
export interface OcgNewCardInfo {
  /** Owner team. */
  team: 0 | 1;
  /** Owner duelist index, always 0 unless it's a tag duel. */
  duelist: number;
  /** Card passcode. */
  code: number;
  /** Current controller of the card. Usually same as team. */
  controller: 0 | 1;
  /** Current location of the card. If duelist isn't 0 then it should always be {@link OcgLocation#DECK} or {@link OcgLocation#EXTRA} */
  location: OcgLocation;
  /**
   * Index of the card in the specified location.
   * If location is DECK then if sequence == 0 it's the top, if sequence == 1 it's the bottom, otherwise the deck is shuffled.
   * If location is EXTRA, REMOVED, GRAVE, or HAND it's ignored.
   */
  sequence: number;
  /** Position, may be automatically overriden depending on the location. */
  position: OcgPosition;
}

/**
 * Duel creation options.
 */
export interface OcgDuelOptions {
  /** Duel flags */
  flags: OcgDuelMode | (bigint & {});
  /** Xoshiro256** seed. Don't use [0n,0n,0n,0n] */
  seed: [bigint, bigint, bigint, bigint];
  /** Team 1 settings. */
  team1: OcgDuelOptionsTeam;
  /** Team 2 settings. */
  team2: OcgDuelOptionsTeam;
  /** Requests card infos for the given passcode. */
  cardReader: (
    card: number
  ) => Promise<OcgCardData | null> | OcgCardData | null;
  /** Requests the script contents for the given path. */
  scriptReader: (name: string) => Promise<string> | string;
  /** Handle script or core errors. */
  errorHandler?: (type: OcgLogType, text: string) => void;
}

/**
 * Duel creation team settings.
 */
export interface OcgDuelOptionsTeam {
  /** Starting life points. */
  startingLP: number;
  /** Initial hand size. */
  startingDrawCount: number;
  /** How many cards are drawn per turn. */
  drawCountPerTurn: number;
}

/**
 * Remapped options for the sync version of the core.
 */
export type OcgDuelOptionsSync = {
  [F in keyof OcgDuelOptions]: InternalDepromisifyFunction<OcgDuelOptions[F]>;
};

/**
 * Query interface to request information about a location.
 */
export interface OcgQuery {
  /** Informations to requests. */
  flags: OcgQueryFlags;
  /** Controller of the card. */
  controller: 0 | 1;
  /** Card location. */
  location: OcgLocation;
  /** Index sequence in location.  */
  sequence: number;
  /** Overlay card sequence, used when `(location & OcgLocation.OVERLAY) != 0`. */
  overlaySequence: number;
}

export type OcgQueryLocation = Omit<OcgQuery, "sequence" | "overlaySequence">;

export type OcgCardQueryInfo = {
  /** Passcode, requested by {@link OcgQueryFlags#CODE}. */
  code?: number;
  /** Position, requested by {@link OcgQueryFlags#POSITION}. */
  position?: OcgPosition;
  /** Alias, requested by {@link OcgQueryFlags#ALIAS}. */
  alias?: number;
  /** Type, requested by {@link OcgQueryFlags#TYPE}. */
  type?: OcgType;
  /** Level, requested by {@link OcgQueryFlags#LEVEL}. */
  level?: number;
  /** Rank, requested by {@link OcgQueryFlags#RANK}. */
  rank?: number;
  /** Attribute, requested by {@link OcgQueryFlags#ATTRIBUTE}. */
  attribute?: OcgAttribute;
  /** Race, requested by {@link OcgQueryFlags#RACE}. */
  race?: OcgRace;
  /** Attack, requested by {@link OcgQueryFlags#ATTACK}. */
  attack?: number;
  /** Defense, requested by {@link OcgQueryFlags#DEFENSE}. */
  defense?: number;
  /** Base attack, requested by {@link OcgQueryFlags#BASE_ATTACK}. */
  baseAttack?: number;
  /** Base defense, requested by {@link OcgQueryFlags#BASE_DEFENSE}. */
  baseDefense?: number;
  /** Reason, requested by {@link OcgQueryFlags#REASON}. */
  reason?: number;
  /** Cover, requested by {@link OcgQueryFlags#COVER}. */
  cover?: number;
  /** Reason card, requested by {@link OcgQueryFlags#REASON_CARD}. */
  reasonCard?: OcgCardQueryInfoCard | null;
  /** Equip card, requested by {@link OcgQueryFlags#EQUIP_CARD}. */
  equipCard?: OcgCardQueryInfoCard | null;
  /** Target cards, requested by {@link OcgQueryFlags#TARGET_CARD}. */
  targetCards?: OcgCardQueryInfoCard[];
  /** Overlay card codes, requested by {@link OcgQueryFlags#OVERLAY_CARD}. */
  overlayCards?: number[];
  /** Counters, requested by {@link OcgQueryFlags#COUNTERS}. */
  counters?: Record<number, number>;
  /** Owner, requested by {@link OcgQueryFlags#OWNER}. */
  owner?: number;
  /** Status, requested by {@link OcgQueryFlags#STATUS}. */
  status?: number;
  /** Is public, requested by {@link OcgQueryFlags#IS_PUBLIC}. */
  isPublic?: boolean;
  /** Left scale, requested by {@link OcgQueryFlags#LSCALE}. */
  leftScale?: number;
  /** Right scale, requested by {@link OcgQueryFlags#RSCALE}. */
  rightScale?: number;
  /** Link arrows, requested by {@link OcgQueryFlags#LINK}. */
  link?: {
    /** Rating. */
    rating: number;
    /** Link arrows mask. */
    marker: OcgLinkMarker;
  };
  /** Is hidden, requested by {@link OcgQueryFlags#IS_HIDDEN}. */
  isHidden?: boolean;
};

/** Returned cards by {@link OcgCardQueryInfo}. */
export interface OcgCardQueryInfoCard {
  /** Controller. */
  controller: 0 | 1;
  /** Location. */
  location: OcgLocation;
  /** Sequence. */
  sequence: number;
  /** Position. */
  position: OcgPosition;
}

/** OcgCore interface. */
export interface OcgCore {
  /**
   * Request the ocgcore version.
   * @returns The [major, minor] version tuple.
   */
  getVersion(): readonly [number, number];
  /**
   * Create a duel instance.
   * @param options - Creation options.
   * @returns null if the creation failed, a duel handle otherwise.
   */
  createDuel(options: OcgDuelOptions): Promise<OcgDuelHandle | null>;
  /**
   * Deallocates the specified duel.
   * @param handle - A duel handle.
   */
  destroyDuel(handle: OcgDuelHandle): void;
  /**
   * Add a new card to the duel.
   * @param handle - A duel handle.
   * @param cardInfo - The card that will be added.
   */
  duelNewCard(handle: OcgDuelHandle, cardInfo: OcgNewCardInfo): Promise<void>;
  /**
   * Triggers the start of the duel.
   * @param handle - A duel handle.
   */
  startDuel(handle: OcgDuelHandle): Promise<void>;
  /**
   * Performs a process step of the duel.
   * @param handle - A duel handle.
   * @returns The result of the process step.
   *
   * ```ts
   * while (true) {
   *   const status = await lib.duelProcess(handle);
   *   const messages = lib.duelGetMessage(handle);
   *   // handle messages
   *   if (status === OcgProcessResult.END) break;
   *   if (status === OcgProcessResult.CONTINUE) continue;
   *   // reply
   * }
   * ```
   */
  duelProcess(handle: OcgDuelHandle): Promise<OcgProcessResult>;
  /**
   * Get the list of the messages between the last two {@link OcgCore#duelProcess} calls.
   * @param handle - A duel handle.
   * @returns A list of messages.
   */
  duelGetMessage(handle: OcgDuelHandle): OcgMessage[];
  /**
   * Sets the response, called after {@link OcgCore#duelProcess} returns {@link OcgProcessResult#WAITING}.
   * @param handle - A duel handle.
   * @param response - Response object.
   */
  duelSetResponse(handle: OcgDuelHandle, response: OcgResponse): void;
  /**
   * Make the core load and execute the specified script.
   * @param handle - A duel handle
   * @param name - Name of the loaded script.
   * @param content - Contents of the loaded script.
   */
  loadScript(
    handle: OcgDuelHandle,
    name: string,
    content: string
  ): Promise<boolean>;
  /**
   * Counts the number of card of the specified player and location.
   * @param handle - A duel handle
   * @param team - The player to query
   * @param location - The location to query
   * @returns The number of cards.
   */
  duelQueryCount(
    handle: OcgDuelHandle,
    team: number,
    location: OcgLocation
  ): number;
  /**
   * Queries a specific card pulling only the requested informations ({@link OcgQuery#flags})
   * @param handle - A duel handle
   * @param query - The query request
   * @returns An object with all the requested infos.
   */
  duelQuery(
    handle: OcgDuelHandle,
    query: OcgQuery
  ): Partial<OcgCardQueryInfo> | null;
  /**
   * Like {@link OcgCore.duelQuery} but for all the cards in the specified location.
   * @param handle - A duel handle
   * @param query - The query request
   * @returns A list of objects with all the requested infos.
   */
  duelQueryLocation(
    handle: OcgDuelHandle,
    query: OcgQueryLocation
  ): (Partial<OcgCardQueryInfo> | null)[];
  /**
   * Queries the current field state.
   * @param handle - A duel handle
   * @returns The current field state.
   */
  duelQueryField(handle: OcgDuelHandle): OcgFieldState;
}

export type OcgCoreSync = {
  [F in keyof Omit<OcgCore, "createDuel">]: InternalDepromisifyFunction<
    OcgCore[F]
  >;
} & { createDuel: (options: OcgDuelOptionsSync) => OcgDuelHandle | null };

export * from "./type_core";

export * from "./type_message";

export * from "./type_response";

export * from "./type_serialize";
