import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {QuestionComponent} from './question.component';
import {SharedModule} from '../shared/shared.module';
import {QuestionViewComponent} from './question-view/question-view.component';
import {QuestionEditComponent} from './question-edit/question-edit.component';
import {QuestionService} from './question-service';
import {RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings} from 'ng-recaptcha';
import {QuestionRepository} from './question-repository';
import {QuestionResolver} from './question-resolver';
import {QuestionListComponent} from './question-list/question-list.component';
import {NewQuestionComponent} from './new-question/new-question.component';
import {RouterModule, Routes} from '@angular/router';
import { DraftPendingPublishedQuestionViewComponent } from './d-p-p-question-view/draft-pending-published-question-view.component';
import { PendingQuestionsComponent } from './pending-questions/pending-questions.component';
import { PendingQuestionViewComponent } from './pending-question-view/pending-question-view.component';
import {NgxPaginationModule} from "ngx-pagination";

const globalSettings: RecaptchaSettings = { siteKey: '6LdMVz4UAAAAAClv3WheCRrgtoDyPUtFfGhikGu4' };

export const questionRoutes: Routes = [
  // list question route( /question >> question/list )
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: QuestionListComponent },

  // question post route( /question/ask/new >> question/post/new )
  { path: 'ask/:new', redirectTo: 'post/new', pathMatch: 'full' },
  { path: 'post/new', component: NewQuestionComponent },

  // question operation route( /question/q_show/draft or pending & published)
  { path: 'q_show/:status', component: QuestionListComponent },

  // question dpp route( /question/q_show/draft or pending & published/_id >> question/d_p_p_view/:_id)
  { path: 'q_show/:status/:_id', redirectTo: 'd_p_p_view/:_id', pathMatch: 'full' },
  { path: 'd_p_p_view/:_id', component: DraftPendingPublishedQuestionViewComponent },

  // question dpp route( /question/d_p_p_view/_id/_id >> question/d_p_p_edit/:_id/status)
  { path: 'd_p_p_view/:_id/:_id/:status', redirectTo: 'd_p_p_edit/:_id/:status', pathMatch: 'full' },
  // question dpp route( /question/q_show/draft or pending & published/_id/draft or pending & published >> question/d_p_p_view/:_id/:status)
  { path: 'q_show/:status/:_id/:status', redirectTo: 'd_p_p_edit/:_id/:status', pathMatch: 'full' },
  { path: 'd_p_p_edit/:_id/:status', component: QuestionEditComponent },

  // single question route( /question/q_show/list/solo/view/_id >> question/_id )
  { path: 'q_show/list/solo/view/:_id', redirectTo: ':_id', pathMatch: 'full' },
  // single question route( /question/list/_id >> question/_id )
  { path: 'list/:_id', redirectTo: ':_id', pathMatch: 'full' },
  { path: ':_id', component: QuestionViewComponent, resolve: {question: QuestionResolver} },

  // question edit route( /question/_id/_id >> question/edit/_id )
  { path: ':_id/:_id', redirectTo: 'edit/:_id', pathMatch: 'full' },
  { path: 'edit/:_id', component: QuestionEditComponent },

  // show all pending question route( /question/show/all/pending)
  { path: 'show/all/pending', component: PendingQuestionsComponent },

  // pending question solo view route( /question/show/all/pending/:_id >> question/p_b_view/:_id)
  { path: 'show/all/pending/:_id', redirectTo: 'p_q_view/:_id', pathMatch: 'full'},
  { path: 'p_q_view/:_id', component: PendingQuestionViewComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),
    NgxPaginationModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    QuestionComponent,
    QuestionListComponent,
    QuestionViewComponent,
    NewQuestionComponent,
    QuestionEditComponent,
    DraftPendingPublishedQuestionViewComponent,
    PendingQuestionsComponent,
    PendingQuestionViewComponent
  ],
  exports: [
  ],
  providers: [
    QuestionService,
    QuestionRepository,
    QuestionResolver,
    {provide: RECAPTCHA_SETTINGS, useValue: globalSettings}
  ]
})
export class QuestionModule {
  constructor() {
    // console.log('Loading QuestionModule...');
  }
}


