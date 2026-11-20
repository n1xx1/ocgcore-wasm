// Regression test: destroyDuel and a failed createDuel must remove the duel's
// callbacks from the core's callbacks map.
//
// npx esbuild ./tests/callbacks.ts --bundle --platform=node --loader:.wasm=binary --format=esm --target=es2020 --outdir=tests/dist && node tests/dist/callbacks.js

import assert from "node:assert/strict";
import createCore, { OcgCoreInternal, OcgDuelMode } from "../src/index";

const team = { startingLP: 8000, startingDrawCount: 5, drawCountPerTurn: 1 };
const options = {
  flags: OcgDuelMode.MODE_MR5,
  seed: [1n, 2n, 3n, 4n] as [bigint, bigint, bigint, bigint],
  team1: team,
  team2: team,
};

async function testSync() {
  const lib = await createCore({ sync: true });
  const { module, callbacks } = lib[OcgCoreInternal];
  const before = callbacks.size;

  for (let i = 0; i < 100; i++) {
    const handle = lib.createDuel({
      ...options,
      cardReader: () => null,
      scriptReader: () => "",
      errorHandler: () => {},
    });
    assert.ok(handle, "createDuel failed");
    assert.equal(callbacks.size, before + 1);
    lib.destroyDuel(handle);
  }
  assert.equal(callbacks.size, before, "destroyDuel left callbacks behind");

  const create = module._ocgapiCreateDuel;
  module._ocgapiCreateDuel = () => 1;
  try {
    const handle = lib.createDuel({
      ...options,
      cardReader: () => null,
      scriptReader: () => "",
      errorHandler: () => {},
    });
    assert.equal(handle, null);
  } finally {
    module._ocgapiCreateDuel = create;
  }
  assert.equal(callbacks.size, before, "failed createDuel left callbacks");
  console.log("sync: ok");
}

async function testJspi() {
  if (!("Suspending" in WebAssembly)) {
    console.log("jspi: skipped, WebAssembly.Suspending not available");
    return;
  }
  const lib = await createCore();
  const { module, callbacks } = lib[OcgCoreInternal];
  const before = callbacks.size;

  for (let i = 0; i < 100; i++) {
    const handle = await lib.createDuel({
      ...options,
      cardReader: async () => null,
      scriptReader: async () => "",
      errorHandler: () => {},
    });
    assert.ok(handle, "createDuel failed");
    assert.equal(callbacks.size, before + 1);
    lib.destroyDuel(handle);
  }
  assert.equal(callbacks.size, before, "destroyDuel left callbacks behind");

  const create = module._ocgapiCreateDuel;
  module._ocgapiCreateDuel = async () => 1;
  try {
    const handle = await lib.createDuel({
      ...options,
      cardReader: async () => null,
      scriptReader: async () => "",
      errorHandler: () => {},
    });
    assert.equal(handle, null);
  } finally {
    module._ocgapiCreateDuel = create;
  }
  assert.equal(callbacks.size, before, "failed createDuel left callbacks");
  console.log("jspi: ok");
}

async function main() {
  await testSync();
  await testJspi();
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
