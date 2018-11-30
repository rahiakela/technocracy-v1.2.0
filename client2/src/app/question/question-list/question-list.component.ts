import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Question, QuestionInfo} from '../../shared/model/question-model';
import {CoreService} from '../../core/service/core.service';
import {QuestionService} from "../question-service";
import {AppStore} from "../../store/app.store";
import {AppState} from "../../store/app.reducer";
import * as QuestionActions from '../../store/question/question.actions';
import * as moment from 'moment';
import {ConfirmModalComponent} from "../../shared/modal/confirm-modal.component";
import {PaginationInstance} from "ngx-pagination";
import * as StatisticsActions from "../../store/statistics/statistics.actions";
import {Store} from "redux";
import {UtilsService} from "../../shared/service/utils-service";

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, AfterViewInit {

  questionView: string = 'list-view';
  status: string;
  questions: Question[];
  filteredQuestion: Question[];
  currentQuestionId: string;

  @ViewChild(ConfirmModalComponent)
  private confirmModalComponent: ConfirmModalComponent;

  errorMessage = '';
  successMessage = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private coreService: CoreService,
              private questionService: QuestionService,
              private utilService: UtilsService,
              private activeRoute: ActivatedRoute) {
    //console.log('QuestionListComponent is called...');
    // set default status
    this.status = 'published';
    this.getFilteredQuestion(this.status);
  }

  ngOnInit() {

    this.activeRoute.params.subscribe(params => {
      this.questionView = params['status'];

      // if any user is not logged in then show question list view otherwise question filtered view
      if (this.questionView === 'list' || this.questionView === undefined) {
        this.questions = this.coreService.getQuestions(0);
        this.questionView = 'list-view';
      }else {
        this.questionView = 'filtered-view';
        const questionList = this.store.getState().question.questionList;
        if (questionList.length === 0) { // make sure question list is already set or not
          const userId = this.utilService.getLoggedInUser()._id;
          this.questionService.showAllQuestions(userId)
            .filter((questionInfo: QuestionInfo) => questionInfo.statusCode === 200)
            .subscribe(
              (questionInfo: QuestionInfo) => {
                // set question list into store
                this.store.dispatch(QuestionActions.setQuestionList(questionInfo.questions));
                // filter question list into store based on default status 'published'
                this.getFilteredQuestion(this.status);
              },
              error => console.log('Server Error:' + error)
            );
        }
      }
    });
  }

  filterQuestion(questionStatus: string) {
    this.status = questionStatus;
    // filter question list into store based on status
    this.getFilteredQuestion(this.status);
  }

  getFilteredQuestion(questionStatus: string) {
    // filter question list into store based on status
    this.store.dispatch(QuestionActions.searchQuestion(this.status));
    // get filtered question from store
    const filteredQuestion = this.store.getState().question.filteredQuestion;

    if (filteredQuestion !== undefined && filteredQuestion.length > 0) {
      this.filteredQuestion = filteredQuestion;
      this.errorMessage = ''; // clear previous error message
    } else {
      this.filteredQuestion = []; // clear previous value if the filteredBlog is zero
      this.errorMessage = `There is no ${this.status} question available.`;
    }
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
          this.successMessage = 'Your question has been posted and send to the editor for approval.';
        },
        error => console.log('Server Error:' + error)
      );
  }

  deleteQuestion() {

    // delete question to mongodb
    this.questionService.deleteQuestion(this.currentQuestionId)
      .filter((qInfo: QuestionInfo) => qInfo.statusCode === 200)
      .subscribe(
        (qInfo: QuestionInfo) => {
            // update question list into store with updated one
            this.store.dispatch(QuestionActions.updateQuestionList(qInfo.question));
            // hide the confirm dialog box
            this.confirmModalComponent.hide();
          },
        error => console.log('Error:' + error)
      );
  }

  formatDate(submitDate: Date) {
    return moment(submitDate).format('MM/DD/YYYY');
  }

  trimQuestionContent(content): string {
    return content.length >= 199 ? content.substring(0, 200) : content;
  }

  public pagingConfig: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1
  };

  ngAfterViewInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }

  setCurrentQuestion(questionId: string) {
    this.currentQuestionId = questionId;
  }
}
