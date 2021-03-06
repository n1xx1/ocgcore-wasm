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
    case OcgResponseType.SELECT_UNSELECT_CARD:
      if (response.cancel || response.finish) {
        writer.i32(-1);
      } else {
        // TODO: figure out if we want to embed the original message for the response
        // or rely on the user to be accurate
      }
      break;
    case OcgResponseType.SELECT_CHAIN:
      if (response.cancel) {
        writer.i32(-1);
      } else {
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
    case OcgResponseType.SELECT_POSITION:
      writer.i32(response.position);
      break;
    case OcgResponseType.SELECT_TRIBUTE:
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
    case OcgResponseType.SELECT_COUNTER:
      for (const count of response.counters) {
        writer.i16(count);
      }
      break;
    case OcgResponseType.SELECT_SUM:
      writer.i32(0);
      writer.i32(response.indicies.length);
      for (const i of response.indicies) {
        writer.i32(i);
      }
      break;
    case OcgResponseType.SELECT_RELEASE:
      break;
    case OcgResponseType.SELECT_FUSION:
      break;
    case OcgResponseType.SORT_CARD:
      break;
    case OcgResponseType.ANNOUNCE_RACE:
      break;
    case OcgResponseType.ANNOUNCE_ATTRIB:
      break;
    case OcgResponseType.ANNOUNCE_CARD:
      break;
    case OcgResponseType.ANNOUNCE_NUMBER:
      break;
    case OcgResponseType.ROCK_PAPER_SCISSORS:
      break;
  }
  return writer.buffer.subarray(0, writer.off);
}
