// Verifies assets/simulators.js against the repository and keeps the README
// track list in sync with it.
//   node tools/check-registry.mjs          # check only (exit 1 on mismatch)
//   node tools/check-registry.mjs --write  # regenerate the README track block
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ctx = {};
vm.runInNewContext(readFileSync(join(root, "assets/simulators.js"), "utf8"), ctx);
const { SIMULATORS, SIM_TRACKS, SIM_STATS } = ctx;

const errors = [];
const registered = new Set(SIMULATORS.map(s => s.file));
for (const s of SIMULATORS) {
  if (!existsSync(join(root, s.file))) errors.push(`registered but missing on disk: ${s.file}`);
}
for (const f of readdirSync(root).filter(f => /^\d{2}_.*\.html$/.test(f))) {
  if (!registered.has(f)) errors.push(`simulator file not in registry: ${f}`);
}
const ids = SIMULATORS.map(s => s.id);
ids.filter((id, i) => ids.indexOf(id) !== i).forEach(id => errors.push(`duplicate id: ${id}`));

const BASE = "https://titoliviomilazzo.github.io/dynamics-simulators/";
const lines = [
  `## 📚 ${SIM_STATS.tracks}개 전공 트랙 구성 (시뮬레이터 ${SIM_STATS.total}개 · 정본 ${SIM_STATS.canonical} + 실습 ${SIM_STATS.practice})`,
  "",
  "> 이 목록은 `assets/simulators.js`에서 생성됩니다. 시뮬레이터를 추가하면 `node tools/check-registry.mjs --write`로 갱신하세요.",
];
for (const t of SIM_TRACKS) {
  const sims = SIMULATORS.filter(s => s.track === t.id);
  lines.push("", `### 🔹 Track ${String(t.no).padStart(2, "0")}. ${t.title} (${sims.length}개 모듈)`, `${t.desc}`, "");
  for (const s of sims) lines.push(`- [${s.num}. ${s.title}](${BASE}${s.file})`);
}
const block = `<!-- registry:tracks:start -->\n${lines.join("\n")}\n<!-- registry:tracks:end -->`;

const readmePath = join(root, "README.md");
const readme = readFileSync(readmePath, "utf8");
const re = /<!-- registry:tracks:start -->[\s\S]*?<!-- registry:tracks:end -->/;
if (!re.test(readme)) errors.push("README.md has no registry:tracks markers");
else if (process.argv.includes("--write")) writeFileSync(readmePath, readme.replace(re, block));
else if (readme.match(re)[0] !== block) errors.push("README track list is out of date (run with --write)");

if (errors.length) {
  console.error(errors.map(e => "✗ " + e).join("\n"));
  process.exit(1);
}
console.log(`✓ ${SIM_STATS.total} simulators (${SIM_STATS.canonical} canonical + ${SIM_STATS.practice} practice) in ${SIM_STATS.tracks} tracks`);
