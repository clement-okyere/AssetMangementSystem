import { inject } from "aurelia-dependency-injection";
import {
  Validator,
  ValidationController,
  validateTrigger,
  ValidationControllerFactory,
  ValidationRules,
} from "aurelia-validation";
import { Asset } from "../models/asset";
import { BootstrapFormRenderer } from "../bootstrap-form-renderer";
import { HttpClient } from "aurelia-http-client";
import { DialogService } from "aurelia-dialog";
import { Prompt } from "./prompt";
import { Router } from "aurelia-router";
import { getYearDifference, validateCountry } from "../utils/helper";

const API_ENDPOINT = "/api/assets";
interface IDepartment {
  id: number;
  name: string;
}
@inject(
  ValidationControllerFactory,
  DialogService,
  Router,
  Validator,
  ValidationControllerFactory,
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
  httpClient: HttpClient;
  controller: ValidationController = null;
  dialogService = null;
  router = null;
    
  constructor(
    controllerFactory,
    dialogService,
    router,
    private validator: Validator,
  ) {
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.controller.subscribe((event) => this.validateWhole());
    this.httpClient = new HttpClient();
    this.dialogService = dialogService;
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
    this.dialogService
      .open({
        viewModel: Prompt,
        model: "Are you sure you want to reset all data?",
        lock: false,
      })
      .whenClosed((response) => {
        if (!response.wasCancelled) {
          this.asset = new Asset();
        }
      });
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
