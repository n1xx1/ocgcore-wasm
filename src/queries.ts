import { BufferReader } from "./internal/buffer";
import { isInfoLocationEmpty, parseInfoLocation } from "./messages";
import {
  OcgAttribute,
  OcgDuelMode,
  OcgLocation,
  OcgPosition,
  OcgQueryFlags,
  OcgRace,
} from "./type_core";
import { OcgCardQueryInfo, OcgFieldPlayer, OcgFieldState } from "./types";

export function readQuery(reader: BufferReader) {
  const result: Partial<OcgCardQueryInfo> = {};

  while (reader.avail > 0) {
    let size = reader.u16();
    if (size === 0) {
      return null;
    }
    if (size < 4) {
      // error
      break;
    }

    const flag = reader.u32();
    size -= 4;

    if (flag === 0x80000000) {
      break;
    } else if (flag === OcgQueryFlags.CODE && size === 4) {
      result.code = reader.u32();
    } else if (flag === OcgQueryFlags.POSITION && size === 4) {
      result.position = reader.u32() as OcgPosition;
    } else if (flag === OcgQueryFlags.ALIAS && size === 4) {
      result.alias = reader.u32();
    } else if (flag === OcgQueryFlags.LEVEL && size === 4) {
      result.level = reader.u32();
    } else if (flag === OcgQueryFlags.RANK && size === 4) {
      result.rank = reader.u32();
    } else if (flag === OcgQueryFlags.ATTRIBUTE && size === 4) {
      result.attribute = reader.u32() as OcgAttribute;
    } else if (flag === OcgQueryFlags.RACE && size === 8) {
      result.race = reader.u64() as OcgRace;
    } else if (flag === OcgQueryFlags.ATTACK && size === 4) {
      result.attack = reader.u32();
    } else if (flag === OcgQueryFlags.DEFENSE && size === 4) {
      result.defense = reader.u32();
    } else if (flag === OcgQueryFlags.BASE_ATTACK && size === 4) {
      result.baseAttack = reader.u32();
    } else if (flag === OcgQueryFlags.BASE_DEFENSE && size === 4) {
      result.baseDefense = reader.u32();
    } else if (flag === OcgQueryFlags.REASON && size === 4) {
      result.reason = reader.u32();
    } else if (flag === OcgQueryFlags.COVER && size === 4) {
      result.cover = reader.u32();
    } else if (flag === OcgQueryFlags.REASON_CARD && size === 10) {
      const card = parseInfoLocation(reader);
      if (!isInfoLocationEmpty(card)) {
        result.reasonCard = card;
      }
    } else if (flag === OcgQueryFlags.EQUIP_CARD && size === 10) {
      const card = parseInfoLocation(reader);
      if (!isInfoLocationEmpty(card)) {
        result.equipCard = card;
      }
    } else if (flag === OcgQueryFlags.TARGET_CARD && size >= 4) {
      result.overlayCards = [];
      const length = reader.u32();
      for (let i = 0; i < length; i++) {
        result.overlayCards.push(reader.u32());
      }
    } else if (flag === OcgQueryFlags.COUNTERS && size >= 4) {
      result.counters = {};
      const length = reader.u32();
      for (let i = 0; i < length; i++) {
        const count = reader.u16();
        const kind = reader.u16();
        result.counters[kind] = count;
      }
    } else if (flag === OcgQueryFlags.OWNER && size === 1) {
      result.owner = reader.u8();
    } else if (flag === OcgQueryFlags.STATUS && size === 4) {
      result.status = reader.u32();
    } else if (flag === OcgQueryFlags.IS_PUBLIC && size === 1) {
      result.isPublic = !!reader.u8();
    } else if (flag === OcgQueryFlags.RSCALE && size === 4) {
      result.rightScale = reader.u32();
    } else if (flag === OcgQueryFlags.LSCALE && size === 4) {
      result.leftScale = reader.u32();
    } else if (flag === OcgQueryFlags.IS_HIDDEN && size === 1) {
      result.isHidden = !!reader.u8();
    } else if (flag === OcgQueryFlags.LINK && size === 8) {
      const rating = reader.u32();
      const marker = reader.u32();
      result.link = {
        rating,
        marker,
      };
    }
  }
  return result;
}

export function readQueryLocation(reader: BufferReader) {
  const size = reader.u32();
  const cards: (Partial<OcgCardQueryInfo> | null)[] = [];
  while (reader.avail > 0) {
    cards.push(readQuery(reader));
  }
  return cards;
}

export function readField(reader: BufferReader): OcgFieldState {
  return {
    flags: BigInt(reader.u32()) as OcgDuelMode,
    players: Array.from(
      { length: 2 },
      () =>
        ({
          lp: reader.u32(),
          monsters: Array.from({ length: 7 }, () =>
            reader.u8() != 0
              ? {
                  position: reader.u8(),
                  materials: reader.u32(),
                }
              : null
          ) as OcgFieldPlayer["monsters"],
          spells: Array.from({ length: 8 }, () =>
            reader.u8() != 0
              ? {
                  position: reader.u8(),
                  materials: reader.u32(),
                }
              : null
          ) as OcgFieldPlayer["spells"],
          deck_size: reader.u32(),
          hand_size: reader.u32(),
          grave_size: reader.u32(),
          banish_size: reader.u32(),
          extra_size: reader.u32(),
          extra_faceup_count: reader.u32(),
        } as OcgFieldPlayer)
    ) as [OcgFieldPlayer, OcgFieldPlayer],
    chain: Array.from({ length: reader.u32() }, () => ({
      code: reader.u32(),
      ...parseInfoLocation(reader),
      triggering_controller: reader.u8(),
      triggering_location: reader.u8() as OcgLocation,
      triggering_sequence: reader.u32(),
      description: reader.u64(),
    })),
  };
}
