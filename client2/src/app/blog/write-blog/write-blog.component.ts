import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {Blog, BlogInfo, BlogModel} from "../../shared/model/blog-model";
import {AppStore} from "../../store/app.store";
import {AppState} from "../../store/app.reducer";
import {BlogService} from "../blog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UtilsService} from "../../shared/service/utils-service";
import {Title} from "@angular/platform-browser";
import * as BlogActions from "../../store/blog/blog.actions";
import * as StatisticsActions from "../../store/statistics/statistics.actions";
import {Store} from "redux";

@Component({
  selector: 'app-write-blog',
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.css']
})
export class WriteBlogComponent implements OnInit, AfterViewInit {

  blogModel: BlogModel = {};
  blog: Blog = {};
  blogInfo: BlogInfo;

  errorMessage = '';
  successMessage = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private blogService: BlogService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private utilService: UtilsService,
              private titleService: Title) {

  }

  ngOnInit() {
    this.clearErrorMessage();
  }

  postBlog(blogModel: BlogModel): boolean {
    // validate the required fields
    if (!this.blogModel.title || this.blogModel.title === '') {
      this.errorMessage = 'Please provide blog title.';
      return false;
    }else if (!this.blog.content || this.blog.content === '') {
      this.errorMessage = 'Please provide blog content.';
      return false;
    } else  {
      this.errorMessage = '';
    }

    this.submitBlog(blogModel, 'save');
  }

  draftBlog(blogModel: BlogModel): boolean {
    console.log("Data:", JSON.stringify(blogModel));
    // validate the required fields
    if (!this.blogModel.title || this.blogModel.title === '') {
      this.errorMessage = 'Please provide blog title.';
      return false;
    }else if (!this.blog.content || this.blog.content === '') {
      this.errorMessage = 'Please provide blog content.';
      return false;
    } else  {
      this.errorMessage = '';
    }

    this.submitBlog(blogModel, 'draft');
  }

  public submitBlog(blogModel: BlogModel, actionType: string): string {

    this.blog.title = blogModel.title;
    if (this.blogModel.tag) {
      // converting tags string value to array string
      const tag: string = blogModel.tag;
      this.blog.tags = tag.split(',');
    }

    // post blog to mongodb
    this.blogService.postBlog(this.blog, this.utilService.getLoggedInUser().profile._id, actionType)
      .filter((blogInfo: BlogInfo) => blogInfo.statusCode === 200)
      .subscribe(
        (blogInfo: BlogInfo) => {
          this.blog = blogInfo.blog;
          // setting page title
          this.setTitle(this.blog.title);
          // update blog list into store with updated one
          this.store.dispatch(BlogActions.updateBlogList(blogInfo.blog));
          if (actionType === 'save') {
            // update statistics into store
            this.store.dispatch(StatisticsActions.updateStatistics(1, 'totalBlog')); //increment total blog
            if (blogInfo.blog.profile.user._id === this.utilService.getLoggedInUser()._id) {
              this.store.dispatch(StatisticsActions.updateStatistics(1, 'totalPendingBlog')); //increment total pending blog
            }
            this.successMessage = 'Your blog has been posted and send to the editor for approval.';
          } else {
            this.successMessage = 'Your blog has been saved as draft for further modification.';
          }
        },
        error => {
          console.log('Server Error:' + error);
          this.errorMessage = error;
        }
      );
    return this.successMessage.length > 0 ? this.successMessage : this.errorMessage;
  }

  discardBlog(blogModel: BlogModel) {
    this.blogModel.title = '';
    this.blogModel.content = '';
    this.blogModel.tag = '';
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  questionKeyupHandler(value: any) {
    // console.log('Question content:' + value);
    this.blog.content = this.utilService.encodeHtml(value);
  }

  public resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response ${captchaResponse}:`);
    if (captchaResponse) {
      document.getElementById('re-captcha-post-blog').removeAttribute('disabled');
      document.getElementById('re-captcha-draft-blog').removeAttribute('disabled');
      document.getElementById('re-captcha-discard-blog').removeAttribute('disabled');
    }
  }

  clearErrorMessage(): void {
    // clear previous error message
    this.errorMessage = '';
  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
