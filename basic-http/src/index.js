// For AutoRouter documentation refer to https://itty.dev/itty-router/routers/autorouter
import { AutoRouter } from "itty-router";

let router = AutoRouter();

// Route ordering matters, the first route that matches will be used
// Any route that does not return will be treated as a middleware
// Any unmatched route will return a 404
router.get("/basic-http", async () => {
  const start = performance.now();

  // artificial delay for testing:
  //await new Promise((res) => setTimeout(res, 200)); // example delay

  const message = "Function executed";
  const end = performance.now();

  const executionTime = end - start;

  const body = JSON.stringify({
    message,
    execution: executionTime.toFixed(6), // in milliseconds
  });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
});
//.get("/basic-http/hello/:name", ({ name }) => `Hello, ${name}!`);

addEventListener("fetch", (event) => {
  event.respondWith(router.fetch(event.request));
});
