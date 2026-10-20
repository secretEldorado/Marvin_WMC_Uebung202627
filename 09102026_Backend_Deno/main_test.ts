import { assertEquals } from "@std/assert";
import { handler } from "./main.ts";

Deno.test("returns html on /", async () => {
  const res = handler(new Request("http://localhost/"));
  assertEquals(res.status , 200);
  const body = await res.text();
  assertEquals(body.includes("backend-demo"), true);
});

Deno.test("returns json on /api", async () => {
  const res = handler(new Request("http://localhost/api"));
  const data = await res.json();
  assertEquals(data.message, "Hello, world!");
  assertEquals(typeof data.time, "string");
});
