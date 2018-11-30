import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Blog} from '../shared/model/blog-model';
import {environment} from '../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class HomeRepository {

  REST_URL = environment.REST_URL;

  constructor(private http: HttpClient) {

  }

  getBlogs(page: number): Observable<Blog[]> {
    return this.sendRequest('GET', `${this.REST_URL}/blog/${page}`);
  }

  subscribe(mailId: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/subscribe/${mailId}`);
  }

  unsubscribe(mailId: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/unsubscribe/${mailId}`);
  }

  activateAccount(verifyToken: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/account/${verifyToken}`);
  }

  reverifyMailAccount(mailId: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/account/reverify/${mailId}`);
  }

  updateMailAccount(newMailId: string, oldMailId: string): Observable<any> {
    return this.sendRequest('PUT', `${this.REST_URL}/account/${newMailId}/${oldMailId}`);
  }

  private sendRequest(verb: string, url: string, body?: any, params?: any): Observable<any> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });

    return this.http.request(verb, url, {
      headers: headers,
      body: body,
      responseType: "json",
      params: new HttpParams({fromString: params})
    })
    .catch((error: Response) => Observable.throw(`Network Error: ${error.statusText} (${error.status})`));
  }
}
