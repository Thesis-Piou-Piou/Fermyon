import https from "https";

async function handle(request) {
  const start = performance.now();
  let lat = 57.7089;
  let lon = 11.9746;

  const url = new URL(request.url);
  if (url.searchParams.has("latitude")) lat = Number(url.searchParams.get("latitude"));
  if (url.searchParams.has("longitude")) lon = Number(url.searchParams.get("longitude"));

  if (request.method === "POST") {
    try {
      const body = await request.json();
      if (body.latitude !== undefined) lat = Number(body.latitude);
      if (body.longitude !== undefined) lon = Number(body.longitude);
    } catch { /* ignore non‑JSON */ }
  }

  const api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  const fetchWeather = () =>
    new Promise((res, rej) => {
      https.get(api, r => {
        let d = "";
        r.on("data", c => (d += c));
        r.on("end", () => res(JSON.parse(d)));
      }).on("error", rej);
    });

  try {
    const data = await fetchWeather();
    const current = data.current_weather;
    const execution = (performance.now() - start).toFixed(6);

    return new Response(
      JSON.stringify({ temperature: current.temperature, windspeed: current.windspeed, execution }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (e) {
    const execution = (performance.now() - start).toFixed(6);
    return new Response(
      JSON.stringify({ error: e.message, execution }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}

addEventListener("fetch", (e) => e.respondWith(handle(e.request)));
