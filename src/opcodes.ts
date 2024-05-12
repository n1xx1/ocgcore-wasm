import { makeMap } from "./internal/utils";
import { OcgCardData, OcgType } from "./types";
import type { OcgMessageAnnounceCard } from "./type_message";

/** Opcode for the stack based card announcing process, used in {@link OcgMessageAnnounceCard}. */
export type OcgOpCode = (typeof OcgOpCode)[keyof typeof OcgOpCode];

/** Available Opcodes, any value that isn't a Opcode is added to the stack. */
export const OcgOpCode = {
  /** stack in: ... (A) (B); stack out: ... (A + B) */
  ADD: 0x4000000000000000n,
  /** stack in: ... (A) (B); stack out: ... (A - B) */
  SUB: 0x4000000100000000n,
  /** stack in: ... (A) (B); stack out: ... (A * B) */
  MUL: 0x4000000200000000n,
  /** stack in: ... (A) (B); stack out: ... (A / B) */
  DIV: 0x4000000300000000n,
  /** stack in: ... (A) (B); stack out: ... (A && B) */
  AND: 0x4000000400000000n,
  /** stack in: ... (A) (B); stack out: ... (A || B) */
  OR: 0x4000000500000000n,
  /** stack in: ... (A); stack out: ... (-A) */
  NEG: 0x4000000600000000n,
  /** stack in: ... (A); stack out: ... (!A) */
  NOT: 0x4000000700000000n,
  /** stack in: ... (A) (B); stack out: ... (A & B) */
  BAND: 0x4000000800000000n,
  /** stack in: ... (A) (B); stack out: ... (A | B) */
  BOR: 0x4000000900000000n,
  /** stack in: ... (A); stack out: ... (~A) */
  BNOT: 0x4000001000000000n,
  /** stack in: ... (A) (B); stack out: ... (A ^ B) */
  BXOR: 0x4000001100000000n,
  /** stack in: ... (A) (B); stack out: ... (A \<\< B) */
  LSHIFT: 0x4000001200000000n,
  /** stack in: ... (A) (B); stack out: ... (A \>\> B) */
  RSHIFT: 0x4000001300000000n,
  /** stack in: ...; stack out: ... */
  ALLOW_ALIASES: 0x4000001400000000n,
  /** stack in: ...; stack out: ... */
  ALLOW_TOKENS: 0x4000001500000000n,
  /** stack in: ... (A); stack out: ... (A == code) */
  ISCODE: 0x4000010000000000n,
  /** stack in: ... (A); stack out: ... (setcodes includes A) */
  ISSETCARD: 0x4000010100000000n,
  /** stack in: ... (A); stack out: ... (A == type) */
  ISTYPE: 0x4000010200000000n,
  /** stack in: ... (A); stack out: ... (A == race) */
  ISRACE: 0x4000010300000000n,
  /** stack in: ... (A); stack out: ... (A == attribute) */
  ISATTRIBUTE: 0x4000010400000000n,
  /** stack in: ...; stack out: ... (code) */
  GETCODE: 0x4000010500000000n,
  /** @deprecated Does nothing. */
  GETSETCARD: 0x4000010600000000n,
  /** stack in: ...; stack out: ... (type) */
  GETTYPE: 0x4000010700000000n,
  /** stack in: ...; stack out: ... (race) */
  GETRACE: 0x4000010800000000n,
  /** stack in: ...; stack out: ... (attribute) */
  GETATTRIBUTE: 0x4000010900000000n,
};

/**
 * Convert a {@link (OcgOpCode:type)} to its string representation.
 */
export const ocgOpCodeString = makeMap([
  [OcgOpCode.ADD, "add"],
  [OcgOpCode.SUB, "sub"],
  [OcgOpCode.MUL, "mul"],
  [OcgOpCode.DIV, "div"],
  [OcgOpCode.AND, "and"],
  [OcgOpCode.OR, "or"],
  [OcgOpCode.NEG, "neg"],
  [OcgOpCode.NOT, "not"],
  [OcgOpCode.BAND, "band"],
  [OcgOpCode.BOR, "bor"],
  [OcgOpCode.BNOT, "bnot"],
  [OcgOpCode.BXOR, "bxor"],
  [OcgOpCode.LSHIFT, "lshift"],
  [OcgOpCode.RSHIFT, "rshift"],
  [OcgOpCode.ALLOW_ALIASES, "allow_aliases"],
  [OcgOpCode.ALLOW_TOKENS, "allow_tokens"],
  [OcgOpCode.ISCODE, "iscode"],
  [OcgOpCode.ISSETCARD, "issetcard"],
  [OcgOpCode.ISTYPE, "istype"],
  [OcgOpCode.ISRACE, "israce"],
  [OcgOpCode.ISATTRIBUTE, "isattribute"],
  [OcgOpCode.GETCODE, "getcode"],
  [OcgOpCode.GETSETCARD, "getsetcard"],
  [OcgOpCode.GETTYPE, "gettype"],
  [OcgOpCode.GETRACE, "getrace"],
  [OcgOpCode.GETATTRIBUTE, "getattribute"],
]);

