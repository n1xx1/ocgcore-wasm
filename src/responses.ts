import { BufferWriter } from "./internal/buffer";
import { OcgResponse, OcgResponseType } from "./type_response";

export function createResponse(response: OcgResponse) {
  const writer = new BufferWriter();
  switch (response.type) {
    case OcgResponseType.SELECT_BATTLECMD:
      writer.i32(response.action | ((response.index ?? 0) << 16));
      break;
    case OcgResponseType.SELECT_IDLECMD:
      writer.i32(response.action | ((response.index ?? 0) << 16));
      break;
    case OcgResponseType.SELECT_EFFECTYN:
      writer.i32(response.yes ? 1 : 0);
      break;
    case OcgResponseType.SELECT_YESNO:
      writer.i32(response.yes ? 1 : 0);
      break;
    case OcgResponseType.SELECT_OPTION:
      writer.i32(response.index);
      break;
    case OcgResponseType.SELECT_CARD:
    case OcgResponseType.SELECT_TRIBUTE:
    case OcgResponseType.SELECT_SUM:
      if (response.indicies) {
        writer.i32(0);
        writer.i32(response.indicies.length);
        for (const i of response.indicies) {
          writer.i32(i);
        }
      } else {
        writer.i32(-1);
      }
      break;
    case OcgResponseType.SELECT_CARD_CODES:
      if (response.codes) {
        writer.i32(0);
        writer.i32(response.codes.length);
        for (const i of response.codes) {
          writer.i32(i);
        }
      } else {
        writer.i32(-1);
      }
      break;
    case OcgResponseType.SELECT_UNSELECT_CARD:
      if (response.index === null) {
        writer.i32(-1);
      } else {
        writer.i32(1);
        writer.i32(response.index);
      }
      break;
    case OcgResponseType.SELECT_DISFIELD:
    case OcgResponseType.SELECT_PLACE:
      for (const place of response.places) {
        writer.i8(place.player);
        writer.i8(place.location);
        writer.i8(place.sequence);
      }
      break;
    case OcgResponseType.SELECT_CHAIN:
      if (response.index === null) {
        writer.i32(-1);
      } else {
        writer.i32(response.index);
      }
      break;
    case OcgResponseType.SELECT_POSITION:
      writer.i32(response.position);
      break;
    case OcgResponseType.SELECT_COUNTER:
      for (const count of response.counters) {
        writer.i16(count);
      }
      break;
    case OcgResponseType.SORT_CARD:
      if (!response.order) {
        writer.i8(-1);
        break;
      }
      writer.i8(response.order.length);
      for (const i of response.order) {
        writer.i8(i);
      }
      break;
    case OcgResponseType.ANNOUNCE_RACE:
      let race = 0n;
      for (const r of response.races) {
        race |= r;
      }
      writer.u64(race);
      break;
    case OcgResponseType.ANNOUNCE_ATTRIB:
      let attribute = 0;
      for (const a of response.attributes) {
        attribute |= a;
      }
      writer.u32(attribute);
      break;
    case OcgResponseType.ANNOUNCE_CARD:
      writer.i32(response.card);
      break;
    case OcgResponseType.ANNOUNCE_NUMBER:
      writer.i32(response.value);
      break;
    case OcgResponseType.ROCK_PAPER_SCISSORS:
      writer.i32(response.value);
      break;
  }
  return writer.buffer.subarray(0, writer.off);
}
