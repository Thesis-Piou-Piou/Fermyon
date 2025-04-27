async function handle(request: Request): Promise<Response> {
 const start = performance.now();

 const url = new URL(request.url);
 const lat = url.searchParams.get("latitude") || "57.7089";
 const lon = url.searchParams.get("longitude") || "11.9746";

 const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

 try {
   const response = await fetch(apiUrl, {
     method: "GET",
   });

   if (!response.ok) {
     throw new Error(`Request failed with status ${response.status}`);
   }

   const data = await response.json();
   const current = data.current_weather;

   const execution = (performance.now() - start).toFixed(6);

   return new Response(
     JSON.stringify({
       temperature: current.temperature,
       windspeed: current.windspeed,
       execution,
     }),
     { status: 200 }
   );
 } catch (err) {
   const error =
     err instanceof Error ? err : new Error("An unknown error occurred");
   const execution = (performance.now() - start).toFixed(6);

   return new Response(
     JSON.stringify({
       error: error.message,
       execution,
     }),
     { status: 500 }
   );
 }
}

//@ts-ignore
addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handle(event.request));
});
