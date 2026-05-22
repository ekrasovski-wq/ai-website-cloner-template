#!/usr/bin/env node
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";

const root = new URL("../public/images/", import.meta.url).pathname;

const projects = [
  { slug: "jupiter", url: "https://cdn.sanity.io/images/u7lvkmbp/production/bff6c9518d1b998df04c33101d61ad965fd23a98-1413x760.png" },
  { slug: "mercedes-amg", url: "https://cdn.sanity.io/images/u7lvkmbp/production/f430b963c80253937547780211cd3abe7b23924c-1920x1080.png" },
  { slug: "thought", url: "https://cdn.sanity.io/images/u7lvkmbp/production/41a99c4ae85965e19dcc6befe7caaae6c2d54d9c-1146x644.png" },
  { slug: "babylon-is-burning", url: "https://cdn.sanity.io/images/u7lvkmbp/production/f5d615bd06485eee711166e82adb7b60bcffa749-1675x928.png" },
  { slug: "the-disease-spread-on-tiktok", url: "https://cdn.sanity.io/images/u7lvkmbp/production/19fa225f5d92c65608e2234c0b0bd1fb2e3d681c-3840x1920.png" },
  { slug: "the-purity-revealed", url: "https://cdn.sanity.io/images/u7lvkmbp/production/689cc8437a49fac1ba8f12012d73cf9d20ce46fb-3840x2160.png" },
  { slug: "paths-of-life", url: "https://cdn.sanity.io/images/u7lvkmbp/production/53f8a4a889052e6d9f92fc347533062abaf7c28a-1396x770.png" },
  { slug: "ah-psychedelics", url: "https://cdn.sanity.io/images/u7lvkmbp/production/1ca122cfaaff3f8b109554a29cc7a1132d13a0c6-1280x717.png" },
  { slug: "digital-travel", url: "https://cdn.sanity.io/images/u7lvkmbp/production/219c0768c852e48380fd831ed0772f7c173ac0ea-1280x719.png" },
  { slug: "chromatik", url: "https://cdn.sanity.io/images/u7lvkmbp/production/80de59a860bc12ff92d9d349ffe319cfb92a8de8-1258x984.png" },
];

const extras = [
  { name: "reel-thumbnail.png", url: "https://pacomepertant.com/_nuxt/reel-thumbnail.Cx_2hmdl.png" },
  { name: "logo-big.png", url: "https://pacomepertant.com/_nuxt/logo-big.elJIbpew.png" },
];

async function dl(url, dest) {
  if (existsSync(dest)) return { skipped: true, dest };
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return { ok: true, dest, size: buf.length };
}

async function main() {
  const jobs = [
    ...projects.map(p => ({ url: p.url, dest: join(root, "projects", `${p.slug}.png`) })),
    ...extras.map(e => ({ url: e.url, dest: join(root, e.name) })),
  ];

  const concurrency = 4;
  for (let i = 0; i < jobs.length; i += concurrency) {
    const batch = jobs.slice(i, i + concurrency);
    const results = await Promise.allSettled(batch.map(j => dl(j.url, j.dest)));
    results.forEach((r, idx) => {
      const j = batch[idx];
      if (r.status === "fulfilled") {
        console.log(`✓ ${j.dest}${r.value.skipped ? " (cached)" : ` (${r.value.size} bytes)`}`);
      } else {
        console.error(`✗ ${j.url}: ${r.reason}`);
      }
    });
  }
}

main().catch(err => { console.error(err); process.exit(1); });
