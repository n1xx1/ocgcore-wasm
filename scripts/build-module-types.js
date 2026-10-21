import { copyFile, mkdir } from "node:fs/promises";

// Keep these relative imports pointing at the main entry point in both src and dist.
await mkdir(new URL("../dist/lib/", import.meta.url), { recursive: true });
for (const variant of ["jspi", "sync"]) {
  const file = `ocgcore.${variant}.d.mts`;
  await copyFile(
    new URL(`../src/lib/${file}`, import.meta.url),
    new URL(`../dist/lib/${file}`, import.meta.url),
  );
}
