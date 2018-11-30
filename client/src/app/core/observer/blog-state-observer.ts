import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {BlogState} from "../../store/blog/blog.reducer";

@Injectable()
export class BlogStateObserver {

  private subject = new Subject<BlogState>();
  blogState = this.subject.asObservable();

  constructor() {}

  pushBlogState(state) {
    this.subject.next(state);
  }
}
