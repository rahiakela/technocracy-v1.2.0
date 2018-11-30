import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {SubscribeComponent} from './subscribe/subscribe.component';
import {UnsubscribeComponent} from './subscribe/unsubscribe.component';
import {SearchComponent} from './search/search.component';
import {AccountActivateComponent} from './account-activate/account-activate.component';

const homeRoutes = [
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'subscribe', component: SubscribeComponent },
  { path: 'unsubscribe', component: UnsubscribeComponent },
  { path: 'activate-account', component: AccountActivateComponent },
  { path: 'activate-account/:verify-token', component: AccountActivateComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class HomeRoutingModule {

}
