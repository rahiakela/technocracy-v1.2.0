import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {BlogInfo} from '../../shared/model/blog-model';
import {CoreService} from '../../core/service/core.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BlogResolver implements Resolve<BlogInfo> {

  constructor(private coreService: CoreService) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<BlogInfo> {
    return this.coreService.loadBlog(route.params._id);
  }

}
