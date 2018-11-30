import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UserInfo} from '../shared/model/user-model';
import {Blog} from '../shared/model/blog-model';
import {HomeRepository} from './home-repository';
import {CoreRepository} from '../core/repository/core-repository';

@Injectable()
export class HomeService {

  userInfo: Observable<UserInfo> = new Observable<UserInfo>();

  constructor(private coreRepository: CoreRepository, private homeRepository: HomeRepository) {

  }

  subscribe(mailId: string): Observable<any> {
    return this.homeRepository.subscribe(mailId);
  }

  unsubscribe(mailId: string): Observable<any> {
    return this.homeRepository.unsubscribe(mailId);
  }

  activateAccount(verifyToken: string): Observable<any> {
    return this.homeRepository.activateAccount(verifyToken);
  }

  reverifyMailAccount(mailId: string): Observable<any> {
    return this.homeRepository.reverifyMailAccount(mailId);
  }

  updateMailAccount(newMailId: string, oldMailId: string): Observable<any> {
    return this.homeRepository.updateMailAccount(newMailId, oldMailId);
  }

  search(query: string): Observable<Blog[]> {
    return this.coreRepository.search(query);
  }
}
