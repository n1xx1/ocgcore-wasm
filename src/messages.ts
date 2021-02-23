import { BufferReader } from "./internal/buffer";
import { messageTypeStrings } from "./types";
import { OcgMessage, OcgMessageType } from "./type_message";

export function readMessage(reader: BufferReader): OcgMessage {
  const type: OcgMessageType = reader.u8();
  console.log(messageTypeStrings[type]);

  switch (type) {
    case OcgMessageType.HINT:
      return {
        type,
        hint_type: reader.u8(),
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
          location: reader.u8(),
          sequence: reader.u32(),
          description: reader.u64(),
          client_mode: reader.u8(),
        })),
        attacks: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
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
          location: reader.u8(),
          sequence: reader.u32(),
        })),
        special_summons: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
        })),
        pos_changes: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u8(),
        })),
        monster_sets: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
        })),
        spell_sets: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
        })),
        activates: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          description: reader.u64(),
          client_mode: reader.u32(),
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
        controller: reader.u8(),
        location: reader.u8(),
        sequence: reader.u32(),
        position: reader.u32(),
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
        selects: Array.from({ length: reader.u8() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          position: reader.u32(),
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
        selects: Array.from({ length: reader.u8() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          position: reader.u32(),
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
        player: reader.u32(),
        code: reader.u32(),
        positions: reader.u8(),
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
          location: reader.u8(),
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
          location: reader.u32(),
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
          location: reader.u8(),
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
          location: reader.u8(),
          sequence: reader.u32(),
          amount: reader.u32(),
        })),
        selects_must: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
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
          location: reader.u32(),
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
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          position: reader.u32(),
        })),
        unselect_cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          position: reader.u32(),
        })),
      };
    case OcgMessageType.CONFIRM_DECKTOP:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
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
          location: reader.u8(),
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
        location: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => ({
          from: {
            controller: reader.u8(),
            location: reader.u8(),
            sequence: reader.u32(),
            position: reader.u32(),
          },
          to: {
            controller: reader.u8(),
            location: reader.u8(),
            sequence: reader.u32(),
            position: reader.u32(),
          },
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
        position: reader.u32(),
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
        phase: reader.u16(),
      };
    case OcgMessageType.CONFIRM_EXTRATOP:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => ({
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
        })),
      };
    case OcgMessageType.MOVE:
      return {
        type,
        card: reader.u32(),
        from: {
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          position: reader.u32(),
        },
        to: {
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          position: reader.u32(),
        },
      };
    case OcgMessageType.POS_CHANGE:
      return {
        type,
        code: reader.u32(),
        controller: reader.u8(),
        location: reader.u8(),
        sequence: reader.u8(),
        prev_position: reader.u8(),
        position: reader.u8(),
      };
    case OcgMessageType.SET:
      return {
        type,
        code: reader.u32(),
        controller: reader.u8(),
        location: reader.u8(),
        sequence: reader.u32(),
        position: reader.u32(),
      };
    case OcgMessageType.SWAP:
      return {
        type,
        card1: {
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          position: reader.u32(),
        },
        card2: {
          code: reader.u32(),
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          position: reader.u32(),
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
        controller: reader.u8(),
        location: reader.u8(),
        sequence: reader.u32(),
        position: reader.u32(),
      };
    case OcgMessageType.SUMMONED:
      return {
        type,
      };
    case OcgMessageType.SPSUMMONING:
      return {
        type,
        code: reader.u32(),
        controller: reader.u8(),
        location: reader.u8(),
        sequence: reader.u32(),
        position: reader.u32(),
      };
    case OcgMessageType.SPSUMMONED:
      return {
        type,
      };
    case OcgMessageType.FLIPSUMMONING:
      return {
        type,
        code: reader.u32(),
        controller: reader.u8(),
        location: reader.u8(),
        sequence: reader.u32(),
        position: reader.u32(),
      };
    case OcgMessageType.FLIPSUMMONED:
      return {
        type,
      };
    case OcgMessageType.CHAINING:
      return {
        type,
        code: reader.u32(),
        controller: reader.u8(),
        location: reader.u8(),
        sequence: reader.u32(),
        position: reader.u32(),
        triggering_controller: reader.u8(),
        triggering_location: reader.u8(),
        triggering_sequence: reader.u32(),
        description: reader.u64(),
        chain_size: reader.u32(),
      };
    case OcgMessageType.CHAINED:
      return {
        type,
        chain_size: reader.u32(),
      };
    case OcgMessageType.CHAIN_SOLVING:
      return {
        type,
        chain_size: reader.u32(),
      };
    case OcgMessageType.CHAIN_SOLVED:
      return {
        type,
        chain_size: reader.u32(),
      };
    case OcgMessageType.CHAIN_END:
      return {
        type,
      };
    case OcgMessageType.CHAIN_NEGATED:
      return {
        type,
        chain_size: reader.u32(),
      };
    case OcgMessageType.CHAIN_DISABLED:
      return {
        type,
        chain_size: reader.u32(),
      };
    case OcgMessageType.CARD_SELECTED:
      return {
        type,
        cards: Array.from({ length: reader.u32() }, () => ({
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          position: reader.u32(),
        })),
      };
    case OcgMessageType.RANDOM_SELECTED:
      return {
        type,
        player: reader.u8(),
        cards: Array.from({ length: reader.u32() }, () => ({
          controller: reader.u8(),
          location: reader.u8(),
          sequence: reader.u32(),
          position: reader.u32(),
        })),
      };
    // READ_VALUE(cardsngth, uint32);
    // Array cards = Array::New(env, cardsngth);
    // Object value = Object::New(env);
    // cards.Set(i, value);
    //       }
    // message.Set("cards", cards);
    case OcgMessageType.BECOME_TARGET:
      return {
        type,
      };
    // READ_VALUE(cardsngth, uint32);
    // Array cards = Array::New(env, cardsngth);
    // cards: Array.from({ length: reader.u() }, () => ({
    // Object value = Object::New(env);
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // cards.Set(i, value);
    //       }
    // message.Set("cards", cards);
    case OcgMessageType.DRAW:
      return {
        type,
      };
    // player: reader.u8(),
    // READ_VALUE(drawnLength, uint32);
    // Array drawn = Array::New(env, drawnLength);
    // drawnLe: Array.from({ length: reader.u() }, () => ({
    // Object value = Object::New(env);
    // code: reader.u32(),
    // position: reader.u32(),
    // drawn.Set(i, value);
    //       }
    // message.Set("drawn", drawn);
    case OcgMessageType.DAMAGE:
      return {
        type,
      };
    // player: reader.u8(),
    // amount: reader.u32(),
    case OcgMessageType.RECOVER:
      return {
        type,
      };
    // player: reader.u8(),
    // amount: reader.u32(),
    case OcgMessageType.EQUIP:
      return {
        type,
      };
    //{
    // Object card = Object::New(env);
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // message.Set("card", card);
    //       }
    //  {
    // Object target = Object::New(env);
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // message.Set("target", target);
    //       }
    case OcgMessageType.LPUPDATE:
      return {
        type,
      };
    // player: reader.u8(),
    // lp: reader.u32(),
    case OcgMessageType.UNEQUIP:
      return {
        type,
      };
    case OcgMessageType.CARD_TARGET:
      return {
        type,
      };
    //  {
    // Object card = Object::New(env);
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // message.Set("card", card);
    //       }
    //  {
    // Object target = Object::New(env);
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // message.Set("target", target);
    //       }
    case OcgMessageType.CANCEL_TARGET:
      return {
        type,
      };
    // {
    // Object card = Object::New(env);
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // message.Set("card", card);
    //       }
    //  {
    // Object target = Object::New(env);
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // message.Set("target", target);
    //       }
    case OcgMessageType.PAY_LPCOST:
      return {
        type,
      };
    // player: reader.u8(),
    // amount: reader.u32(),
    case OcgMessageType.ADD_COUNTER:
      return {
        type,
      };
    // counter_type: reader.u16(),
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u8(),
    // count: reader.u16(),
    case OcgMessageType.REMOVE_COUNTER:
      return {
        type,
      };
    // counter_type: reader.u16(),
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u8(),
    // count: reader.u16(),
    case OcgMessageType.ATTACK:
      return {
        type,
      };
    //    {
    // Object card = Object::New(env);
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // message.Set("card", card);
    //       }
    //  {
    // READ_VALUE(controller, uint8);
    // READ_VALUE(location, uint8);
    // READ_VALUE(sequence, uint32);
    // READ_VALUE(position, uint32);
    //  if (location == 0) {
    // message.Set("target", env.Null());
    //       } else {
    // Object target = Object::New(env);
    // target.Set("controller", Number::New(env, controller));
    // target.Set("location", Number::New(env, location));
    // target.Set("sequence", Number::New(env, sequence));
    // target.Set("position", Number::New(env, position));
    // message.Set("target", target);
    //       }
    //       }
    case OcgMessageType.BATTLE:
      return {
        type,
      };
    //   {
    // Object card = Object::New(env);
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // attack: reader.u32(),
    // defense: reader.u32(),
    // destroyed: reader.u8(),
    // message.Set("card", card);
    //       }
    //   {
    // READ_VALUE(controller, uint8);
    // READ_VALUE(location, uint8);
    // READ_VALUE(sequence, uint32);
    // READ_VALUE(position, uint32);
    // READ_VALUE(attack, uint32);
    // READ_VALUE(defense, uint32);
    // READ_VALUE(destroyed, uint8);
    //   if (location == 0) {
    // message.Set("target", env.Null());
    //       } else {
    // Object target = Object::New(env);
    // target.Set("controller", Number::New(env, controller));
    // target.Set("location", Number::New(env, location));
    // target.Set("sequence", Number::New(env, sequence));
    // target.Set("position", Number::New(env, position));
    // target.Set("attack", Number::New(env, attack));
    // target.Set("defense", Number::New(env, defense));
    // target.Set("destroyed", Boolean::New(env, destroyed));
    // message.Set("target", target);
    //       }
    //       }
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
      };
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // code: reader.u32(),
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
      };
    // player: reader.u8(),
    // READ_VALUE(resultsLength, uint8);
    // Array results = Array::New(env, resultsLength);
    // for (uint8 i = 0; i < resultsLength; i++) {
    // READ_VALUE(result, uint8);
    // results.Set(i, Boolean::New(env, result));
    //       }
    // message.Set("results", results);
    case OcgMessageType.TOSS_DICE:
      return {
        type,
      };
    // player: reader.u8(),
    // READ_VALUE(resultsLength, uint8);
    // Array results = Array::New(env, resultsLength);
    // for (uint8 i = 0; i < resultsLength; i++) {
    // READ_VALUE(result, uint8);
    //    results.Set(uint32(i), Number::New(env, result));
    //       }
    // message.Set("results", results);
    case OcgMessageType.ROCK_PAPER_SCISSORS:
      return {
        type,
      };
    // player: reader.u8(),
    case OcgMessageType.HAND_RES:
      return {
        type,
      };
    // READ_VALUE(result, uint8);
    // Array results = Array::New(env, 2);
    //   results.Set(uint32(0), Number::New(env, result & 0b11));
    //   results.Set(uint32(1), Number::New(env, (result >> 2) & 0b11));
    // message.Set("results", results);
    case OcgMessageType.ANNOUNCE_RACE:
      return {
        type,
      };
    // player: reader.u8(),
    // count: reader.u8(),
    // available: reader.u8(),
    case OcgMessageType.ANNOUNCE_ATTRIB:
      return {
        type,
      };
    // player: reader.u8(),
    // count: reader.u8(),
    // available: reader.u8(),
    case OcgMessageType.ANNOUNCE_CARD:
      return {
        type,
      };
    // player: reader.u8(),
    // READ_VALUE(opcodesLength, uint8);
    // Array opcodes = Array::New(env, opcodesLength);
    // for (uint8 i = 0; i < opcodesLength; i++) {
    // READ_VALUE(opcode, uint64);
    //    opcodes.Set(uint32(i), BigInt::New(env, opcode));
    //       }
    // message.Set("opcodes", opcodes);
    case OcgMessageType.ANNOUNCE_NUMBER:
      return {
        type,
      };
    // player: reader.u8(),
    // READ_VALUE(optionsLength, uint8);
    // Array options = Array::New(env, optionsLength);
    // for (uint8 i = 0; i < optionsLength; i++) {
    // READ_VALUE(option, uint64);
    //   options.Set(uint32(i), Number::New(env, option));
    //       }
    // message.Set("options", options);
    case OcgMessageType.CARD_HINT:
      return {
        type,
      };
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // card_hint: reader.u8(),
    // description: reader.u64(),
    case OcgMessageType.TAG_SWAP:
      return {
        type,
      };
    // player: reader.u8(),
    // deck_size: reader.u32(),
    // READ_VALUE(extraLength, uint32);
    // extra_faceup_count: reader.u32(),
    // READ_VALUE(handLength, uint32);
    // READ_VALUE_VSET(deck_top_card, uint32,
    //                 deck_top_card == 0 ? env.Null()
    //                                  : Number::New(env, deck_top_card),
    //               message);

    // Array hand = Array::New(env, handLength);
    // handLen: Array.from({ length: reader.u() }, () => ({
    // Object value = Object::New(env);
    // code: reader.u32(),
    // position: reader.u32(),
    // hand.Set(i, value);
    //       }
    // message.Set("hand", hand);

    // Array extra = Array::New(env, extraLength);
    // extraLe: Array.from({ length: reader.u() }, () => ({
    // Object value = Object::New(env);
    // code: reader.u32(),
    // position: reader.u32(),
    // extra.Set(i, value);
    //       }
    // message.Set("extra", extra);
    case OcgMessageType.RELOAD_FIELD:
      return {
        type,
      };
    // flags: reader.u32(),
    // Array players = Array::New(env, 2);
    // 2; i++): Array.from({ length: reader.u() }, () => ({
    // Object player = Object::New(env);
    // lp: reader.u32(),
    // Array monsters = Array::New(env, 7);
    // for (uint32 mi = 0; mi < 7; mi++) {
    // READ_VALUE(hasCard, uint8);
    //  if (hasCard == 1) {
    // Object card = Object::New(env);
    // position: reader.u8(),
    // materials: reader.u32(),
    //      monsters.Set(mi, card);
    //       } else {
    //       monsters.Set(mi, env.Null());
    //       }
    //       }
    // player.Set("monsters", monsters);
    // Array spells = Array::New(env, 8);
    // for (uint32 si = 0; si < 8; si++) {
    // READ_VALUE(hasCard, uint8);
    // if (hasCard == 1) {
    // Object card = Object::New(env);
    // position: reader.u8(),
    // materials: reader.u32(),
    //    spells.Set(si, card);
    //       } else {
    //    spells.Set(si, env.Null());
    //       }
    //       }
    // player.Set("spells", spells);
    // deck_size: reader.u32(),
    // hand_size: reader.u32(),
    // grave_size: reader.u32(),
    // banish_size: reader.u32(),
    // extra_size: reader.u32(),
    // extra_faceup_count: reader.u32(),

    // players.Set(i, player);
    //       }
    // message.Set("players", players);

    // READ_VALUE(chainLength, uint32);
    // Array chain = Array::New(env, chainLength);
    // chainLe: Array.from({ length: reader.u() }, () => ({
    // Object value = Object::New(env);
    // code: reader.u32(),
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // triggering_controller: reader.u8(),
    // triggering_location: reader.u8(),
    // triggering_sequence: reader.u32(),
    // description: reader.u64(),
    // chain.Set(i, value);
    //       }
    // message.Set("chain", chain);
    case OcgMessageType.AI_NAME:
      return {
        type,
      };
    // debug stuff
    case OcgMessageType.SHOW_HINT:
      return {
        type,
      };
    // debug stuff
    case OcgMessageType.PLAYER_HINT:
      return {
        type,
      };
    // player: reader.u8(),
    // player_hint: reader.u8(),
    // description: reader.u64(),
    case OcgMessageType.MATCH_KILL:
      return {
        type,
      };
    // card: reader.u32(),
    case OcgMessageType.CUSTOM_MSG:
      return {
        type,
      };
    case OcgMessageType.REMOVE_CARDS:
      return {
        type,
      };
    // READ_VALUE(cardsngth, uint32);
    // Array cards = Array::New(env, cardsngth);
    // cards: Array.from({ length: reader.u() }, () => ({
    // Object value = Object::New(env);
    // controller: reader.u8(),
    // location: reader.u8(),
    // sequence: reader.u32(),
    // position: reader.u32(),
    // cards.Set(i, value);
    //       }
    // message.Set("cards", cards);
    default:
      return null;
  }
}
