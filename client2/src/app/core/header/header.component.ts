import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Blog, BlogInfo} from '../../shared/model/blog-model';
import {User, UserInfo} from '../../shared/model/user-model';
import {CoreService} from '../service/core.service';
import {UtilsService} from '../../shared/service/utils-service';
import {ShowHideModalObserver} from '../observer/show-hide-modal-observer';
import {environment} from "../../../environments/environment";
import {AppStore} from '../../store/app.store';
import {AppState} from '../../store/app.reducer';
import * as UserActions from '../../store/user/user.actions';
import * as BlogActions from '../../store/blog/blog.actions';
import * as QuestionActions from '../../store/question/question.actions';
import * as StatisticsActions from '../../store/statistics/statistics.actions';

// By importing just the rxjs operators we need, We're theoretically able
// to reduce our build size vs. importing all of them.
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switch';
import {Router} from "@angular/router";
import {UserAuthObserver} from "../observer/user-auth-observer";
import {Subscription} from "rxjs/Subscription";
import {Statistics} from "../../shared/model/statistics";
import {Store} from "redux";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck, OnDestroy {

  @Input()
  blogList: Blog[] = new Array<Blog>();
  @Output()
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  results: EventEmitter<BlogInfo> = new EventEmitter<BlogInfo>();

  currentUser: User = {role: 'user'};
  CLOUD_IMAGE_PATH = environment.CLOUD_IMAGE_PATH;
  user: User;

  @Input()
  statics: Statistics = {
    totalBlog: 0,
    totalQuestion: 0,
    totalPendingBlog: 0,
    totalPendingQuestion: 0,
    totalFollowers: 0,
    totalFollowing: 0
  };

  private subscribtion: Subscription;

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private utilService: UtilsService,
              private coreService: CoreService,
              public showHideModalObserver: ShowHideModalObserver,
              private userAuthObserver: UserAuthObserver,
              private router: Router,
              private element: ElementRef) {

    this.store.subscribe(() => {
      this.user = this.store.getState().user.currentUser;
    });
  }

  ngOnInit(): void {

    // convert the `keyup` event into an observable stream
    Observable.fromEvent(this.element.nativeElement, 'keyup')
      .map((e: any) => e.target.value)            // extract the value of the input
      .filter((text: string) => text.length > 3)  // filter out if empty
      .debounceTime(250)                          // only once every 250ms
      .do(() => this.loading.next(true))    // enable loading
      .map((query: string) => this.coreService.search(query)) // search, discarding old events if new input comes in
      .switch()
      .subscribe(                                 // act on the return of the search
        (results: any) => {             // on sucesss
          this.loading.next(false);
          this.results.next(results);
        },
        (err: any) => {                     // on error
          console.log(err);
          this.loading.next(false);
        },
        () => {                          // on completion
          this.loading.next(false);
        }
      );

    // subscribe user Auth Observer: it is called on login
    this.subscribtion = this.userAuthObserver.authUser.subscribe(user => this.currentUser = user);
  }

  ngDoCheck() {
    // fetch already logged-in user from store: it is called on page load
    this.currentUser = this.utilService.getLoggedInUser();
  }

  ngOnDestroy() {
    this.results = null;
    // console.log('search results:', this.results);
    // capture the `click` event
    Observable.fromEvent(this.element.nativeElement, 'click')
      .subscribe((event: any) => {
        console.log('target event:', event.target.value);
      });
  }

  showSignup() {
    this.showHideModalObserver.pushShowHide(true);
  }

  getCurrentUser(): string {
    return this.user != null ? this.user._id : '';
  }

  getLoggedInUser(): User {
    return this.utilService.getLoggedInUser();
  }

  signout() {
    // remove the current User from the store
    this.store.dispatch(UserActions.removeCurrentUser({}));
    // update blog state into the store
    this.store.dispatch(BlogActions.updateBlogState());
    //update question state into the store
    this.store.dispatch(QuestionActions.updateQuestionState());
    //update statistics state into the store
    this.store.dispatch(StatisticsActions.updateStatisticsState());
    // send user to home page
    this.router.navigate(['/home']);
  }

}
