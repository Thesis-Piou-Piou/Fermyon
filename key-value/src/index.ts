// For AutoRouter documentation refer to https://itty.dev/itty-router/routers/autorouter
import { AutoRouter } from "itty-router";
import { Kv } from "@fermyon/spin-sdk";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const router = AutoRouter();
const KEY_TRACKER = "__keys__";

// Utility: Get or create key list
function getKeyList(store: any): string[] {
  const keyListRaw = store.get(KEY_TRACKER);
  return keyListRaw ? JSON.parse(decoder.decode(keyListRaw)) : [];
}

function saveKeyList(store: any, keys: string[]) {
  store.set(KEY_TRACKER, encoder.encode(JSON.stringify(keys)));
}

// Route logic
router.all("*", async (req: Request) => {
  const store = Kv.openDefault();
  const url = new URL(req.url);
  const method = req.method;
  const keyParam = url.searchParams.get("key");

  let status = 200;
  let body: BodyInit | undefined;

  switch (method) {
    case "POST": {
      const json = await req.json();
      let keys = getKeyList(store);

      for (const [key, value] of Object.entries(json)) {
        store.set(key, encoder.encode(String(value)));
        if (!keys.includes(key)) keys.push(key);
      }

      saveKeyList(store, keys);
      body = "Stored";
      break;
    }

    case "GET": {
      if (keyParam) {
        const val = store.get(keyParam);
        if (val) {
          body = decoder.decode(val);
        } else {
          status = 404;
          body = "Key not found";
        }
      } else {
        const keys = getKeyList(store);
        const result: Record<string, string> = {};

        for (const key of keys) {
          const val = store.get(key);
          if (val) result[key] = decoder.decode(val);
        }

        body = JSON.stringify(result);
      }
      break;
    }

    case "DELETE": {
      if (keyParam) {
        const keys = getKeyList(store).filter((k) => k !== keyParam);
        store.delete(keyParam);
        saveKeyList(store, keys);
        body = "Deleted";
      } else {
        // Full wipe (optional safety limit in prod)
        const keys = getKeyList(store);
        for (const key of keys) store.delete(key);
        store.delete(KEY_TRACKER);
        body = "All keys deleted";
      }
      break;
    }

    case "HEAD": {
      const exists = keyParam && store.exists(keyParam);
      status = exists ? 200 : 404;
      break;
    }

    default:
      status = 405;
      body = "Method Not Allowed";
  }

  return new Response(body, { status });
});

//@ts-ignore
addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(router.fetch(event.request));
});
