import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {AppState} from "../../store/app.reducer";
import {BlogService} from "../blog.service";
import {AppStore} from "../../store/app.store";
import {Blog, BlogInfo} from "../../shared/model/blog-model";
import * as moment from 'moment';
import * as BlogActions from "../../store/blog/blog.actions";
import {PaginationInstance} from "ngx-pagination";
import {UtilsService} from "../../shared/service/utils-service";
import * as StatisticsActions from "../../store/statistics/statistics.actions";
import {Store} from "redux";

@Component({
  selector: 'app-pending-blogs',
  templateUrl: './pending-blogs.component.html',
  styleUrls: ['./pending-blogs.component.css']
})
export class PendingBlogsComponent implements OnInit, AfterViewInit {

  blogs: Blog[];
  message = '';
  noDataMessage = '';

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private blogService: BlogService,
              private utilService: UtilsService) {

  }

  ngOnInit() {
    const pendingBlogList = this.store.getState().blog.pendingBlogList;
    if (pendingBlogList.length === 0) { // make sure pending blog list is already set or not
      this.blogService.getPendingBlogList()
        .filter((bInfo: BlogInfo) => bInfo.statusCode === 200)
        .subscribe(
          (bInfo: BlogInfo) => {
            this.blogs = bInfo.blogs;
            // set pending blog list into store
            if (this.blogs.length > 0) {
              this.store.dispatch(BlogActions.setPendingBlogList(bInfo.blogs));
            } else {
              this.noDataMessage = 'There is no pending blog available.';
            }
            this.hideLoading();
          },
          (error: any) => {
            console.log('Server Error:' + error);
            this.noDataMessage = 'There is no pending blog available.';
          }
        );
    } else {
      this.blogs = pendingBlogList;
      this.hideLoading();
    }
  }

  hideLoading() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }

  formatDate(submitDate: Date) {
    return moment(submitDate).format('LLL');
  }

  modifyBlog(blogId: string, status: string) {
    this.blogService.modifyBlog(blogId, status)
      .filter((bInfo: BlogInfo) => bInfo.statusCode === 200)
      .subscribe((bInfo: BlogInfo) => {
        this.store.dispatch(BlogActions.updatePendingBlogList(bInfo.blog));
        this.showMessage(status);
        // update statistics into store
        this.store.dispatch(StatisticsActions.updateStatistics(-1, 'totalPendingBlog')); //decrement total pending blog
      });
  }

  private showMessage(status: string) {
    switch (status) {
      case 'published':
        this.message = 'The question has been published.';
        break;
      case 'on_hold':
        this.message = 'The question has been put on hold.';
        break;
      case 'rejected':
        this.message = 'The question has been rejected.';
        break;
    }
  }

  public pagingConfig: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 5,
    currentPage: 1
  };

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
