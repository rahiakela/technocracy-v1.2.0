import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing-module';
import {CoreModule} from './core/core.module';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {QuestionModule} from './question/question.module';
import {PageNotFoundComponent} from "./page-not-found.component";
import {appStoreProviders} from './store/app.store';
import {Angular2SocialLoginModule} from 'angular2-social-login';
import {RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings} from 'ng-recaptcha';
import {SharedModule} from "./shared/shared.module";
import {BlogModule} from "./blog/blog.module";
import {NgxPaginationModule} from "ngx-pagination";

const globalSettings: RecaptchaSettings = { siteKey: '6LdMVz4UAAAAAClv3WheCRrgtoDyPUtFfGhikGu4' };

const providers = {
  'google': {
    'clientId': '937434695670-1l0r52i8dk1c4m39hg1fa93jbs3ebp3v.apps.googleusercontent.com'
  },
  'facebook': {
    // 'clientId': '481051235617450',
    'clientId': '156942918183512',
    'apiVersion': 'v2.8'
  },
  'linkedin': {
    'clientId': '81xmih7jo94hfi'
  }
};

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    NgxPaginationModule,
    Angular2SocialLoginModule,
    RecaptchaModule.forRoot(),
    AppRoutingModule,
    QuestionModule, // added this for our child module
    BlogModule      // added this for our child module
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  providers: [
    appStoreProviders,
    { provide: RECAPTCHA_SETTINGS, useValue: globalSettings },
    /*{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

Angular2SocialLoginModule.loadProvidersScripts(providers);

