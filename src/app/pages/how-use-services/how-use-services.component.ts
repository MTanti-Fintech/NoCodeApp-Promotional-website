import { StaticQuestionsData } from "./static-questions-data.service";
import { Component, OnInit } from "@angular/core";
@Component({
  selector: "app-how-use-services",
  templateUrl: "./how-use-services.component.html",
  styleUrls: ["./how-use-services.component.scss"],
})
export class HowUseServicesComponent implements OnInit {
  query: string;
  questionData: any;
  constructor(private staticQuestionData: StaticQuestionsData) {
    this.questionData = staticQuestionData.data;
  }

  ngOnInit(): void {}
}
