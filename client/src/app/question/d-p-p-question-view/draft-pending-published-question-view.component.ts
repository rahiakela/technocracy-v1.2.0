import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {AppStore} from "../../store/app.store";
import {AppState} from "../../store/app.reducer";
import {QuestionService} from "../question-service";
import {CoreService} from "../../core/service/core.service";
import {ActivatedRoute} from "@angular/router";
import {Question, QuestionInfo} from "../../shared/model/question-model";
import {Title} from "@angular/platform-browser";
import {User} from "../../shared/model/user-model";
import {UtilsService} from "../../shared/service/utils-service";
import * as QuestionActions from "../../store/question/question.actions";
import * as StatisticsActions from "../../store/statistics/statistics.actions";
import {Store} from "redux";

@Component({
  selector: 'app-draft-pending-published-question-view',
  templateUrl: './draft-pending-published-question-view.component.html',
  styleUrls: ['./draft-pending-published-question-view.component.css']
})
export class DraftPendingPublishedQuestionViewComponent implements OnInit, AfterViewInit {

  question: Question;

  totalVoteUp = 0; totalVoteDown = 0;
  currentUserId = '';
  successMessage = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private coreService: CoreService,
              private questionService: QuestionService,
              private utilService: UtilsService,
              private activeRoute: ActivatedRoute,
              private titleService: Title) {
    // console.log('DraftPendingPublishedQuestionViewComponent is called...');

    this.activeRoute.params.subscribe(params => {
      const questionId = params['_id'];
      this.question = this.coreService.getQuestion(questionId, 'dpp_view');
      // console.log('Title:'+this.question.title);
    });
  }

  ngOnInit() {
    // setting page title
    this.setTitle(this.question.title);
    // set current question for image upload etc.
    this.utilService.setCurrentQuestion(this.question);
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
          this.store.dispatch(StatisticsActions.updateStatistics(1, 'totalPendingQuestion')); //increment total pending question
          this.successMessage = 'Your question has been posted successfully.';
        },
        error => console.log('Server Error:' + error)
      );
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  getCurrentUser(): string {
    return this.utilService.getCurrentUser();
  }

  getCurrentUserId(user: User): string {
    return user != null ? user._id : '';
  }

  getUserName(user: User): string {
    if (user != null) {
      return this.utilService.getUserName(user);
    }

    return '';
  }

  showSkillsHashTag(skills: string[]): string[] {
    return this.utilService.showSkillsHashTag(skills);
  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
