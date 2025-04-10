import { ResponseBuilder } from "@fermyon/spin-sdk";

/* export async function handler(req: Request, res: ResponseBuilder) {
    console.log(req);
    res.send("hello pew pew");
}
*/


// Capture the cold start timestamp when the module loads
const coldStartTime = Date.now();

export async function handler(req: Request, res: ResponseBuilder) {
  const executionStart = Date.now();

  // Simulate a network call
  const networkStart = Date.now();
  const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const data = await response.json();
  const networkDuration = Date.now() - networkStart;

  const computationStart = Date.now();
  const result = 42768 * 65572;
  const computationDuration = Date.now() - computationStart;

  const executionDuration = Date.now() - executionStart;
  const coldStartLatency = executionStart - coldStartTime;

  const metrics = {
    result,
    coldStartLatency: `${coldStartLatency}ms`,
    computationDuration: `${computationDuration}ms`,
    networkDuration: `${networkDuration}ms`,
    executionDuration: `${executionDuration}ms`,
    networkTitle: data.title,
  };

  console.log("[metrics]", metrics);

  res.status(200);
  res.headers.set("content-type", "application/json");
  res.send(JSON.stringify(metrics));
}
