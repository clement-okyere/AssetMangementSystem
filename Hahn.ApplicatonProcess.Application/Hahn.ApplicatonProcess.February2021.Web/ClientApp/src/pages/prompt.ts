import { DialogController } from "aurelia-dialog";
import { useView, PLATFORM } from "aurelia-framework";

@useView(PLATFORM.moduleName("pages/prompt.html"))
export class Prompt {
  static inject = [DialogController];
  question: any;
  constructor(public controller, public answer) {
    this.controller = controller;
    this.answer = null;

    controller.settings.lock = false;
  }

  activate(question) {
    this.question = question;
  }
}
