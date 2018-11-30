import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {User, UserInfo} from '../../shared/model/user-model';
import {environment} from '../../../environments/environment';
import {Blog, BlogInfo} from '../../shared/model/blog-model';
import {AppState} from "../../store/app.reducer";
import {AppStore} from "../../store/app.store";
import {ProfileInfo} from "../../shared/model/profile-model";
import {Statistics} from "../../shared/model/statistics";
import {Store} from "redux";
import {QuestionInfo} from "../../shared/model/question-model";

@Injectable()
export class CoreRepository {

  REST_URL = environment.REST_URL;

  constructor(private http: HttpClient, @Inject(AppStore) private store: Store<AppState>) {

  }

  getBlogs(page: number): Observable<BlogInfo> {
    return this.sendRequest('GET', `${this.REST_URL}/blog/${page}`);
  }

  getQuestions(page: number): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/question/${page}`);
  }

  getStatistics(userId: string, profileId?: string): Observable<Statistics> {
    return Observable.forkJoin([
      this.sendRequest('GET', `${this.REST_URL}/blog/statistics/${profileId}`),
      this.sendRequest('GET', `${this.REST_URL}/blog/statistics/pending/${profileId}`),
      this.sendRequest('GET', `${this.REST_URL}/question/statistics/${userId}`),
      this.sendRequest('GET', `${this.REST_URL}/question/statistics/pending/${userId}`)
    ])
      .map((statics: any[]) => {
        const {totalBlog} = statics[0];
        const {totalPendingBlog} = statics[1];
        const {totalQuestion} = statics[2];
        const {totalPendingQuestion} = statics[3];
        const blogQuestionStatics: Statistics = {totalBlog, totalPendingBlog, totalQuestion, totalPendingQuestion};
        return blogQuestionStatics;
      });
  }

  loadBlog(blogId: string): Observable<BlogInfo> {
    return this.sendRequest('GET', `${this.REST_URL}/blog/load/${blogId}`);
  }

  loadQuestion(questionId: string): Observable<QuestionInfo> {
    return this.sendRequest('GET', `${this.REST_URL}/question/load/${questionId}`);
  }

  search(query: string): Observable<Blog[]> {
    return this.sendRequest('GET', `${this.REST_URL}/blog/search/${query}`);
  }

  signup(user: User): Observable<UserInfo> {
    return this.sendRequest('POST', `${this.REST_URL}/register`, user);
  }

  login(user: User): Observable<UserInfo> {
    return this.sendRequest('POST', `${this.REST_URL}/login`, user);
  }

  saveProfile(userModel: User): Observable<UserInfo> {
    return this.sendRequest('POST', `${this.REST_URL}/profile`, userModel);
  }

  getProfile(userId: string): Observable<ProfileInfo> {
    return this.sendRequest('GET', `${this.REST_URL}/profile/${userId}`);
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
