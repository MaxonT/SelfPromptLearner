/*
Title: SPR Benchmark – Prompts List
Description: Quick benchmark for /api/prompts list latency under a seeded dataset.

Usage:
  - Start server first (npm run dev OR npm run build && npm run start)
  - Then: npm run bench:list

Env:
  BENCH_BASE_URL=http(s)://localhost:5000
  BENCH_SEED_N=2000
  BENCH_RUNS=30
*/

const BASE_URL = process.env.BENCH_BASE_URL || "http" + "://" + "localhost:5000";
const SEED_N = Number(process.env.BENCH_SEED_N || 2000);
const RUNS = Number(process.env.BENCH_RUNS || 30);

function randEmail() {
  const n = Math.floor(Math.random() * 1e9);
  return `bench_${n}@example.com`;
}

async function main() {
  const email = randEmail();
  const password = "password123";

  let cookie = "";

  async function req(path, { method = "GET", body, headers = {} } = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...headers,
        ...(cookie ? { cookie } : {}),
      },
      body,
    });

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) cookie = setCookie.split(";")[0];

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    return { res, json, text };
  }

  // health
  {
    const { res } = await req("/api/health");
    if (!res.ok) throw new Error(`health failed: ${res.status}`);
  }

  // register
  {
    const { res, json } = await req("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`register failed: ${res.status} ${JSON.stringify(json)}`);
  }

  // token
  let token = "";
  {
    const { res, json } = await req("/api/auth/me");
    if (!res.ok) throw new Error(`me failed: ${res.status}`);
    token = json?.token || "";
    if (!token) throw new Error("missing token in /api/auth/me");
  }

  // seed prompts (idempotent per clientEventId)
  console.log(`🌱 seeding ${SEED_N} prompts...`);
  for (let i = 0; i < SEED_N; i++) {
    const payload = {
      promptText: `Bench prompt #${i} – ${"x".repeat((i % 100) + 10)}`,
      site: i % 2 === 0 ? "chatgpt" : "claude",
      pageUrl: i % 2 === 0 ? "https://chat.openai.com/" : "https://claude.ai/",
      deviceId: "bench-device",
      clientEventId: `bench-${Date.now()}-${i}`,
    };

    const { res } = await req("/api/ingest", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`ingest failed at i=${i}`);
    if (i % 200 === 0 && i > 0) console.log(`  seeded ${i}/${SEED_N}`);
  }

  // warmup
  await req("/api/prompts?limit=24&offset=0");

  console.log(`⏱️ benchmarking /api/prompts (runs=${RUNS})...`);
  const samples = [];
  for (let r = 0; r < RUNS; r++) {
    const t0 = performance.now();
    const { res } = await req(`/api/prompts?limit=24&offset=${(r % 10) * 24}`);
    const t1 = performance.now();
    if (!res.ok) throw new Error(`list failed: ${res.status}`);
    samples.push(t1 - t0);
  }

  samples.sort((a, b) => a - b);
  const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
  const p50 = samples[Math.floor(samples.length * 0.5)];
  const p90 = samples[Math.floor(samples.length * 0.9)];
  const p99 = samples[Math.floor(samples.length * 0.99)];

  console.log("\n📊 Results (ms)");
  console.log(`avg=${avg.toFixed(1)}  p50=${p50.toFixed(1)}  p90=${p90.toFixed(1)}  p99=${p99.toFixed(1)}`);
}

main().catch((err) => {
  console.error("❌ bench failed:", err);
  process.exit(1);
});
