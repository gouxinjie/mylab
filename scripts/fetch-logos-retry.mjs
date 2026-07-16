/**
 * @file fetch-logos-retry.mjs
 * @description 补下载 3 个 Google 未收录的图标（直接尝试 favicon.ico / 备用域名）
 */
import { existsSync, statSync, unlinkSync, readFileSync } from "fs";
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "logos");
const out = (f) => path.join(outDir, f);

const tasks = [
  { name: "CodeBuddy", file: "www.codebuddy.cn.png", urls: [
    "https://www.codebuddy.cn/favicon.ico",
    "https://codebuddy.ai/favicon.ico",
  ] },
  { name: "WorkBuddy", file: "workbuddy.ai.png", urls: [
    "https://workbuddy.ai/favicon.ico",
  ] },
  { name: "Riffusion", file: "www.riffusion.com.png", urls: [
    "https://www.riffusion.com/favicon.ico",
    "https://riffusion.com/favicon.ico",
  ] },
];

const isImg = (file) => {
  const b = readFileSync(file).subarray(0, 4);
  return (
    (b[0] === 0x89 && b[1] === 0x50) || // PNG
    (b[0] === 0x00 && b[1] === 0x00) || // ICO
    Buffer.from(b.slice(0, 3)).toString() === "GIF" ||
    Buffer.from(b.slice(0, 4)).toString() === "<svg"
  );
};

for (const t of tasks) {
  let done = false;
  for (const u of t.urls) {
    const file = out(t.file);
    const r = spawnSync("curl.exe", ["-s", "-L", "--max-time", "20", "-o", file, u], {
      windowsHide: true,
    });
    if (r.status === 0 && existsSync(file) && statSync(file).size > 50 && isImg(file)) {
      console.log(`OK ${t.name} <- ${u} (${statSync(file).size}B)`);
      done = true;
      break;
    }
    if (existsSync(file)) unlinkSync(file);
  }
  if (!done) console.log(`FAIL ${t.name}`);
}
