import {Component, Input, OnInit} from '@angular/core';
import {User} from '../model/user-model';
import {UtilsService} from '../service/utils-service';

@Component({
  selector: 'app-profile-icon',
  template: `
    <div id="profile-icon">
      <div id="profile-photo" *ngIf="getUserIcon(user) == ''; else authorProfilePhoto">
        <i class="fa fa-user-circle fa-4x" style="color: #f7f7f9;"></i>
      </div>
      <ng-template #authorProfilePhoto>
        <img class="img-circle" src="{{getUserIcon(user)}}" width="100" height="90">
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
export class ProfileIconComponent implements OnInit {

  @Input()
  user: User;

  constructor(private utilService: UtilsService) { }

  ngOnInit() {

  }

  getUserIcon(user: User): string {
    return this.utilService.getUserIcon(user);
  }
}
