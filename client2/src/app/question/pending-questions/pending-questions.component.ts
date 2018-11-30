import {AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {AppState} from "../../store/app.reducer";
import {AppStore} from "../../store/app.store";
import {QuestionService} from "../question-service";
import {Question, QuestionInfo} from "../../shared/model/question-model";
import * as moment from 'moment';
import * as QuestionActions from '../../store/question/question.actions';
import {PaginationInstance} from "ngx-pagination";
import {UtilsService} from "../../shared/service/utils-service";
import * as StatisticsActions from "../../store/statistics/statistics.actions";
import {Store} from "redux";

@Component({
  selector: 'app-pending-questions',
  templateUrl: './pending-questions.component.html',
  styleUrls: ['./pending-questions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingQuestionsComponent implements OnInit, AfterViewInit {

  questions: Question[];
  errorMessage = '';
  successMessage = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private questionService: QuestionService,
              private utilService: UtilsService) {

  }

  ngOnInit() {
    const pendingQuestionList = this.store.getState().question.pendingQuestionList;
    if (pendingQuestionList.length === 0) { // // make sure pending question list is already set or not
      this.questionService.getPendingQuestionList()
        .filter((qInfo: QuestionInfo) => qInfo.statusCode === 200)
        .subscribe(
          (qInfo: QuestionInfo) => {
            this.questions = qInfo.questions;
            // set pending question list into store
            if (this.questions) {
              this.store.dispatch(QuestionActions.setPendingQuestionList(qInfo.questions));
            } else {
              this.errorMessage = 'There is no pending blog available.';
            }
            this.hideLoading();
          },
          (error: any) => {
            console.log('Server Error:' + error);
            this.errorMessage = 'There is no pending question available.';
          }
        );
    } else {
      this.questions = pendingQuestionList;
      this.hideLoading();
    }
  }

  hideLoading() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }

  formatDate(submitDate: Date) {
    return moment(submitDate).format('LLL');
  }

  modifyQuestion(questionId: string, status: string) {
    this.questionService.modifyQuestion(questionId, status)
      .filter((qInfo: QuestionInfo) => qInfo.statusCode === 200)
      .subscribe(
        (qInfo: QuestionInfo) => {
          // reset selected question into store
          this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question));
          // update pending question list into store by removing it
          this.store.dispatch(QuestionActions.updatePendingQuestionList(qInfo.question));
          // update question list into store with updated one
          this.store.dispatch(QuestionActions.updateQuestionList(qInfo.question));
          // update statistics into store
          this.store.dispatch(StatisticsActions.updateStatistics(-1, 'totalPendingQuestion')); //decrement total pending question
          this.showMessage(status);
        },
        error => console.log('Server Error:' + error)
      );
  }

  private showMessage(status: string) {
    switch (status) {
      case 'published':
        this.successMessage = 'The question has been published.';
        break;
      case 'on_hold':
        this.successMessage = 'The question has been put on hold.';
        break;
      case 'rejected':
        this.successMessage = 'The question has been rejected.';
        break;
    }
  }

  public pagingConfig: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1
  };

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
