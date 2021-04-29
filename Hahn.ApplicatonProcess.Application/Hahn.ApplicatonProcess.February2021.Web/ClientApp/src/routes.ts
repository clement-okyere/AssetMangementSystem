import { PLATFORM } from "aurelia-framework";
export let routes = [
  {
    route: "",
    moduleId: PLATFORM.moduleName("./pages/registration-form"),
    title: "Add Aset",
    name: "root",
  },
  {
    route: "/assets/success",
    moduleId: PLATFORM.moduleName("./pages/success-page"),
    name: "success",
  },
];
