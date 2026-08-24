import assert from "node:assert/strict";
import { writeCardData } from "../src/data";

const SENTINEL = 0xaa;

function makeView(size = 64): DataView {
  const bytes = new Uint8Array(size);
  bytes.fill(SENTINEL);
  return new DataView(bytes.buffer);
}

function assertSentinel(view: DataView, start: number, end: number): void {
  for (let offset = start; offset < end; offset++) {
    assert.equal(
      view.getUint8(offset),
      SENTINEL,
      `expected padding byte at offset ${offset} to remain untouched`,
    );
  }
}

function testWasm32Layout(): void {
  const view = makeView();

  writeCardData(view, {
    ptrSize: 4,
    code: 0x01020304,
    alias: 0x11121314,
    setcodes: 0x21222324,
    type: 0x31323334,
    level: 0x41424344,
    attribute: 0x51525354,
    race: 0x6162636465666768n,
    attack: -123456789,
    defense: 0x12345678,
    lscale: 0x71727374,
    rscale: 0x81828384,
    link_marker: 0x91929394,
  });

  assert.equal(view.getUint32(0, true), 0x01020304);
  assert.equal(view.getUint32(4, true), 0x11121314);
  assert.equal(view.getUint32(8, true), 0x21222324);
  assert.equal(view.getUint32(12, true), 0x31323334);
  assert.equal(view.getUint32(16, true), 0x41424344);
  assert.equal(view.getUint32(20, true), 0x51525354);
  assert.equal(view.getBigUint64(24, true), 0x6162636465666768n);
  assert.equal(view.getInt32(32, true), -123456789);
  assert.equal(view.getInt32(36, true), 0x12345678);
  assert.equal(view.getUint32(40, true), 0x71727374);
  assert.equal(view.getUint32(44, true), 0x81828384);
  assert.equal(view.getUint32(48, true), 0x91929394);

  assertSentinel(view, 52, 56);
}

function testWasm64Layout(): void {
  const view = makeView();

  writeCardData(view, {
    ptrSize: 8,
    code: 0x01020304,
    alias: 0x11121314,
    setcodes: 0x2122232425262728n,
    type: 0x31323334,
    level: 0x41424344,
    attribute: 0x51525354,
    race: 0x6162636465666768n,
    attack: -123456789,
    defense: 0x12345678,
    lscale: 0x71727374,
    rscale: 0x81828384,
    link_marker: 0x91929394,
  });

  assert.equal(view.getUint32(0, true), 0x01020304);
  assert.equal(view.getUint32(4, true), 0x11121314);
  assert.equal(view.getBigUint64(8, true), 0x2122232425262728n);
  assert.equal(view.getUint32(16, true), 0x31323334);
  assert.equal(view.getUint32(20, true), 0x41424344);
  assert.equal(view.getUint32(24, true), 0x51525354);

  assertSentinel(view, 28, 32);
  assert.equal(view.getBigUint64(32, true), 0x6162636465666768n);
  assert.equal(view.getInt32(40, true), -123456789);
  assert.equal(view.getInt32(44, true), 0x12345678);
  assert.equal(view.getUint32(48, true), 0x71727374);
  assert.equal(view.getUint32(52, true), 0x81828384);
  assert.equal(view.getUint32(56, true), 0x91929394);

  assertSentinel(view, 60, 64);
}

testWasm32Layout();
testWasm64Layout();

console.log("writeCardData ABI layout: PASS");
