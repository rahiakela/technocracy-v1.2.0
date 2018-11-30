import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {BlogComponent} from './blog.component';
import {ProfileComponent} from './profile/profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BlogService} from './blog.service';
import {RECAPTCHA_SETTINGS, RecaptchaModule, RecaptchaSettings} from 'ng-recaptcha';
import {BlogRepository} from './blog-repository';
import {BlogResolver} from './resolver/blog-resolver';
import { BlogViewComponent } from './blog-view/blog-view.component';
import {RouterModule, Routes} from "@angular/router";
import { DraftPendingPublishedBlogViewComponent } from './d-p-p-blog-view/draft-pending-published-blog-view.component';
import { WriteBlogComponent } from './write-blog/write-blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { PendingBlogsComponent } from './pending-blogs/pending-blogs.component';
import { PendingBlogViewComponent } from './pending-blog-view/pending-blog-view.component';
import {BlogListResolver} from "./resolver/blog-list-resolver";
import {NgxPaginationModule} from "ngx-pagination";

const globalSettings: RecaptchaSettings = { siteKey: '6LdMVz4UAAAAAClv3WheCRrgtoDyPUtFfGhikGu4' };

export const blogRoutes: Routes = [
  // blog solo route( /blog >> blog/:_id )
  { path: '', redirectTo: ':_id', pathMatch: 'full' },
  { path: ':_id', component: BlogViewComponent, resolve: { blog: BlogResolver} },

  // blog write route( /blog/write/new)
  { path: 'write/new', component: WriteBlogComponent },

  // blog operation route( /blog/b_show/userProfileId)
  { path: 'b_show/:userProfileId', component: BlogListComponent },

  // blog dpp route( /blog/b_show/<draft or pending & published>/_id >> blog/d_p_p_view/:_id)
  { path: 'b_show/:status/:_id', redirectTo: 'd_p_p_view/:_id', pathMatch: 'full' },
  { path: 'd_p_p_view/:_id', component: DraftPendingPublishedBlogViewComponent },

  // blog dpp route( /blog/d_p_p_view/_id/_id/status >> blog/d_p_p_edit/_id/status)
  { path: 'd_p_p_view/:_id/:_id/:status', redirectTo: 'd_p_p_edit/:_id/:status', pathMatch: 'full' },

  // blog dpp route( /blog/b_show/draft or pending & published/_id/draft or pending & published >> blog/d_p_p_edit/:_id/:status)
  { path: 'b_show/:status/:_id/:status', redirectTo: 'd_p_p_edit/:_id/:status', pathMatch: 'full' },
  { path: 'd_p_p_edit/:_id/:status', component: BlogEditComponent },

  // show all pending blog route( /blog/show/all/pending)
  { path: 'show/all/pending', component: PendingBlogsComponent },

  // pending blog solo view route( /blog/show/all/pending/:_id >> blog/p_b_view/:_id)
  { path: 'show/all/pending/:_id', redirectTo: 'p_b_view/:_id', pathMatch: 'full' },
  { path: 'p_b_view/:_id', component: PendingBlogViewComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RecaptchaModule.forRoot(),
    NgxPaginationModule,
    RouterModule
  ],
  declarations: [
    BlogComponent,
    ProfileComponent,
    BlogViewComponent,
    DraftPendingPublishedBlogViewComponent,
    WriteBlogComponent,
    BlogListComponent,
    BlogEditComponent,
    PendingBlogsComponent,
    PendingBlogViewComponent
  ],
  exports: [

  ],
  providers: [
    BlogService,
    BlogRepository,
    BlogResolver,
    BlogListResolver,
    { provide: RECAPTCHA_SETTINGS, useValue: globalSettings }
  ]
})
export class BlogModule {
  constructor() {}
}
