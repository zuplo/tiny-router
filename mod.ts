export type DefaultParams = Record<string, string>;

export type RouteHandler<T = DefaultParams> = (
  request: Request,
  params: T
) => Promise<Response> | Response;

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD";

interface Route<T = DefaultParams> {
  methods: HttpMethod[];
  pattern: URLPattern;
  handler: RouteHandler<T>;
}

export class Router {
  // deno-lint-ignore no-explicit-any
  routes: Route<any>[];

  constructor() {
    this.routes = [];
  }

  get<T = DefaultParams>(pathname: string, handler: RouteHandler<T>) {
    this.add(["GET"], pathname, handler);
  }
  post<T = DefaultParams>(pathname: string, handler: RouteHandler<T>) {
    this.add(["POST"], pathname, handler);
  }
  put<T = DefaultParams>(pathname: string, handler: RouteHandler<T>) {
    this.add(["PUT"], pathname, handler);
  }
  patch<T = DefaultParams>(pathname: string, handler: RouteHandler<T>) {
    this.add(["PATCH"], pathname, handler);
  }
  delete<T = DefaultParams>(pathname: string, handler: RouteHandler<T>) {
    this.add(["DELETE"], pathname, handler);
  }
  options<T = DefaultParams>(pathname: string, handler: RouteHandler<T>) {
    this.add(["OPTIONS"], pathname, handler);
  }
  head<T = DefaultParams>(pathname: string, handler: RouteHandler<T>) {
    this.add(["HEAD"], pathname, handler);
  }
  all<T = DefaultParams>(pathname: string, handler: RouteHandler<T>) {
    this.add(
      ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
      pathname,
      handler
    );
  }
  add<T = DefaultParams>(
    methods: HttpMethod[],
    pathname: string,
    handler: RouteHandler<T>
  ) {
    this.routes.push({
      methods,
      pattern: new URLPattern({ pathname }),
      handler,
    });
  }
  async handler(req: Request): Promise<Response> {
    const route = this.routes.find(
      (route) =>
        route.methods.includes(req.method as HttpMethod) &&
        route.pattern.test(req.url)
    );
    if (route) {
      const result = route.pattern.exec(req.url);
      const params = result?.pathname.groups ?? {};
      return await route.handler(req, params);
    }
    return new Response(null, { status: 404 });
  }
}
