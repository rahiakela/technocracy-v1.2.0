import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {HomeRoutingModule} from './home.routing.module';
import {HomeComponent} from './home.component';
import {HomeService} from './home.service';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {HomeRepository} from './home-repository';
import {SearchComponent} from './search/search.component';
import {SubscribeComponent} from './subscribe/subscribe.component';
import {UnsubscribeComponent} from './subscribe/unsubscribe.component';
import {AccountActivateComponent} from './account-activate/account-activate.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    InfiniteScrollModule,
    SharedModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
    SearchComponent,
    SubscribeComponent,
    UnsubscribeComponent,
    AccountActivateComponent
  ],
  exports: [
    HomeComponent,
    SearchComponent,
    SubscribeComponent,
    UnsubscribeComponent,
    AccountActivateComponent
  ],
  providers: [
    HomeService,
    HomeRepository
  ]
})
export class HomeModule {

}
