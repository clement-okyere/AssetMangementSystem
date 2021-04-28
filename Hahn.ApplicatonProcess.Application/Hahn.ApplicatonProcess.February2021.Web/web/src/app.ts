import { Router, RouterConfiguration } from "aurelia-router";
import { inject } from "aurelia-dependency-injection";
import { routes } from "./routes";

@inject(RouterConfiguration, Router)
export class App {
  router: Router;
  constructor(router) {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Assets";
    config.options.pushState = true;
    config.options.root = "/";
    config.map(routes);

    this.router = router;
    console.log("main router", this.router);
  }
}
