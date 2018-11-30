import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {CoreService} from "../../core/service/core.service";
import {UtilsService} from "../../shared/service/utils-service";
import {ActivatedRoute} from "@angular/router";
import {Question, QuestionInfo} from "../../shared/model/question-model";
import {User} from "../../shared/model/user-model";
import * as QuestionActions from "../../store/question/question.actions";
import * as StatisticsActions from "../../store/statistics/statistics.actions";
import {QuestionService} from "../question-service";
import {AppState} from "../../store/app.reducer";
import {AppStore} from "../../store/app.store";
import {Store} from "redux";

@Component({
  selector: 'app-pending-question-view',
  templateUrl: './pending-question-view.component.html',
  styleUrls: ['./pending-question-view.component.css']
})
export class PendingQuestionViewComponent implements OnInit, AfterViewInit {

  question: Question;
  successMessage = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private coreService: CoreService,
              private questionService: QuestionService,
              private utilService: UtilsService,
              private activeRoute: ActivatedRoute,
              private titleService: Title) {
    this.activeRoute.params.subscribe(params => {
      const questionId = params['_id'];
      this.question = this.coreService.getQuestion(questionId, 'p_q_view');

      // setting page title
      this.setTitle(this.question.title);
      // set current question for image upload etc.
      this.utilService.setCurrentQuestion(this.question);
    });
  }

  ngOnInit() {
  }

  modifyQuestion(questionId: string, status: string) {
    this.questionService.modifyQuestion(questionId, status)
      .filter((qInfo: QuestionInfo) => qInfo.statusCode === 200)
      .subscribe(
        (qInfo: QuestionInfo) => {
          // reset selected question into store
          this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question));
          // update question list into store with updated one
          this.store.dispatch(QuestionActions.updateQuestionList(qInfo.question));
          // update statistics into store
          this.store.dispatch(StatisticsActions.updateStatistics(-1, 'totalPendingQuestion')); //decrement total pending question
          this.successMessage = 'The question has been published successfully.';
        },
        error => console.log('Server Error:' + error)
      );
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  showSkillsHashTag(skills: string[]): string[] {
    return this.utilService.showSkillsHashTag(skills);
  }

  getUserName(user: User): string {
    if (user != null) {
      return this.utilService.getUserName(user);
    }

    return '';
  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
