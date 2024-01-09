import { makeMap } from "./internal/utils";
import { OcgCardData, OcgType } from "./types";

export type OcgOpCode = (typeof OcgOpCode)[keyof typeof OcgOpCode];

export const OcgOpCode = {
  ADD: 0x4000000000000000n,
  SUB: 0x4000000100000000n,
  MUL: 0x4000000200000000n,
  DIV: 0x4000000300000000n,
  AND: 0x4000000400000000n,
  OR: 0x4000000500000000n,
  NEG: 0x4000000600000000n,
  NOT: 0x4000000700000000n,
  BAND: 0x4000000800000000n,
  BOR: 0x4000000900000000n,
  BNOT: 0x4000001000000000n,
  BXOR: 0x4000001100000000n,
  LSHIFT: 0x4000001200000000n,
  RSHIFT: 0x4000001300000000n,
  ALLOW_ALIASES: 0x4000001400000000n,
  ALLOW_TOKENS: 0x4000001500000000n,
  ISCODE: 0x4000010000000000n,
  ISSETCARD: 0x4000010100000000n,
  ISTYPE: 0x4000010200000000n,
  ISRACE: 0x4000010300000000n,
  ISATTRIBUTE: 0x4000010400000000n,
  GETCODE: 0x4000010500000000n,
  GETSETCARD: 0x4000010600000000n,
  GETTYPE: 0x4000010700000000n,
  GETRACE: 0x4000010800000000n,
  GETATTRIBUTE: 0x4000010900000000n,
};

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
    }
  }
  if (stack.length != 1 || stack[0] == 0n) {
    return false;
  }
  if (card.code == 78734254 || card.code == 13857930) {
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
