# ocgcore-wasm

[ProjectIgnis' EDOPro Core](https://github.com/edo9300/ygopro-core/)
built for WebAssembly using emscripten.

The async version requires JS Promise Integration (JSPI) and Type reflection. Use
the flag `--experimental-wasm-stack-switching` with node.

## Example

### Initialize sync version

```ts
const scriptPath = "...";
const cards = loadCardDatabase();

const lib = await createCore({ sync: true });

const handle = lib.createDuel({
  flags: OcgDuelMode.MODE_MR5,
  seed: [1n, 1n, 1n, 1n],
  team1: {
    drawCountPerTurn: 1,
    startingDrawCount: 5,
    startingLP: 8000,
  },
  team2: {
    drawCountPerTurn: 1,
    startingDrawCount: 5,
    startingLP: 8000,
  },
  cardReader: (code) => {
    const card = cards.get(code);
    if (!card) {
      console.warn("missing card: ", code);
    }
    return card ?? null;
  },
  scriptReader: (script) => {
    const filePath = script.match(/c\d+\.lua/)
      ? path.join(scriptPath, "official", script)
      : path.join(scriptPath, script);

    // console.log(`loading script: ${script}`);

    try {
      return readFileSync(filePath, "utf-8");
    } catch (e) {
      console.log(`error reading script "${script}", ${e}`);
      throw e;
    }
  },
  errorHandler: (type, text) => {
    console.warn(type, text);
  },
});

if (!handle) {
  throw new Error("failed to create");
}
```
