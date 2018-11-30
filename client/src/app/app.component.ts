import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Blog, BlogInfo} from './shared/model/blog-model';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {DataChangeObserver} from './core/observer/data-change-observer';
import {ShowHideModalObserver} from './core/observer/show-hide-modal-observer';
import {AppState} from './store/app.reducer';
import {AppStore} from './store/app.store';
import {CoreRepository} from './core/repository/core-repository';
import * as UserActions from './store/user/user.actions';
import * as BlogActions from './store/blog/blog.actions';
import * as QuestionActions from './store/question/question.actions';
import {Question, QuestionInfo} from './shared/model/question-model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthModalComponent} from './shared/modal/auth-modal.component';
import {AuthService} from 'angular2-social-login';
import {CoreService} from './core/service/core.service';
import {User, UserInfo} from './shared/model/user-model';
import {UserAuthObserver} from './core/observer/user-auth-observer';
import * as StaticsAction from './store/statistics/statistics.actions';
import {Statistics} from './shared/model/statistics';
import {UtilsService} from './shared/service/utils-service';
import {Store} from 'redux';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  results: any;
  loading: boolean;
  blogs: Blog[];
  questions: Question[];
  user: User;
  showLoginSignupDialog: boolean;
  private subscribtion: Subscription;

  statics: Statistics = {
    totalBlog: 0,
    totalQuestion: 0,
    totalPendingBlog: 0,
    totalPendingQuestion: 0,
    totalFollowers: 0,
    totalFollowing: 0
  };

  currentUser = ''; username = ''; errorMessage = '';

  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  loginForm: FormGroup; signupForm: FormGroup;
  loginEmail: FormControl; loginPassword: FormControl; email: FormControl; password: FormControl; userName: FormControl;

  @ViewChild(AuthModalComponent)
  private authComponent: AuthModalComponent;

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private coreRepository: CoreRepository,
              private coreService: CoreService,
              private utilService: UtilsService,
              private formBuilder: FormBuilder,
              public authService: AuthService,
              private router: Router,
              private userAuthObserver: UserAuthObserver,
              private dataChangeObserver: DataChangeObserver,
              private showHideModalObserver: ShowHideModalObserver) {
    // console.log(window.innerWidth);
  }

  search(results: BlogInfo): void {
    this.results = results;
    // console.log('search results:', this.results);
    this.dataChangeObserver.pushUpdatedData(this.results);

    this.router.navigate(['search']);
  }

  ngOnInit() {

    // fetch all blog
    this.coreRepository.getBlogs(0).subscribe(data => {
      const blogInfo: BlogInfo = data;
      if (blogInfo.statusCode === 200) {
        this.blogs = blogInfo.blogs;
        this.dataChangeObserver.pushUpdatedData(blogInfo);
        // set blog array into store
        this.store.dispatch(BlogActions.addBlogs(blogInfo.blogs));
      }
    });

    // fetch all question
    this.coreRepository.getQuestions(0).subscribe(data => {
      const questionInfo: QuestionInfo = data;
      if (questionInfo.statusCode === 200) {
        this.questions = questionInfo.questions;
        // set question array into store
        this.store.dispatch(QuestionActions.addQuestions(questionInfo.questions));
      }
    });

    // subscribe show hide login/signup observer
    this.subscribtion = this.showHideModalObserver.showHide.subscribe(data => {
      this.showLoginSignupDialog = data;
      if (this.showLoginSignupDialog) {
        this.authComponent.show();
      }
    });

    // get blog and question statistics
    setTimeout(() => {
      // get blog and question statistics based on user/profile id
      if (this.utilService.getLoggedInUser() !== null && this.utilService.getLoggedInUser().profile !== undefined) {
        this.getStatistics(this.utilService.getLoggedInUser()._id, this.utilService.getLoggedInUser().profile._id);
      }else if (this.utilService.getLoggedInUser() !== null) {
        this.getStatistics(this.utilService.getLoggedInUser()._id);
      }
    }, 3000);

    this.createLoginForm();
    this.createSignupForm();
  }

  signup(): boolean {

    if ((this.email === undefined && this.password === undefined && this.userName === undefined) || (this.email === undefined || this.password === undefined || this.userName === undefined)) {
      this.errorMessage = 'Email,Username and Password must be required.';
      return false;
    }

    // create user object from formControl
    const user = {
      'local': {
        'email': this.email.value,
        'password': this.password.value,
        'username': this.userName.value
      }
    };

    this.coreService.signup(user).subscribe(data => {
      // console.log('User Returned>>' + JSON.stringify(data));

      const userInfo = data;
      if (userInfo.statusCode === 200) {
        // hiding the login dialog by calling child component method
        this.authComponent.hide();
        this.router.navigate(['/activate-account'], {queryParams: {email: userInfo.user.local.email}});
      } else {
        this.errorMessage = userInfo.message;
        return false;
      }
    });
  }

  login(): boolean {

    if ((this.loginEmail === undefined && this.loginPassword === undefined) || (this.loginEmail === undefined || this.loginPassword === undefined)) {
      this.errorMessage = 'Email and Password must be required.';
      return false;
    }

    // create user object from formControl
    const user = {
      'local': {
        'email': this.loginEmail.value,
        'password': this.loginPassword.value
      }
    };

    this.coreService.login(user)
      .filter(userInfo => userInfo.statusCode === 200)
      .catch(userInfo => this.errorMessage = userInfo.message)
      .subscribe((userInfo: UserInfo) => {
        this.currentUser = userInfo.user.local.name;
        // set the current User
        this.store.dispatch(UserActions.setCurrentUser(userInfo.user));
        // set logged-in user to observer
        this.userAuthObserver.pushAuthUser(userInfo.user);
        // get blog and question statistics based on user/profile id
        if (userInfo.user.profile !== undefined) {
          this.getStatistics(userInfo.user._id, userInfo.user.profile._id);
        } else {
          this.getStatistics(userInfo.user._id);
        }
        // hiding the login dialog by calling child component method
        this.authComponent.hide();
      });

  }

  authenticate(provider: string) {
    this.authService.login(provider).subscribe(
      (data) => {
        // console.log('User Info>>' + JSON.stringify(data));

        if (provider === 'facebook') {
          this.user.facebook = data;
          // console.log('Facebook User Info>>' + this.user.facebook.email);
          this.coreService.saveProfile(this.user).subscribe(result => {
            // console.log('User Returned>>' + JSON.stringify(result));
            const userInfo = result;
            this.currentUser = userInfo.user.facebook.email;
            // set the current User
            this.store.dispatch(UserActions.setCurrentUser(userInfo.user));
            // set logged-in user to observer
            this.userAuthObserver.pushAuthUser(userInfo.user);
            // get blog and question statistics
            this.getStatistics(userInfo.user._id, userInfo.user.profile._id);
          });
        }

        if (provider === 'google') {
          this.user.google = data;
          // console.log('Google User Info>>' + this.user.google.email);
          this.coreService.saveProfile(this.user).subscribe(result => {
            // console.log('User Returned>>' + JSON.stringify(result));
            const userInfo = result;
            this.currentUser = userInfo.user.google.email;
            // set the current User
            this.store.dispatch(UserActions.setCurrentUser(userInfo.user));
            // set logged-in user to observer
            this.userAuthObserver.pushAuthUser(userInfo.user);
            // get blog and question statistics
            this.getStatistics(userInfo.user._id, userInfo.user.profile._id);
          });
        }

        if (provider === 'linkedin') {
          this.user.linkedin = data;
          // console.log('LinkedIn User Info>>' + this.user.linkedin.email);
          this.coreService.saveProfile(this.user).subscribe(result => {
            // console.log('User Returned>>' + JSON.stringify(result));
            const userInfo = result;
            this.currentUser = userInfo.user.linkedin.email;
            // set the current User
            this.store.dispatch(UserActions.setCurrentUser(userInfo.user));
            // set logged-in user to observer
            this.userAuthObserver.pushAuthUser(userInfo.user);
            // get blog and question statistics
            this.getStatistics(userInfo.user._id, userInfo.user.profile._id);
          });
        }

        // hiding the login/signup by calling child component method
        this.authComponent.hide();
      },
      error => {
        console.error(error);
      });
  }

  getStatistics(userId: string, profileId?: string) {
    this.coreService.getStatistics(userId, profileId)
      .subscribe(
        (statics: Statistics) => {
          this.statics = statics;
          // set statistics into store
          this.store.dispatch(StaticsAction.addStatistics(statics));
        },
        error => console.log('Server Error:' + error)
      );
  }

  public resolved(captchaResponse: string) {

    if (captchaResponse) {
      if (document.getElementById('re-captcha-signup') != null) {
        document.getElementById('re-captcha-signup').removeAttribute('disabled');
      }
      if (document.getElementById('re-captcha-comment') != null) {
        document.getElementById('re-captcha-comment').removeAttribute('disabled');
      }
    }
  }

  createLoginForm() {
    this.loginEmail = new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]);
    this.loginPassword = new FormControl('', [ Validators.required, Validators.minLength(8)]);
    this.loginForm = new FormGroup({
      loginEmail: this.loginEmail,
      loginPassword: this.loginPassword
    });
  }

  createSignupForm() {
    this.email = new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]);
    this.password = new FormControl('', [ Validators.required, Validators.minLength(8)]);
    this.userName = new FormControl('', [Validators.required, Validators.minLength(4)]);
    this.signupForm = new FormGroup({
      email: this.email,
      password: this.password,
      userName: this.userName
    });
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
