import { AutoRouter } from 'itty-router';

const router = AutoRouter();

router.get('/', async (request) => {
  const start = performance.now();

  const url = new URL(request.url);
  const lat = url.searchParams.get('latitude') || '57.7089';
  const lon = url.searchParams.get('longitude') || '11.9746';

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Request failed with ${response.status}`);

    const data = await response.json();
    const current = data.current_weather;

    const execution = (performance.now() - start).toFixed(6);

    return new Response(
      JSON.stringify({
        temperature: current.temperature,
        windspeed: current.windspeed,
        execution
      }),
      { status: 200 }
    );
  } catch (err: unknown) {
    // Type assertion: assuming 'err' is an instance of Error
    const error = err instanceof Error ? err : new Error('An unknown error occurred');
    const execution = (performance.now() - start).toFixed(6);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        execution
      }),
      { status: 500 }
    );
  }
});

addEventListener('fetch', (event: Event) => {
    const fetchEvent = event as any; 
    fetchEvent.respondWith(router.fetch(fetchEvent.request));
  });