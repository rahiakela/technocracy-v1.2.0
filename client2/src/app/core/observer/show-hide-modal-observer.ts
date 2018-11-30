import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';

@Injectable()
export class ShowHideModalObserver {

  private subject = new Subject<boolean>();
  showHide = this.subject.asObservable();

  constructor() {}

  pushShowHide(data) {
    this.subject.next(data);
  }

}
