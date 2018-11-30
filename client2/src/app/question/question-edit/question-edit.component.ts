import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Question, QuestionInfo, QuestionModel} from '../../shared/model/question-model';
import {CoreService} from '../../core/service/core.service';
import {Title} from '@angular/platform-browser';
import {QuestionService} from '../question-service';
import {UtilsService} from "../../shared/service/utils-service";
import {AppState} from "../../store/app.reducer";
import {AppStore} from "../../store/app.store";
import * as QuestionActions from '../../store/question/question.actions';
import * as StatisticsActions from "../../store/statistics/statistics.actions";
import {Store} from "redux";

@Component({
  selector: 'app-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.css']
})
export class QuestionEditComponent implements OnInit, AfterViewInit {

  questionModel: QuestionModel = {};
  public question: Question = {};
  status: string;

  successMessage = ''; errorMessage = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private questionService: QuestionService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private coreService: CoreService,
              private utilService: UtilsService,
              private titleService: Title) {

    // console.log('QuestionEditComponent called...');
  }

  ngOnInit() {
    this.activeRoute.params
      .subscribe(params => {
        const questionId = params['_id'];
        this.status = params['status'];
        // console.log(`Params>> ${questionId} and  ${status}`);

        let q: Question = {};
        if (this.status === undefined) {
          q = this.coreService.getQuestion(questionId)[0];
        } else {
          q = this.coreService.getQuestion(questionId, this.status)[0];
        }

        if (q !== undefined) {
          this.questionModel.questionId = q._id;
          this.questionModel.title = q.title;
          this.questionModel.content = this.utilService.decodeHTML(q.content);
          this.questionModel.tag = this.getTags(q.tags);
        }
      });

    this.clearErrorMessage();
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  questionKeyupHandler(value: any) {
    // this.question.content = this.utilService.encodeHtml(value);
    this.question = {
      content: this.utilService.encodeHtml(value)
    };
  }

  public resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response ${captchaResponse}:`);
    if (captchaResponse) {
      document.getElementById('re-captcha-post-question').removeAttribute('disabled');
    }
  }

  editQuestion(questionModel: QuestionModel) {
    // console.log('Edit Question:' + questionModel.title);
    this.question.title = questionModel.title;
    // converting tags string value to array string
    if (questionModel.tag !== undefined) {
      const tag: string = questionModel.tag;
      this.question.tags = tag.split(',');
    }
    if (this.question.content === undefined || this.question.content === null) {
      this.question.content = this.utilService.encodeHtml(questionModel.content);
    }

    // question-edit question to mongodb
    this.questionService.editQuestion(this.question, this.questionModel.questionId)
      .filter((qInfo: QuestionInfo) => qInfo.statusCode === 200)
      .subscribe((qInfo: QuestionInfo) => {
        this.question = qInfo.question;
        // reset selected question into store
        this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question));
        // update question list into store with updated one
        this.store.dispatch(QuestionActions.updateQuestionList(qInfo.question));
        // update statistics into store
        this.store.dispatch(StatisticsActions.updateStatistics(1, 'totalPendingQuestion')); //increment total pending question
        // setting page title
        this.setTitle(this.question.title);
        this.successMessage = 'Your question updated successfully.';
    });
  }

  postQuestion(questionId: string) {
    // validate the required fields
    if (!this.questionModel.title || this.questionModel.title === '') {
      this.errorMessage = 'Please provide question title.';
      return false;
    }else if (!this.question.content || this.question.content === '') {
      this.errorMessage = 'Please provide question content.';
      return false;
    } else  {
      this.errorMessage = '';
    }

    this.questionService.modifyQuestion(questionId, 'pending')
      .filter((qInfo: QuestionInfo) => qInfo.statusCode === 200)
      .subscribe((qInfo: QuestionInfo) => {
        this.question = qInfo.question;
        // reset selected question into store
        this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question));
        // update question list into store with updated one
        this.store.dispatch(QuestionActions.updateQuestionList(qInfo.question));
        this.successMessage = 'You have post your question successfully.';
      });
  }

  clearErrorMessage(): void {
    // clear previous error message
    this.errorMessage = '';
  }

  getTags(skills: string[]): string {
    let str = '';
    skills.forEach(s => str +=s+',');
    return str;
  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
