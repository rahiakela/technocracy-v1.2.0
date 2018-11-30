import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Blog, BlogInfo} from "../../shared/model/blog-model";
import {ConfirmModalComponent} from "../../shared/modal/confirm-modal.component";
import {AppStore} from "../../store/app.store";
import {Store} from "redux";
import {AppState} from "../../store/app.reducer";
import * as BlogActions from "../../store/blog/blog.actions";
import {BlogService} from "../blog.service";
import * as moment from 'moment';
import {WriteBlogComponent} from "../write-blog/write-blog.component";
import {UtilsService} from "../../shared/service/utils-service";
import {PaginationInstance} from "ngx-pagination";
import * as StatisticsActions from "../../store/statistics/statistics.actions";

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, AfterViewInit {

  status: string;
  filteredBlog: Blog[];
  currentBlogId: string;

  @ViewChild(ConfirmModalComponent)
  private confirmModalComponent: ConfirmModalComponent;
  @ViewChild(WriteBlogComponent)
  private writeBlogComponent: WriteBlogComponent;

  errorMessage = '';
  successMessage = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private blogService: BlogService,
              private utilService: UtilsService,
              private activeRoute: ActivatedRoute) {
    // console.log('BlogListComponent is called...');

    // set default status
    this.status = 'published';

  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      const userProfileId = params['userProfileId'];

      const blogList = this.store.getState().blog.blogList;
      if (blogList.length === 0) { // make sure blog list is already set or not
        this.blogService.showAllBlogs(userProfileId)
          .filter((bInfo: BlogInfo) => bInfo.statusCode === 200)
          .subscribe(
            (bInfo: BlogInfo) => {
              // set blog list into store
              this.store.dispatch(BlogActions.setBlogList(bInfo.blogs));
              // filter question list into store based on default status 'published'
              this.getFilteredBlog(this.status);
            },
            error => console.log('Server Error: ', error)
          );
      } else {
        // filter blog list into store based on default status 'published'
        this.getFilteredBlog(this.status);
      }
    });
  }

  filterBlog(blogStatus: string) {
    this.status = blogStatus;
    // filter question list into store based on status
    this.getFilteredBlog(this.status);
  }

  getFilteredBlog(blogStatus: string) {
    // filter question list into store based on status
    this.store.dispatch(BlogActions.searchBlog(this.status));
    // get filtered blog from store
    const filteredBlog = this.store.getState().blog.filteredBlog;
    if (filteredBlog !== undefined && filteredBlog.length > 0) {
      this.filteredBlog = filteredBlog;
      this.errorMessage = ''; // clear previous error message
    } else {
      this.filteredBlog = []; // clear previous value if the filteredBlog is zero
      this.errorMessage = `There is no ${this.status} blog available.`;
    }
  }

  modifyBlog(blog: Blog) {
    // post blog to mongodb
    this.blogService.modifyBlog(blog._id, 'pending')
      .filter((bInfo: BlogInfo) => bInfo.statusCode === 200)
      .subscribe(
        (bInfo: BlogInfo) => {
          // update blog list into store with updated one
          this.store.dispatch(BlogActions.updateBlogList(bInfo.blog));
          // update statistics into store
          if (bInfo.blog.profile.user._id === this.utilService.getLoggedInUser()._id) {
            this.store.dispatch(StatisticsActions.updateStatistics(1, 'totalPendingBlog')); // increment total pending blog
          }
          this.successMessage = 'Your blog has been posted and send to the editor for approval.'
        },
        error => {
          console.log('Server Error:' + error);
          this.errorMessage = error;
        }
      );
  }

  deleteBlog() {

    // delete blog to mongodb
    this.blogService.deleteBlog(this.currentBlogId)
      .filter((bInfo: BlogInfo) => bInfo.statusCode === 200)
      .subscribe(
        (bInfo: BlogInfo) => {
          // update question list into store with updated one
          this.store.dispatch(BlogActions.updateBlogList(bInfo.blog));
          // hide the confirm dialog box
          this.confirmModalComponent.hide();
        },
        error => console.log('Error:' + error)
      );
  }

  public pagingConfig: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1
  };

  ngAfterViewInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }

  formatDate(submitDate: Date) {
    return moment(submitDate).format('MM/DD/YYYY');
  }

  setCurrentBlog(blogId: string) {
    this.currentBlogId = blogId;
  }
}
