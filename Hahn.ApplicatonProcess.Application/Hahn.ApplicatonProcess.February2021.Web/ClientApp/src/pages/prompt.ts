import { DialogController } from "aurelia-dialog";

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
