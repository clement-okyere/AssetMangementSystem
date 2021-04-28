import { inject } from "aurelia-dependency-injection";
import {
  Validator,
  ValidationController,
  validateTrigger,
  ValidationControllerFactory,
  ValidationRules,
} from "aurelia-validation";

@inject(ValidationControllerFactory, Validator, ValidationControllerFactory)
export class RegistrationForm {
  controller: ValidationController;

  constructor(
    controllerFactory,
  ) {
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
  }
}
