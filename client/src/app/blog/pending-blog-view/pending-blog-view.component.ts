import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {Blog, BlogInfo} from "../../shared/model/blog-model";
import {UtilsService} from "../../shared/service/utils-service";
import {ActivatedRoute, Router} from "@angular/router";
import {CoreService} from "../../core/service/core.service";
import {Title} from "@angular/platform-browser";
import {AppState} from "../../store/app.reducer";
import {AppStore} from "../../store/app.store";
import * as BlogActions from "../../store/blog/blog.actions";
import {BlogService} from "../blog.service";
import * as StatisticsActions from "../../store/statistics/statistics.actions";
import {Store} from "redux";

@Component({
  selector: 'app-pending-blog-view',
  templateUrl: './pending-blog-view.component.html',
  styleUrls: ['./pending-blog-view.component.css']
})
export class PendingBlogViewComponent implements OnInit, AfterViewInit {

  blog: Blog;
  successMessage = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private coreService: CoreService,
              private blogService: BlogService,
              private utilService: UtilsService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private titleService: Title) {
    // console.log('BlogViewComponent is called...');
    this.activeRoute.params.subscribe(params => {
      const blogId = params['_id'];
      this.blog = this.coreService.getBlog(blogId, 'p_b_view');
    });
  }

  ngOnInit() {
    // set window title
    this.setTitle(this.blog.title);
    // set current blog for image upload etc
    this.utilService.setCurrentBlog(this.blog);
  }

  modifyBlog(blogId: string, status: string) {
    this.blogService.modifyBlog(blogId, status)
      .filter((bInfo: BlogInfo) => bInfo.statusCode === 200)
      .subscribe((bInfo: BlogInfo) => {
        this.store.dispatch(BlogActions.updatePendingBlogList(bInfo.blog));
        this.successMessage = 'The question has been published successfully.';
        // update statistics into store
        this.store.dispatch(StatisticsActions.updateStatistics(-1, 'totalPendingBlog')); //decrement total pending blog
      });
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  showSkillsHashTag(skills: string[]): string[] {
    return this.utilService.showSkillsHashTag(skills);
  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
