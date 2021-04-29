import {Aurelia} from 'aurelia-framework';
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import { I18N, TCustomAttribute } from "aurelia-i18n";
import XHR from "i18next-xhr-backend";
import { ValidationMessageProvider } from "aurelia-validation";
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
      instance.i18next.use(XHR);

      return instance.setup({
        backend: {
          // <-- configure backend settings
          loadPath: "./locales/{{lng}}/{{ns}}.json", // <-- XHR settings for where to get the files from
        },
        attributes: aliases,
        lng: "de",
        fallbackLng: "en",
        debug: true,
      });
    })
    .feature(PLATFORM.moduleName("resources/index"));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

    ValidationMessageProvider.prototype.getMessage = function (key) {
      const i18n = aurelia.container.get(I18N);
      const translation = i18n.tr(`errorMessages.${key}`);
      return this.parser.parse(translation);
    };

    //@ts-ignore
    ValidationMessageProvider.prototype.getDisplayName = function (
      propertyName,
      displayName
    ) {
      if (displayName !== null && displayName !== undefined) {
        return displayName;
      }
      const i18n = aurelia.container.get(I18N);

      //@ts-ignore
      return i18n.tr(propertyName);
    };

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
