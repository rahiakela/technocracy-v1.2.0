import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Blog, BlogInfo} from '../../shared/model/blog-model';
import {Subscription} from 'rxjs/Subscription';
import {DataChangeObserver} from '../../core/observer/data-change-observer';
import {User} from '../../shared/model/user-model';
import {UtilsService} from '../../shared/service/utils-service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  blogList: Blog[] = new Array<Blog>();
  private subscribtion: Subscription;

  constructor(private observer: DataChangeObserver, private utilService: UtilsService) {
    /*this.subscribtion = this.observer.updatedData.subscribe((blog: BlogInfo) => {
      this.blogList = blog.blogs;
      console.log('blogList:', this.blogList);
    });*/
  }

  ngOnInit() {
    this.subscribtion = this.observer.updatedData.subscribe((blog: BlogInfo) => {
      this.blogList = blog.blogs;
      console.log('blogList:', this.blogList);
    });

  }

  ngAfterViewInit() {
    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

  showSkillsHashTag(skills: string[]) {
    return skills.map(skill => '#' + skill);
  }

  getUserIcon(user: User): string {
    return this.utilService.getUserIcon(user);
  }

  onScrollDown() {
    console.log('onScrollDown() called...');
  }

  onScrollUp() {
    console.log('onScrollUp() called...');
  }
}
