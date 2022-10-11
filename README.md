# Deno Tiny Router

A very simple router modeled after [itty router](https://github.com/kwhitley/itty-router).

## Usage

```ts
import { serve } from "https://deno.land/std@0.158.0/http/server.ts";
import {
  RouteHandler,
  Router,
} from "https://deno.land/x/tinyrouter@1.0.0/mod.ts";

const router = new Router();
router.get("/", () => new Response("Home Page"));
router.get<{ name: string }>("/test/:name", (request, params) => {
  return new Response(`Test: ${params.name}`, { status: 200 });
});
router.all("*", () => new Response("Not found", { status: 404 }));

serve((request) => router.handler(request), { port });
```
