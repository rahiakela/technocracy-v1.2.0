import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Blog, BlogInfo} from "../../shared/model/blog-model";
import {AppStore} from "../../store/app.store";
import {AppState} from "../../store/app.reducer";
import {CoreService} from "../../core/service/core.service";
import {UtilsService} from "../../shared/service/utils-service";
import {Title} from "@angular/platform-browser";
import {User} from "../../shared/model/user-model";
import * as BlogActions from "../../store/blog/blog.actions";
import {BlogService} from "../blog.service";
import * as StatisticsActions from "../../store/statistics/statistics.actions";
import {Store} from "redux";

@Component({
  selector: 'app-d-p-p-blog-view',
  templateUrl: './draft-pending-published-blog-view.component.html',
  styleUrls: ['./draft-pending-published-blog-view.component.css']
})
export class DraftPendingPublishedBlogViewComponent implements OnInit, AfterViewInit {

  blog: Blog;
  currentUser: User = {role: 'user'};
  message = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private blogService: BlogService,
              private coreService: CoreService,
              private utilService: UtilsService,
              private activeRoute: ActivatedRoute,
              private titleService: Title) {
    // console.log('BlogViewComponent is called...');
    this.activeRoute.params.subscribe(params => {
      const blogId = params['_id'];
      this.blog = this.coreService.getBlog(blogId, 'dpp_view');
    });
  }

  ngOnInit() {
    this.currentUser = this.utilService.getLoggedInUser();

    // set title
    this.setTitle(this.blog.title);
    // set current blog for image upload etc
    this.utilService.setCurrentBlog(this.blog);
  }

  modifyBlog(blogId: string) {
    // post blog to mongodb
    this.blogService.modifyBlog(blogId, 'pending')
      .filter((bInfo: BlogInfo) => bInfo.statusCode === 200)
      .subscribe(
        (bInfo: BlogInfo) => {
          // update blog list into store with updated one
          this.store.dispatch(BlogActions.updateBlogList(bInfo.blog));
          // update statistics into store
          if (bInfo.blog.profile.user._id === this.utilService.getLoggedInUser()._id) {
            this.store.dispatch(StatisticsActions.updateStatistics(1, 'totalPendingBlog')); //increment total pending blog
          }
          this.message = 'Your blog has been posted and send to the editor for approval.';
        },
        error => {
          console.log('Server Error:' + error);
          this.message = error;
        }
      );
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  getCurrentUser(): string {
    return this.utilService.getCurrentUser();
  }

  getCurrentUserId(user: User): string {
    return user != null ? user._id : '';
  }

  getUserName(user: User): string {
    if (user != null) {
      return this.utilService.getUserName(user);
    }

    return '';
  }

  showSkillsHashTag(skills: string[]): string[] {
    return this.utilService.showSkillsHashTag(skills);
  }

  getTags(skills: string[]): string {
    let str = '';
    skills.forEach(s => str +=s+',');
    return str;
  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
