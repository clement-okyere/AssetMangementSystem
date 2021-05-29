import { inject } from "aurelia-dependency-injection";
import {
  Validator,
  ValidationController,
  validateTrigger,
  ValidationControllerFactory,
  ValidationRules,
} from "aurelia-validation";
import { I18N } from "aurelia-i18n";
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
@inject(ValidationControllerFactory, DialogService, Router, Validator, I18N)
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
  dialogService: DialogService = null;
  i18n: I18N;
  router: Router;

  constructor(
    controllerFactory,
    dialogService,
    router,
    private validator: Validator,
    i18n: I18N
  ) {
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.controller.addRenderer(new BootstrapFormRenderer());
    this.controller.subscribe((event) => this.validateWhole());
    this.httpClient = new HttpClient();
    this.dialogService = dialogService;
    this.router = router;
    this.i18n = i18n;
     this.i18n.setLocale("de").then(() => {
       console.log("set German locale");
     });
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
          model: `${this.i18n.tr("asset_failed_prompt")}`,
          lock: false,
        });
      });
  }

  reset() {
    this.dialogService
      .open({
        viewModel: Prompt,
        model: `${this.i18n.tr("reset_prompt")}`,
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
  .displayName("asset name")
  .required()
  .then()
  .minLength(5)
  .ensure("department")
  .required()
  .ensure("countryOfDepartment")
  .displayName("country of department")
  .required()
  .then()
  .satisfiesRule("country")
  .ensure("emailAddressOfDepartment")
  .displayName("email address of department")
  .required()
  .then()
  .email()
  .ensure("purchaseDate")
  .displayName("purchase date")
  .required()
  .then()
  .satisfiesRule("date")
  .on(Asset);

