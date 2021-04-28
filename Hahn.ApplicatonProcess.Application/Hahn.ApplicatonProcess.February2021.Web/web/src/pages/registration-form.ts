import { inject } from "aurelia-dependency-injection";
import { Asset } from "../models/asset";
import { IDepartment } from "../models/department";
import { getYearDifference } from "../utils/helper";
import { BootstrapFormRenderer } from "../bootstrap-form-renderer";
import { Router } from "aurelia-router";
import {
  Validator,
  ValidationController,
  validateTrigger,
  ValidationControllerFactory,
  ValidationRules,
} from "aurelia-validation";

@inject(
  ValidationControllerFactory,
  Validator,
  ValidationControllerFactory,
  Router
)
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
  router = null;

  constructor(controllerFactory, private validator: Validator, router) {
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.controller.subscribe((event) => this.validateWhole());
    this.router = router;
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

  get canReset() {
    return (
      this.asset.assetName ||
      this.asset.department ||
      this.asset.countryOfDepartment ||
      this.asset.emailAddressOfDepartment ||
      this.asset.purchaseDate
    );
  }

  save() {
    if (!this.canSave) {
      return;
    }
    this.router.navigate("/assets/success");
  }

  reset() {
          this.asset = new Asset();
    } 
}

ValidationRules.customRule(
  "date",
  (value, _obj) => getYearDifference(value) < 1,
  `\${$displayName} must not be older than one year.`
);
