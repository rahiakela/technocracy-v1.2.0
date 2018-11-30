import {Component, Input, OnInit} from '@angular/core';
import {User} from '../model/user-model';
import {UtilsService} from '../service/utils-service';

@Component({
  selector: 'app-profile-small-icon',
  template: `
    <div id="tech-inline-small-icon-box">
      <div *ngIf="getUserIcon(user) == ''; else authorProfilePhoto">
        <i class="fa fa-user-circle fa-3x"></i>
      </div>
      <ng-template #authorProfilePhoto>
        <img class="img-circle" src="{{getUserIcon(user)}}" width="60" height="50">
      </ng-template>
    </div>
  `,
  styles: [`
    div#tech-inline-small-icon-box{
      padding-bottom: 1em;
      margin-left: 0em;
      margin-top: 1rem;
    }
  `]
})
export class ProfileSmallIconComponent implements OnInit {

  @Input()
  user: User;

  constructor(private utilService: UtilsService) { }

  ngOnInit() {

  }

  getUserIcon(user: User): string {
    return this.utilService.getUserIcon(user);
  }
}
