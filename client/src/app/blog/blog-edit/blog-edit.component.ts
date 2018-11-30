import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Blog, BlogInfo, BlogModel} from "../../shared/model/blog-model";
import {AppStore} from "../../store/app.store";
import {AppState} from "../../store/app.reducer";
import {Store} from "redux";
import {ActivatedRoute, Router} from "@angular/router";
import {CoreService} from "../../core/service/core.service";
import {Title} from "@angular/platform-browser";
import {UtilsService} from "../../shared/service/utils-service";
import {BlogService} from "../blog.service";
import * as BlogActions from "../../store/blog/blog.actions";
import {WriteBlogComponent} from "../write-blog/write-blog.component";

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css']
})
export class BlogEditComponent implements OnInit, AfterViewInit {

  blogModel: BlogModel = {};
  public blog: Blog;

  successMessage = ''; errorMessage = '';
  @ViewChild(WriteBlogComponent)
  private writeBlogComponent: WriteBlogComponent;

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private activeRoute: ActivatedRoute,
              private blogService: BlogService,
              private router: Router,
              private coreService: CoreService,
              private utilService: UtilsService,
              private titleService: Title) {
    // console.log('BlogEditComponent called...');
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      const blogId = params['_id'];
      const status = params['status'];

      this.blog = this.coreService.getBlog(blogId, status);
      if (this.blog !== undefined) {
        this.blogModel.blogId = this.blog._id;
        this.blogModel.title = this.blog.title;
        this.blogModel.content = this.utilService.decodeHTML(this.blog.content);
        this.blogModel.tag = this.getTags(this.blog.tags);
      }
    });

    this.clearErrorMessage();
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  blogKeyupHandler(value: any) {
    // this.question.content = this.utilService.encodeHtml(value);
    this.blog = {
      content: this.utilService.encodeHtml(value)
    };
  }

  public resolved(captchaResponse: string) {
    if (captchaResponse) {
      document.getElementById('re-captcha-post-blog').removeAttribute('disabled');
    }
  }

  editBlog(blogModel: BlogModel) {
    this.blog.title = blogModel.title;
    // converting tags string value to array string
    const tag: string = blogModel.tag;
    this.blog.tags = tag.split(',');

    this.blogService.editBlog(this.blog, this.blogModel.blogId, this.utilService.getLoggedInUser().profile._id)
      .filter((bInfo: BlogInfo) => bInfo.statusCode === 200)
      .subscribe((bInfo: BlogInfo) => {
        this.blog = bInfo.blog;
        // reset selected blog into store
        this.store.dispatch(BlogActions.resetSelectedBlog(bInfo.blog));
        // update blog list into store with updated one
        this.store.dispatch(BlogActions.updateBlogList(bInfo.blog));
        // setting page title
        this.setTitle(this.blog.title);
        this.successMessage = 'Your blog updated successfully.';
      });
  }

  postBlog(blogId: string) {
    // validate the required fields
    if (!this.blogModel.title || this.blogModel.title === '') {
      this.errorMessage = 'Please provide question title.';
      return false;
    }else if (!this.blogModel.content || this.blogModel.content === '') {
      this.errorMessage = 'Please provide question content.';
      return false;
    } else  {
      this.errorMessage = '';
    }

    this.successMessage = this.writeBlogComponent.submitBlog(this.blogModel, 'save');
  }

  clearErrorMessage(): void {
    // clear previous error message
    this.errorMessage = '';
  }

  getTags(skills: string[]): string {
    let str = '';
    skills.forEach(s => str +=s+',');
    return str;
  }

  ngAfterViewInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