/**
 * Utility function to check if the specified card matches the opcode sequence.
 * @param card - The card to check against
 * @param opcodes - The opcode sequence
 */
export function cardMatchesOpcode(card: OcgCardData, opcodes: OcgOpCode[]) {
  const stack: bigint[] = [];
  let alias = false;
  let token = false;

  for (const opcode of opcodes) {
    switch (opcode) {
      case OcgOpCode.ADD:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, lhs + rhs));
        }
        break;
      case OcgOpCode.SUB:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, lhs - rhs));
        }
        break;
      case OcgOpCode.MUL:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, lhs * rhs));
        }
        break;
      case OcgOpCode.DIV:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, lhs / rhs));
        }
        break;
      case OcgOpCode.AND:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(lhs != 0n && rhs != 0n ? 1n : 0n);
        }
        break;
      case OcgOpCode.OR:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(lhs != 0n || rhs != 0n ? 1n : 0n);
        }
        break;
      case OcgOpCode.NEG:
        if (stack.length >= 1) {
          const val = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, -val));
        }
        break;
      case OcgOpCode.NOT:
        if (stack.length >= 1) {
          const val = stack.pop() as bigint;
          stack.push(val != 0n ? 0n : 1n);
        }
        break;
      case OcgOpCode.BAND:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, lhs & rhs));
        }
        break;
      case OcgOpCode.BOR:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, lhs | rhs));
        }
        break;
      case OcgOpCode.BNOT:
        if (stack.length >= 1) {
          const val = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, ~val));
        }
        break;
      case OcgOpCode.BXOR:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, lhs ^ rhs));
        }
        break;
      case OcgOpCode.LSHIFT:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, lhs << rhs));
        }
        break;
      case OcgOpCode.RSHIFT:
        if (stack.length >= 2) {
          const rhs = stack.pop() as bigint;
          const lhs = stack.pop() as bigint;
          stack.push(BigInt.asIntN(64, lhs >> rhs));
        }
        break;
      case OcgOpCode.ALLOW_ALIASES:
        alias = true;
        break;
      case OcgOpCode.ALLOW_TOKENS:
        token = true;
        break;
      case OcgOpCode.ISCODE:
        if (stack.length >= 1) {
          const val = stack.pop() as bigint;
          stack.push(BigInt(card.code) == val ? 1n : 0n);
        }
        break;
      case OcgOpCode.ISSETCARD:
        if (stack.length >= 1) {
          const val = Number(stack.pop() as bigint);
          const setType = val & 0xfff;
          const setSubType = val & 0xf000;
          let ret = 0n;
          for (const set of card.setcodes) {
            if (
              (set & 0xfff) == setType &&
              (set & 0xf000 & setSubType) == setSubType
            ) {
              ret = 1n;
              break;
            }
          }
          stack.push(ret);
        }
        break;
      case OcgOpCode.ISTYPE:
        if (stack.length >= 1) {
          const val = stack.pop() as bigint;
          stack.push((BigInt(card.type) & val) != 0n ? 1n : 0n);
        }
        break;
      case OcgOpCode.ISRACE:
        if (stack.length >= 1) {
          const val = stack.pop() as bigint;
          stack.push((card.race & val) != 0n ? 1n : 0n);
        }
        break;
      case OcgOpCode.ISATTRIBUTE:
        if (stack.length >= 1) {
          const val = stack.pop() as bigint;
          stack.push((BigInt(card.code) & val) != 0n ? 1n : 0n);
        }
        break;
      case OcgOpCode.GETCODE:
        stack.push(BigInt(card.code));
        break;
      //case OcgOpCode.GETSETCARD:
      //    break;
      case OcgOpCode.GETTYPE:
        stack.push(BigInt(card.type));
        break;
      case OcgOpCode.GETRACE:
        stack.push(card.race);
        break;
      case OcgOpCode.GETATTRIBUTE:
        stack.push(BigInt(card.attribute));
        break;
      default:
        stack.push(opcode);
        break;
    }
  }
  if (stack.length != 1 || stack[0] == 0n) {
    return false;
  }
  if (card.code == cardMarineDolphin || card.code == cardTwinkleMoss) {
    // always return for true for Neo-Spacian Marine Dolphin and Neo-Spacian Twinkle Moss
    return true;
  }
  if (!alias && card.alias != 0) {
    return false;
  }
  if (!token) {
    return (
      (card.type & (OcgType.MONSTER | OcgType.TOKEN)) !=
      (OcgType.MONSTER | OcgType.TOKEN)
    );
  }
  return true;
}

const cardMarineDolphin = 78734254;
const cardTwinkleMoss = 13857930;
