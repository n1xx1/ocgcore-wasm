import { BufferReader } from "./internal/buffer";
import { readField } from "./queries";
import {
  OcgAttribute,
  OcgHintType,
  OcgLocation,
  OcgPhase,
  OcgPosition,
  OcgRace,
} from "./type_core";
import { OcgLocPos, OcgMessage, OcgMessageType } from "./type_message";

export function parseInfoLocation(reader: BufferReader): OcgLocPos {
  const controller = reader.u8();
  const location = reader.u8() as OcgLocation;
  const sequence = reader.u32();
  const position = reader.u32() as OcgPosition;

  if (location & OcgLocation.OVERLAY) {
    return {
      controller,
      location: (location & ~OcgLocation.OVERLAY) as OcgLocation,
      sequence,
      position: OcgPosition.FACEUP_ATTACK,
      overlay_sequence: position,
    };
  } else {
    return {
      controller,
      location,
      sequence,
      position,
    };
  }
}

export function isInfoLocationEmpty(loc: OcgLocPos) {
  return (
    !loc.controller &&
    !loc.location &&
    !loc.sequence &&
    !loc.position &&
    !loc.overlay_sequence
  );
}

export function readMessage(reader: BufferReader): OcgMessage | null {
  const type: OcgMessageType = reader.u8();
  switch (type) {
    case OcgMessageType.RETRY:
      return {
        type,
      };
    case OcgMessageType.HINT:
      return {
        type,
        hint_type: reader.u8() as OcgHintType,
        player: reader.u8(),
        hint: reader.avail > 4 ? reader.u64() : BigInt(reader.u32()),
      };
    case OcgMessageType.WIN:
      return {
        type,
        player: reader.u8(),
        reason: reader.u8(),
      };
    case OcgMessageType.SELECT_BATTLECMD:
      return {
        type,
        player: reader.u8(),
        chains: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
          description: reader.u64(),
          client_mode: reader.u8(),
        })),
        attacks: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u8(),
          can_direct: reader.u8() != 0,
        })),
        to_m2: reader.u8() != 0,
        to_ep: reader.u8() != 0,
      };
    case OcgMessageType.SELECT_IDLECMD:
      return {
        type,
        player: reader.u8(),
        summons: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
        })),
        special_summons: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
        })),
        pos_changes: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u8(),
        })),
        monster_sets: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
        })),
        spell_sets: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
        })),
        activates: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
          description: reader.u64(),
          client_mode: reader.u8(),
        })),
        to_bp: reader.u8() != 0,
        to_ep: reader.u8() != 0,
        shuffle: reader.u8() != 0,
      };
    case OcgMessageType.SELECT_EFFECTYN:
      return {
        type,
        player: reader.u8(),
        code: reader.u32(),
        ...parseInfoLocation(reader),
        description: reader.u64(),
      };
    case OcgMessageType.SELECT_YESNO:
      return {
        type,
        player: reader.u8(),
        description: reader.u64(),
      };
    case OcgMessageType.SELECT_OPTION:
      return {
        type,
        player: reader.u8(),
        options: Array.from({ length: reader.u8() }, () => reader.u64()),
      };
    case OcgMessageType.SELECT_CARD:
      return {
        type,
        player: reader.u8(),
        can_cancel: reader.u8() != 0,
        min: reader.u32(),
        max: reader.u32(),
        selects: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          ...parseInfoLocation(reader),
        })),
      };
    case OcgMessageType.SELECT_CHAIN:
      return {
        type,
        player: reader.u8(),
        spe_count: reader.u8(),
        forced: reader.u8() != 0,
        hint_timing: reader.u32(),
        hint_timing_other: reader.u32(),
        selects: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          ...parseInfoLocation(reader),
          description: reader.u64(),
          client_mode: reader.u8(),
        })),
      };
    case OcgMessageType.SELECT_PLACE:
      return {
        type,
        player: reader.u8(),
        count: reader.u8(),
        field_mask: reader.u32(),
      };
    case OcgMessageType.SELECT_POSITION:
      return {
        type,
        player: reader.u8(),
        code: reader.u32(),
        positions: reader.u8() as OcgPosition,
      };
    case OcgMessageType.SELECT_TRIBUTE:
      return {
        type,
        player: reader.u8(),
        can_cancel: reader.u8() != 0,
        min: reader.u32(),
        max: reader.u32(),
        selects: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
          release_param: reader.u8(),
        })),
      };
    case OcgMessageType.SORT_CHAIN:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u32() as OcgLocation,
          sequence: reader.u32(),
        })),
      };
    case OcgMessageType.SELECT_COUNTER:
      return {
        type,
        player: reader.u8(),
        counter_type: reader.u16(),
        count: reader.u16(),
        cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u8(),
          count: reader.u16(),
        })),
      };
    case OcgMessageType.SELECT_SUM:
      return {
        type,
        player: reader.u8(),
        select_max: reader.u8(),
        amount: reader.u32(),
        min: reader.u32(),
        max: reader.u32(),
        selects: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
          amount: reader.u32(),
        })),
        selects_must: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
          amount: reader.u32(),
        })),
      };
    case OcgMessageType.SELECT_DISFIELD:
      return {
        type,
        player: reader.u8(),
        count: reader.u8(),
        field_mask: reader.u32(),
      };
    case OcgMessageType.SORT_CARD:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u32() as OcgLocation,
          sequence: reader.u32(),
        })),
      };
    case OcgMessageType.SELECT_UNSELECT_CARD:
      return {
        type,
        player: reader.u8(),
        can_finish: reader.u8() != 0,
        can_cancel: reader.u8() != 0,
        min: reader.u32(),
        max: reader.u32(),
        select_cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          ...parseInfoLocation(reader),
        })),
        unselect_cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          ...parseInfoLocation(reader),
        })),
      };
    case OcgMessageType.CONFIRM_DECKTOP:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
        })),
      };
    case OcgMessageType.CONFIRM_CARDS:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
        })),
      };
    case OcgMessageType.SHUFFLE_DECK:
      return {
        type,
        player: reader.u8(),
      };
    case OcgMessageType.SHUFFLE_HAND:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => reader.u32()),
      };
    case OcgMessageType.REFRESH_DECK:
      return {
        type,
      };
    case OcgMessageType.SWAP_GRAVE_DECK:
      let deck_size: number;
      return {
        type,
        player: reader.u8(),
        deck_size: (deck_size = reader.u32()),
        returned_to_extra: (() => {
          // TODO: check
          const ret: number[] = [];
          const bytes = reader.bytes(reader.u32());
          for (let i = 0; i < deck_size; i++) {
            const value = bytes[Math.floor(i / 8)] & (1 << i % 8);
            if (value) {
              ret.push(i);
            }
          }
          return ret;
        })(),
      };
    case OcgMessageType.SHUFFLE_SET_CARD:
      return {
        type,
        location: reader.u8() as OcgLocation,
        cards: Array.from({ length: reader.u32() }, () => ({
          from: parseInfoLocation(reader),
          to: parseInfoLocation(reader),
        })),
      };
    case OcgMessageType.REVERSE_DECK:
      return {
        type,
      };
    case OcgMessageType.DECK_TOP:
      return {
        type,
        player: reader.u8(),
        count: reader.u32(),
        code: reader.u32(),
        position: reader.u32() as OcgPosition,
      };
    case OcgMessageType.SHUFFLE_EXTRA:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => reader.u32()),
      };
    case OcgMessageType.NEW_TURN:
      return {
        type,
        player: reader.u8(),
      };
    case OcgMessageType.NEW_PHASE:
      return {
        type,
        phase: reader.u16() as OcgPhase,
      };
    case OcgMessageType.CONFIRM_EXTRATOP:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8() as OcgLocation,
          sequence: reader.u32(),
        })),
      };
    case OcgMessageType.MOVE:
      return {
        type,
        card: reader.u32(),
        from: parseInfoLocation(reader),
        to: parseInfoLocation(reader),
      };
    case OcgMessageType.POS_CHANGE:
      return {
        type,
        code: reader.u32(),
        controller: reader.u8(),
        location: reader.u8() as OcgLocation,
        sequence: reader.u8(),
        prev_position: reader.u8() as OcgPosition,
        position: reader.u8() as OcgPosition,
      };
    case OcgMessageType.SET:
      return {
        type,
        code: reader.u32(),
        ...parseInfoLocation(reader),
      };
    case OcgMessageType.SWAP:
      return {
        type,
        card1: {
          code: reader.u32(),
          ...parseInfoLocation(reader),
        },
        card2: {
          code: reader.u32(),
          ...parseInfoLocation(reader),
        },
      };
    case OcgMessageType.FIELD_DISABLED:
      return {
        type,
        field_mask: reader.u32(),
      };
    case OcgMessageType.SUMMONING:
      return {
        type,
        code: reader.u32(),
        ...parseInfoLocation(reader),
      };
    case OcgMessageType.SUMMONED:
      return {
        type,
      };
    case OcgMessageType.SPSUMMONING:
      return {
        type,
        code: reader.u32(),
        ...parseInfoLocation(reader),
      };
    case OcgMessageType.SPSUMMONED:
      return {
        type,
      };
    case OcgMessageType.FLIPSUMMONING:
      return {
        type,
        code: reader.u32(),
        ...parseInfoLocation(reader),
      };
    case OcgMessageType.FLIPSUMMONED:
      return {
        type,
      };
    case OcgMessageType.CHAINING:
      return {
        type,
        code: reader.u32(),
        ...parseInfoLocation(reader),
        triggering_controller: reader.u8(),
        triggering_location: reader.u8() as OcgLocation,
        triggering_sequence: reader.u32(),
        description: reader.u64(),
        chain_size: reader.u32(),
      };
    case OcgMessageType.CHAINED:
      return {
        type,
        chain_size: reader.u8(),
      };
    case OcgMessageType.CHAIN_SOLVING:
      return {
        type,
        chain_size: reader.u8(),
      };
    case OcgMessageType.CHAIN_SOLVED:
      return {
        type,
        chain_size: reader.u8(),
      };
    case OcgMessageType.CHAIN_END:
      return {
        type,
      };
    case OcgMessageType.CHAIN_NEGATED:
      return {
        type,
        chain_size: reader.u8(),
      };
    case OcgMessageType.CHAIN_DISABLED:
      return {
        type,
        chain_size: reader.u8(),
      };
    case OcgMessageType.CARD_SELECTED:
      return {
        type,
        cards: Array.from({ length: reader.u32() }, () =>
          parseInfoLocation(reader)
        ),
      };
    case OcgMessageType.RANDOM_SELECTED:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () =>
          parseInfoLocation(reader)
        ),
      };
    case OcgMessageType.BECOME_TARGET:
      return {
        type,
        cards: Array.from({ length: reader.u32() }, () =>
          parseInfoLocation(reader)
        ),
      };
    case OcgMessageType.DRAW:
      return {
        type,
        player: reader.u8(),
        drawn: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          position: reader.u32() as OcgPosition,
        })),
      };
    case OcgMessageType.DAMAGE:
      return {
        type,
        player: reader.u8(),
        amount: reader.u32(),
      };
    case OcgMessageType.RECOVER:
      return {
        type,
        player: reader.u8(),
        amount: reader.u32(),
      };
    case OcgMessageType.EQUIP:
      return {
        type,
        card: parseInfoLocation(reader),
        target: parseInfoLocation(reader),
      };
    case OcgMessageType.LPUPDATE:
      return {
        type,
        player: reader.u8(),
        lp: reader.u32(),
      };
    case OcgMessageType.CARD_TARGET:
      return {
        type,
        card: parseInfoLocation(reader),
        target: parseInfoLocation(reader),
      };
    case OcgMessageType.CANCEL_TARGET:
      return {
        type,
        card: parseInfoLocation(reader),
        target: parseInfoLocation(reader),
      };
    case OcgMessageType.PAY_LPCOST:
      return {
        type,
        player: reader.u8(),
        amount: reader.u32(),
      };
    case OcgMessageType.ADD_COUNTER:
      return {
        type,
        counter_type: reader.u16(),
        controller: reader.u8(),
        location: reader.u8() as OcgLocation,
        sequence: reader.u8(),
        count: reader.u16(),
      };
    case OcgMessageType.REMOVE_COUNTER:
      return {
        type,
        counter_type: reader.u16(),
        controller: reader.u8(),
        location: reader.u8() as OcgLocation,
        sequence: reader.u8(),
        count: reader.u16(),
      };
    case OcgMessageType.ATTACK:
      return {
        type,
        card: parseInfoLocation(reader),
        target: (() => {
          const loc = parseInfoLocation(reader);
          if (isInfoLocationEmpty(loc)) {
            return null;
          }
          return loc;
        })(),
      };
    case OcgMessageType.BATTLE:
      return {
        type,
        card: {
          ...parseInfoLocation(reader),
          attack: reader.u32(),
          defense: reader.u32(),
          destroyed: reader.u8() != 0,
        },
        target: {
          ...parseInfoLocation(reader),
          attack: reader.u32(),
          defense: reader.u32(),
          destroyed: reader.u8() != 0,
        },
      };
    case OcgMessageType.ATTACK_DISABLED:
      return {
        type,
      };
    case OcgMessageType.DAMAGE_STEP_START:
      return {
        type,
      };
    case OcgMessageType.DAMAGE_STEP_END:
      return {
        type,
      };
    case OcgMessageType.MISSED_EFFECT:
      return {
        type,
        ...parseInfoLocation(reader),
        code: reader.u32(),
      };
    case OcgMessageType.BE_CHAIN_TARGET:
      return {
        type,
      };
    case OcgMessageType.CREATE_RELATION:
      return {
        type,
      };
    case OcgMessageType.RELEASE_RELATION:
      return {
        type,
      };
    case OcgMessageType.TOSS_COIN:
      return {
        type,
        player: reader.u8(),
        results: Array.from({ length: reader.u8() }, () => reader.u8() != 0),
      };
    case OcgMessageType.TOSS_DICE:
      return {
        type,
        player: reader.u8(),
        results: Array.from({ length: reader.u8() }, () => reader.u8()),
      };
    case OcgMessageType.ROCK_PAPER_SCISSORS:
      return {
        type,
        player: reader.u8(),
      };
    case OcgMessageType.HAND_RES:
      return {
        type,
        results: (() => {
          const result = reader.u8();
          return [result & 0b11, (result >> 2) & 0b11] as const;
        })(),
      };
    case OcgMessageType.ANNOUNCE_RACE:
      return {
        type,
        player: reader.u8(),
        count: reader.u8(),
        available: reader.u64() as OcgRace,
      };
    case OcgMessageType.ANNOUNCE_ATTRIB:
      return {
        type,
        player: reader.u8(),
        count: reader.u8(),
        available: reader.u8() as OcgAttribute,
      };
    case OcgMessageType.ANNOUNCE_CARD:
      return {
        type,
        player: reader.u8(),
        opcodes: Array.from({ length: reader.u8() }, () => reader.u64()),
      };
    case OcgMessageType.ANNOUNCE_NUMBER:
      return {
        type,
        player: reader.u8(),
        options: Array.from({ length: reader.u8() }, () => reader.u64()),
      };
    case OcgMessageType.CARD_HINT:
      return {
        type,
        ...parseInfoLocation(reader),
        card_hint: reader.u8(),
        description: reader.u64(),
      };
    case OcgMessageType.TAG_SWAP: {
      const player = reader.u8();
      const deck_size = reader.u32();
      const extra_size = reader.u32();
      const extra_faceup_count = reader.u32();
      const hand_length = reader.u32();
      const deck_top_card = reader.u32();
      return {
        type,
        player,
        deck_size,
        extra_faceup_count,
        deck_top_card: deck_top_card == 0 ? null : deck_top_card,
        hand: Array.from({ length: hand_length }, () => ({
          code: reader.u32(),
          position: reader.u32() as OcgPosition,
        })),
        extra: Array.from({ length: extra_size }, () => ({
          code: reader.u32(),
          position: reader.u32() as OcgPosition,
        })),
      };
    }
    case OcgMessageType.RELOAD_FIELD:
      return {
        type,
        ...readField(reader),
      };
    case OcgMessageType.AI_NAME:
      return {
        type,
        name: (() => {
          const name = reader.bytes(reader.u16());
          return new TextDecoder().decode(name);
        })(),
      };
    case OcgMessageType.SHOW_HINT:
      return {
        type,
        hint: (() => {
          const hint = reader.bytes(reader.u16());
          return new TextDecoder().decode(hint);
        })(),
      };
    case OcgMessageType.PLAYER_HINT:
      return {
        type,
        player: reader.u8(),
        player_hint: reader.u8(),
        description: reader.u64(),
      };
    case OcgMessageType.MATCH_KILL:
      return {
        type,
        card: reader.u32(),
      };
    case OcgMessageType.CUSTOM_MSG:
      return {
        type,
      };
    case OcgMessageType.REMOVE_CARDS:
      return {
        type,
        cards: Array.from({ length: reader.u32() }, () =>
          parseInfoLocation(reader)
        ),
      };
    default:
      return null;
  }
}
