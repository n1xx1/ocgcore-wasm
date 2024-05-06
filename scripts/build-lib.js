import { analyzeMetafile, build, transform } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const result = await build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  outdir: "dist",
  format: "esm",
  target: "es2020",
  splitting: true,
  minify: true,
  sourcemap: true,
  loader: { ".wasm": "binary" },
  metafile: true,
});

const [entryPointOut] =
  /** @type {[string, (typeof result.metafile.outputs)[string]]} */ (
    Object.entries(result.metafile.outputs).find(
      ([f, data]) => data.entryPoint === "src/index.ts"
    )
  );

await writeFile(
  entryPointOut,
  `/// <reference types="./index.d.ts" />\n` +
    (await readFile(entryPointOut, "utf-8"))
);

console.log(await analyzeMetafile(result.metafile));
