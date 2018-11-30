import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {QuestionService} from '../question-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Question, QuestionInfo, QuestionModel} from '../../shared/model/question-model';
import {Title} from '@angular/platform-browser';
import {UtilsService} from "../../shared/service/utils-service";
import {AppState} from "../../store/app.reducer";
import {AppStore} from "../../store/app.store";
import * as QuestionActions from "../../store/question/question.actions";
import * as StatisticsActions from "../../store/statistics/statistics.actions";
import {Store} from "redux";

@Component({
  selector: 'app-new-question',
  templateUrl: './new-question.component.html',
  styleUrls: ['./new-question.component.css']
})
export class NewQuestionComponent implements OnInit, AfterViewInit {

  questionModel: QuestionModel = {};
  question: Question;

  errorMessage = '';
  successMessage = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private questionService: QuestionService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private utilService: UtilsService,
              private titleService: Title) {

  }

  ngOnInit() {
    this.clearErrorMessage();
  }

  saveQuestion(questionModel: QuestionModel): boolean {
    // validate the required fields
    if (!questionModel.title || questionModel.title === '') {
      this.errorMessage = 'Please provide question title.';
      return false;
    }else if (!this.question.content || this.question.content === '') {
      this.errorMessage = 'Please provide question content.';
      return false;
    } else  {
      this.errorMessage = '';
    }

    this.submitQuestion(questionModel, 'save');
  }

  draftQuestion(questionModel: QuestionModel): boolean {
    // validate the required fields
    if (!questionModel.title || questionModel.title === '') {
      this.errorMessage = 'Please provide question title.';
      return false;
    }else if (!this.question.content || this.question.content === '') {
      this.errorMessage = 'Please provide question content.';
      return false;
    } else  {
      this.errorMessage = '';
    }

    this.submitQuestion(questionModel, 'draft');
  }

  public submitQuestion(questionModel: QuestionModel, actionType: string) {

    this.question.title = questionModel.title;
    if (this.questionModel.tag) {
      // converting tags string value to array string
      const tag: string = questionModel.tag;
      this.question.tags = tag.split(',');
    }

    // post question to mongodb
    this.questionService.saveQuestion(this.question, this.utilService.getCurrentUser(), actionType)
      .filter((qInfo: QuestionInfo) => qInfo.statusCode === 200)
      .subscribe((qInfo: QuestionInfo) => {
        // console.log('Question Returned>>' + JSON.stringify(data));
        this.question = qInfo.question;
        // setting page title
        this.setTitle(this.question.title);
        // update question list into store with updated one
        this.store.dispatch(QuestionActions.updateQuestionList(qInfo.question));
        if (actionType === 'save') {
          // update statistics into store
          this.store.dispatch(StatisticsActions.updateStatistics(1, 'totalQuestion')); //increment total question
          if (qInfo.question.askedBy._id === this.utilService.getLoggedInUser()._id) {
            this.store.dispatch(StatisticsActions.updateStatistics(1, 'totalPendingQuestion')); //increment total pending question
          }
          this.successMessage = 'Your question has been posted and send to the editor for approval.';
        } else {
          this.successMessage = 'Your question has been saved as draft for further modification.';
        }
    });
  }

  discardQuestion(questionModel: QuestionModel) {
    this.questionModel.title = '';
    this.questionModel.content = '';
    this.questionModel.tag = '';
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  questionKeyupHandler(value: any) {
    // console.log('Question content:' + value);
    this.question = {
      content: this.utilService.encodeHtml(value)
    };
  }

  public resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response ${captchaResponse}:`);
    if (captchaResponse) {
      document.getElementById('re-captcha-post-question').removeAttribute('disabled');
      document.getElementById('re-captcha-draft-question').removeAttribute('disabled');
      document.getElementById('re-captcha-discard-question').removeAttribute('disabled');
    }
  }

  clearErrorMessage(): void {
    // clear previous error message
    this.errorMessage = '';
  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
