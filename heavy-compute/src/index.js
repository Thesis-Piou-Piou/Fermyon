async function handle(request) {
  const start = performance.now();

  const { n } = await request.json();
  if (isNaN(n) || n <= 0) {
    return new Response("Invalid input: n must be a positive integer", {
      status: 400,
    });
  }
  const result = estimatePi(n);
  const executionDuration = performance.now() - start;

  return new Response(
    JSON.stringify({ result, execution: executionDuration }),
    {
      status: 200,
    }
  );
}

addEventListener("fetch", (event) => {
  event.respondWith(handle(event.request));
});

export function estimatePi(n) {
  let inside = 0;

  for (let i = 0; i < n; i++) {
    const x = Math.random();
    const y = Math.random();

    if (x * x + y * y <= 1) {
      inside++;
    }
  }

  const piEstimate = 4 * (inside / n);
  return piEstimate;
}
