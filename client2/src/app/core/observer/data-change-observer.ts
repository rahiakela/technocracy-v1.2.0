import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {BlogInfo} from '../../shared/model/blog-model';

// https://stackoverflow.com/questions/41124292/angular2-way-to-update-data-in-nested-component-from-parent-component
@Injectable()
export class DataChangeObserver {

  private subject = new Subject<BlogInfo>();
  updatedData = this.subject.asObservable();

  constructor() {}

  pushUpdatedData(data) {
    this.subject.next(data);
  }

}
