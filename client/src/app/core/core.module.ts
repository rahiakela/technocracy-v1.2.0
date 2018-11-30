import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CoreService} from './service/core.service';
import {HeaderComponent} from './header/header.component';
import {LeftSidebarComponent} from './sidebar/left-sidebar/left-sidebar.component';
import {AdvertiseComponent} from './advertise/advertise.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {RightSidebarComponent} from './sidebar/right-sidebar/right-sidebar.component';
import {CoreRepository} from './repository/core-repository';
import {HomeModule} from '../home/home.module';
import {OBSERVERS} from "./observer";
import {HttpModule} from "@angular/http";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpModule,
    HttpClientModule,
    InfiniteScrollModule,
    SharedModule,
    HomeModule
  ],
  declarations: [
    HeaderComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    AdvertiseComponent
  ],
  exports: [
    HeaderComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    AdvertiseComponent
  ],
  providers: [
    ...OBSERVERS,
    CoreService,
    CoreRepository
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
