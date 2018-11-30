import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {Blog} from '../shared/model/blog-model';
import {DataChangeObserver} from "../core/observer/data-change-observer";
import {AppStore} from "../store/app.store";
import {AppState} from "../store/app.reducer";
import {Store} from "redux";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  blogList: Blog[] = new Array<Blog>();

  constructor(@Inject(AppStore) private store: Store<AppState>, private observer: DataChangeObserver) {
    /*this.observer.updatedData.subscribe(data => {
      this.blogList = data.blogs;
    })*/
  }

  loadMoreBlog(page: number) {
    // console.log('loadMoreBlog called...page:' + page);
  }

  onScrollDown() {
    // console.log('onScrollDown() called...');
  }

  onScrollUp() {
    // console.log('onScrollUp() called...');
  }

  ngOnInit() {
    this.observer.updatedData.subscribe(data => {
      this.blogList = data.blogs;
    });
    this.blogList = this.store.getState().blog.blogs;
  }

  showSkillsHashTag(skills: string[]) {
    return skills.map(skill => '#' + skill);
  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }
}
