import {Component, Input, OnInit} from '@angular/core';
import {User} from '../model/user-model';
import {UtilsService} from '../service/utils-service';

@Component({
  selector: 'app-comment-icon',
  template: `
    <div>
      <div id="profile-photo" *ngIf="getUserIcon(user) == ''; else authorProfilePhoto">
        <span class="rounded-circle" style="float: left;margin-left: 1.45rem;"><i class="fa fa-user-circle fa-3x" style="padding: 1px 0px 0px 7px;margin-left: -6px;"></i></span>
      </div>
      <ng-template #authorProfilePhoto>
        <span class="rounded-circle" style="float: left;margin-left: 1.45rem;"><img class="img-circle" src="{{getUserIcon(user)}}" width="60" height="50" style="padding: 1px 0px 0px 7px;margin-left: -6px;"></span>
      </ng-template>
    </div>
  `,
  styles: [`
    div#profile-icon {
      padding-bottom: 1em;
      margin-left: 0em;
      margin-top: 2rem;
    }
  `]
})
export class CommentIconComponent implements OnInit {

  @Input()
  user: User;

  constructor(private utilService: UtilsService) { }

  ngOnInit() {

  }

  getUserIcon(user: User): string {
    return this.utilService.getUserIcon(user);
  }
}
