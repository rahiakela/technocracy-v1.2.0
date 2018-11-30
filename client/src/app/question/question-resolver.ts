import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {QuestionInfo} from '../shared/model/question-model';
import {CoreService} from '../core/service/core.service';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Injectable()
export class QuestionResolver implements Resolve<QuestionInfo> {

  constructor(private coreService: CoreService) {

  }

  resolve(route: ActivatedRouteSnapshot): Observable<QuestionInfo> {
    return this.coreService.loadQuestion(route.params._id);
  }
}
