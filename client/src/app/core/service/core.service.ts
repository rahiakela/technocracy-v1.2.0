import {Inject, Injectable} from '@angular/core';
import {User, UserInfo} from '../../shared/model/user-model';
import {Blog, BlogInfo} from '../../shared/model/blog-model';
import {Observable} from 'rxjs/Observable';
import {Question, QuestionInfo} from '../../shared/model/question-model';
import {CoreRepository} from '../repository/core-repository';
import {AppStore} from '../../store/app.store';
import {AppState} from '../../store/app.reducer';
import * as BlogActions from "../../store/blog/blog.actions";
import * as QuestionActions from "../../store/question/question.actions";
import {ProfileInfo} from "../../shared/model/profile-model";
import {Statistics} from "../../shared/model/statistics";
import {Store} from "redux";

@Injectable()
export class CoreService {

  currentUser: UserInfo;

  userInfo: Observable<UserInfo> = new Observable<UserInfo>();

  blogList: Blog[] = new Array<Blog>();
  blog: Blog;

  // function currying
  private questionLocator= (q: Question, _id: string) => q._id === _id;

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private coreRepository: CoreRepository) {
  }

  getBlogs(page: number): Blog[] {
    return this.store.getState().blog.blogs;
  }

  getBlog(blogId: string, setFor?: string): Blog {
    // filter blog from store with blog id
    this.store.dispatch(BlogActions.setSelectedBlog(blogId, setFor));
    const blog = this.store.getState().blog.selectedBlog;

    return blog;
  }

  getQuestions(page: number): Question[] {
    return this.store.getState().question.questions;
  }

  getQuestion(questionId: string, setFor?: string): Question {
    // filter blog from store with blog id
    this.store.dispatch(QuestionActions.setSelectedQuestion(questionId, setFor));
    const question = this.store.getState().question.selectedQuestion;
    return question;
  }

  getStatistics(userId: string, profileId?: string): Observable<Statistics> {
    return this.coreRepository.getStatistics(userId, profileId);
  }

  loadBlog(blogId: string): Observable<BlogInfo> {
    return this.coreRepository.loadBlog(blogId);
  }

  loadQuestion(questionId: string): Observable<QuestionInfo> {
    return this.coreRepository.loadQuestion(questionId);
  }

  signup(user: User): Observable<UserInfo> {
    return this.coreRepository.signup(user);
  }

  login(user: User): Observable<UserInfo> {
    return this.coreRepository.login(user);
  }

  saveProfile(userModel: User): Observable<UserInfo> {
    return this.coreRepository.saveProfile(userModel);
  }

  search(query: string): Observable<Blog[]> {
    return this.coreRepository.search(query);
  }

  getProfile(userId: string): Observable<ProfileInfo> {
    return this.coreRepository.getProfile(userId);
  }
}
