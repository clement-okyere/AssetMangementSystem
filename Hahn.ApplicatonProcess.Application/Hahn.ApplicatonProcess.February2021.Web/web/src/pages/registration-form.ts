import { inject } from "aurelia-dependency-injection";
import { Asset } from "../models/asset";
import { IDepartment } from "../models/department";
import { BootstrapFormRenderer } from "../bootstrap-form-renderer";
import {
  Validator,
  ValidationController,
  validateTrigger,
  ValidationControllerFactory,
  ValidationRules,
} from "aurelia-validation";

@inject(ValidationControllerFactory, Validator, ValidationControllerFactory)
export class RegistrationForm {
  departments: IDepartment[] = [
    { id: 0, name: "HQ" },
    { id: 1, name: "Store1" },
    { id: 2, name: "Store2" },
    { id: 2, name: "Store3" },
    { id: 2, name: "Store4" },
    { id: 2, name: "MaintenanceStation" },
  ];
  private asset: Asset;
  public canSave: Boolean;
  controller: ValidationController;

  constructor(controllerFactory, private validator: Validator) {
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.controller.subscribe((event) => this.validateWhole());
  }

  private validateWhole() {
    this.validator
      .validateObject(this.asset)
      .then(
        (results) => (this.canSave = results.every((result) => result.valid))
      );
  }

  public activate(params) {
    this.asset = new Asset();
  }
}
