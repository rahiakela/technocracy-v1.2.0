import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';
import {Question, QuestionInfo} from '../shared/model/question-model';
import {Comment, Reply} from '../shared/model/comment-model';
import {environment} from '../../environments/environment';
import {AppState} from "../store/app.reducer";
import {AppStore} from "../store/app.store";
import {Store} from "redux";

@Injectable()
export class QuestionRepository {

  REST_URL = environment.REST_URL;

  constructor(private http: HttpClient, @Inject(AppStore) private store: Store<AppState>) {

  }

  getPendingQuestionList(): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/question/list/pending`);
  }

  showAllQuestions(askedBy: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/question/all/${askedBy}`);
  }

  saveQuestion(question: Question, userId: string, actionType: string): Observable<QuestionInfo> {
    return this.sendRequest('POST', `${this.REST_URL}/question/${userId}/${actionType}`, question);
  }

  modifyQuestion(questionId: string, actionType: string): Observable<QuestionInfo> {
    return this.sendRequest('PUT', `${this.REST_URL}/question/${questionId}/${actionType}`, '');
  }

  editQuestion(question: Question, questionId: string): Observable<QuestionInfo> {
    return this.sendRequest('PUT', `${this.REST_URL}/question/${questionId}`, question);
  }

  editCommentReply(actionType: string, questionId: string, commentReply: any): Observable<QuestionInfo> {
    return this.sendRequest('PUT', `${this.REST_URL}/question/comment/${questionId}/${actionType}`, commentReply);
  }

  deleteCommentAndReply(questionId: string, actionId: string, actionType: string): Observable<any> {
    return this.sendRequest('DELETE', `${this.REST_URL}/question/comment/${questionId}/${actionId}/${actionType}`);
  }

  loadQuestion(questionId: string): Observable<Question> {
    return this.sendRequest('GET', `${this.REST_URL}/question/load/${questionId}`);
  }

  deleteQuestion(questionId: string): Observable<any> {
    return this.sendRequest('DELETE', `${this.REST_URL}/question/${questionId}`, '');
  }

  like(questionId: string, userId: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/question/like/${questionId}/${userId}`);
  }

  addComment(questionId: string, userId: string, comment: Comment): Observable<any> {
    return this.sendRequest('POST', `${this.REST_URL}/question/comment/${userId}/${questionId}`, comment);
  }

  likeComment(userId: string, questionId: string, commentId: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/comment/${userId}/${questionId}/like/${commentId}`, '', 'operation=question');
  }

  reply(userId: string, questionId: string, commentId: string, reply: Reply): Observable<any> {
    return this.sendRequest('POST', `${this.REST_URL}/reply/${userId}/${questionId}/${commentId}`, reply, 'operation=question');
  }

  likeReply(userId: string, questionId: string, commentId: string, replyId: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/reply/${userId}/${questionId}/${commentId}/like/${replyId}`, 'operation=question');
  }

  voteUp(questionId: string, userId: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/question/voteup/${questionId}/${userId}`);
  }

  voteDown(questionId: string, userId: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/question/votedown/${questionId}/${userId}`);
  }

  private sendRequest(verb: string, url: string, body?: any, params?: any): Observable<any> {

    let headers = null;
    // add JWT token with request headers
    const user = this.store.getState().user.currentUser;
    if (user != null) {
      headers = new HttpHeaders({ 'x-access-token': user.jwtToken, 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' })
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' })
    }

    return this.http.request(verb, url, {
      headers: headers,
      body: body,
      responseType: "json",
      params: new HttpParams({fromString: params})
    })
    .catch((error: Response) => Observable.throw(`Network Error: ${error.statusText} (${error.status})`));
  }
}
