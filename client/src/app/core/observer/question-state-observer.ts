import {Subject} from "rxjs/Subject";
import {QuestionState} from "../../store/question/question.reducer";
import {Injectable} from "@angular/core";

@Injectable()
export class QuestionStateObserver {

  private subject = new Subject<QuestionState>();
  questionState = this.subject.asObservable();

  constructor() {}

  pushQuestionState(state) {
    this.subject.next(state);
  }
}
