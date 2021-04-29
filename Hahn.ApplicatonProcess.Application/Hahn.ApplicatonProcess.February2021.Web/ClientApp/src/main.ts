import {Aurelia} from 'aurelia-framework';
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import { TCustomAttribute } from "aurelia-i18n";
import XHR from "i18next-xhr-backend";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName("aurelia-validation"))
    .plugin(PLATFORM.moduleName("aurelia-dialog"))
    .plugin(PLATFORM.moduleName("aurelia-i18n"), (instance) => {
      let aliases = ["t", "i18n"];
      // add aliases for 't' attribute
      TCustomAttribute.configureAliases(aliases);

      // register backend plugin
      // instance.i18next.use(Backend.with(aurelia.loader));
      // register backend plugin
      instance.i18next.use(XHR);

      // adapt options to your needs (see http://i18next.com/docs/options/)
      // make sure to return the promise of the setup method, in order to guarantee proper loading
      return instance.setup({
        backend: {
          // <-- configure backend settings
          loadPath: "/locales/{{lng}}/{{ns}}.json", // <-- XHR settings for where to get the files from
        },
        attributes: aliases,
        lng: "de",
        fallbackLng: "en",
        debug: false,
      });
    })
    .feature(PLATFORM.moduleName("resources/index"));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
