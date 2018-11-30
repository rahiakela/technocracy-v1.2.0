import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Blog, BlogInfo} from '../shared/model/blog-model';
import {Comment, Reply} from '../shared/model/comment-model';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {AppState} from "../store/app.reducer";
import {AppStore} from "../store/app.store";
import {Store} from "redux";

@Injectable()
export class BlogRepository {

  REST_URL = environment.REST_URL;

  constructor(private http: HttpClient, @Inject(AppStore) private store: Store<AppState>) {

  }

  search(query: string): Observable<Blog[]> {
    return this.sendRequest('GET', `${this.REST_URL}/blog/search/${query}`);
  }

  showAllBlogs(writtenBy: string): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/blog/all/${writtenBy}`);
  }

  postBlog(blog: Blog, profileId: string, actionType: string): Observable<BlogInfo> {
    return this.sendRequest('POST', `${this.REST_URL}/blog/${profileId}/${actionType}`, blog);
  }

  modifyBlog(blogId: string, actionType: string): Observable<BlogInfo> {
    return this.sendRequest('PUT', `${this.REST_URL}/blog/${blogId}/${actionType}`, '');
  }

  editBlog(blog: Blog, blogId: string, profileId: string): Observable<BlogInfo> {
    return this.sendRequest('PUT', `${this.REST_URL}/blog/${blogId}`, blog);
  }

  deleteBlog(blogId: string): Observable<any> {
    return this.sendRequest('DELETE', `${this.REST_URL}/blog/${blogId}`, '');
  }

  getPendingBlogList(): Observable<any> {
    return this.sendRequest('GET', `${this.REST_URL}/blog/list/pending`);
  }

  like(blogId: string, userId: string): Observable<Blog> {
    return this.sendRequest('GET', `${this.REST_URL}/${blogId}/like/${userId}`);
  }

  addComment(blogId: string, userId: string, comment: Comment): Observable<BlogInfo> {
    return this.sendRequest('POST', `${this.REST_URL}/comment/${userId}/${blogId}`, comment);
  }

  editCommentReply(actionType: string, questionId: string, commentReply: any): Observable<BlogInfo> {
    return this.sendRequest('PUT', `${this.REST_URL}/blog/comment/${questionId}/${actionType}`, commentReply);
  }

  deleteComment(questionId: string, commentId: string): Observable<any> {
    return this.sendRequest('DELETE', `${this.REST_URL}/blog/comment/${questionId}/${commentId}`, '');
  }

  deleteReply(questionId: string, replyId: string): Observable<any> {
    return this.sendRequest('DELETE', `${this.REST_URL}/blog/comment/reply/${questionId}/${replyId}`, '');
  }

  likeComment(blogId: string, userId: string, commentId: string): Observable<Blog> {
    return this.sendRequest('GET', `${this.REST_URL}/comment/${userId}/${blogId}/like/${commentId}`, '', 'operation=blog');
  }

  likeReply(blogId: string, userId: string, commentId: string, replyId: string): Observable<Blog> {
    return this.sendRequest('GET', `${this.REST_URL}/reply/${userId}/${blogId}/${commentId}/like/${replyId}`, '', 'operation=blog');
  }

  reply(blogId: string, userId: string, commentId: string, reply: Reply): Observable<BlogInfo> {
    return this.sendRequest('POST', `${this.REST_URL}/reply/${userId}/${blogId}/${commentId}`, reply, 'operation=blog');
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
