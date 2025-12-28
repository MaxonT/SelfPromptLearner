/* 
Title: SPR E2E-lite
Description: HTTP-based end-to-end sanity test (no browser). 
*/

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:5000";

function randEmail() {
  const n = Math.floor(Math.random() * 1e9);
  return `spr_${n}@example.com`;
}

async function main() {
  const email = randEmail();
  const password = "password123";

  // simple cookie jar
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
    if (setCookie) {
      // keep only the first cookie segment; good enough for local session cookie
      cookie = setCookie.split(";")[0];
    }

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    return { res, text, json };
  }

  // Health
  {
    const { res } = await req("/api/health");
    if (!res.ok) throw new Error(`health failed: ${res.status}`);
    console.log("✅ health ok");
  }

  // Register
  {
    const { res, json } = await req("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(`register failed: ${res.status} ${JSON.stringify(json)}`);
    console.log("✅ register ok");
  }

  // Get token
  let token = "";
  {
    const { res, json } = await req("/api/auth/me");
    if (!res.ok) throw new Error(`me failed: ${res.status}`);
    token = json?.token || "";
    if (!token) throw new Error("missing token in /api/auth/me");
    console.log("✅ token ok");
  }

  // Ingest one prompt via token
  {
    const payload = {
      promptText: "E2E-lite test prompt",
      site: "chatgpt",
      pageUrl: "https://chat.openai.com/",
      deviceId: "e2e-device",
      clientEventId: `e2e-${Date.now()}`,
    };
    const { res } = await req("/api/ingest", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`ingest failed: ${res.status}`);
    console.log("✅ ingest ok");
  }

  // List prompts
  {
    const { res, json } = await req("/api/prompts?limit=10&offset=0", { method: "GET" });
    if (!res.ok) throw new Error(`list prompts failed: ${res.status}`);
    const items = json?.items || [];
    if (!Array.isArray(items) || items.length < 1) throw new Error("expected at least 1 prompt");
    console.log("✅ list ok");
  }

  // Export JSON
  {
    const { res } = await req("/api/account/export/json");
    if (!res.ok) throw new Error(`export json failed: ${res.status}`);
    console.log("✅ export json ok");
  }

  console.log("🎉 E2E-lite passed");
}

main().catch((err) => {
  console.error("❌ E2E-lite failed:", err);
  process.exit(1);
});
