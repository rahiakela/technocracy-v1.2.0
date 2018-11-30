import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {BlogInfo} from '../../shared/model/blog-model';
import {BlogService} from "../blog.service";
import * as Redux from "redux";
import {AppStore} from "../../store/app.store";
import {AppState} from "../../store/app.reducer";
import {Observable} from "rxjs/Observable";

@Injectable()
export class BlogListResolver implements Resolve<BlogInfo> {

  constructor(@Inject(AppStore) private store: Redux.Store<AppState>,
              private blogService: BlogService) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<BlogInfo> {
    return this.blogService.showAllBlogs(route.params.currentUserId)
  }

}
