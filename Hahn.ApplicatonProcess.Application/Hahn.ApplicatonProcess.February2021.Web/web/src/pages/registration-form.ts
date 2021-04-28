import { inject } from "aurelia-dependency-injection";
import { Asset } from "../models/asset";
import { IDepartment } from "../models/department";
import { getYearDifference, validateCountry } from "../utils/helper";
import { BootstrapFormRenderer } from "../bootstrap-form-renderer";
import { HttpClient } from "aurelia-http-client";
import { Router } from "aurelia-router";
import { DialogService } from "aurelia-dialog";
import { Prompt } from "./prompt";
import {
  Validator,
  ValidationController,
  validateTrigger,
  ValidationControllerFactory,
  ValidationRules
} from "aurelia-validation";

const API_ENDPOINT = "/api/assets";
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
  httpClient: HttpClient;
  router = null;
  dialogService = null;

  constructor(
    controllerFactory,
    private validator: Validator,
    router,
    dialogService
  ) {
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.controller.subscribe((event) => this.validateWhole());
    this.httpClient = new HttpClient();
    this.router = router;
    this.dialogService = dialogService;
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

    this.httpClient
      .post(API_ENDPOINT, this.asset)
      .then((response) => {
        //redirect to success page on success
        this.router.navigate("/assets/success");
      })
      .catch((err) => {
        this.dialogService.open({
          viewModel: Prompt,
          model: "Asset saving failed",
          lock: false,
        });
      });
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

ValidationRules.customRule(
    "country",
    async (value, _obj) => await validateCountry(value),
    `\${$displayName} is not a valid country.`
);

ValidationRules.ensure("assetName")
  .required()
  .minLength(5)
  .ensure("department")
  .required()
  .ensure("countryOfDepartment")
  .required()
  .satisfiesRule("country")
  .ensure("emailAddressOfDepartment")
  .required()
  .email()
  .ensure("purchaseDate")
  .required()
  .satisfiesRule("date")
  .on(Asset);
