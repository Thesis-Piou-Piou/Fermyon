import { AutoRouter } from "itty-router";

const router = AutoRouter();

router
  /*.get("/", () => new Response("Hello, Spin!"))
  .get("/hello/:name", ({ params }) => new Response(`Hello, ${params.name}!`))*/
  .post("/light-compute", async (request) => {
    const start = performance.now();

    try {
      const { matrixA, matrixB } = await request.json();

      if (!Array.isArray(matrixA) || !Array.isArray(matrixB)) {
        return new Response(
          JSON.stringify({ message: "Missing or invalid matrix data" }),
          { status: 400 }
        );
      }

      if (matrixA[0].length !== matrixB.length) {
        return new Response(
          JSON.stringify({
            message: "Incompatible matrices for multiplication",
          }),
          { status: 400 }
        );
      }

      const resultMatrix = multiplyMatrices(matrixA, matrixB);
      const executionDuration = performance.now() - start;

      return new Response(JSON.stringify({ resultMatrix, executionDuration }), {
        status: 200,
      });
    } catch (e) {
      return new Response(JSON.stringify({ message: "Invalid JSON input" }), {
        status: 400,
      });
    }
  });

addEventListener("fetch", (event) => {
  event.respondWith(router.fetch(event.request));
});

function multiplyMatrices(A, B) {
  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      result[i][j] = 0;
      for (let k = 0; k < A[0].length; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}
