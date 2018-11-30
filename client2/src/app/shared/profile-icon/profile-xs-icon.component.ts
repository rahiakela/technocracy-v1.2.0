import {Component, Input, OnInit} from '@angular/core';
import {User} from '../model/user-model';
import {UtilsService} from '../service/utils-service';

@Component({
  selector: 'app-profile-xs-icon',
  template: `
    <div>
      <div *ngIf="getUserIcon(user) == ''; else profilePhoto">
        <i class="fa fa-user fa-2x"></i>
      </div>
      <ng-template #profilePhoto>
        <img class="img-circle" src="{{getUserIcon(user)}}" width="35" height="28">
      </ng-template>
    </div>
  `,
  styles: [`
    div#tech-inline-xs-icon-box{
      padding: 0;
    }
  `]
})
export class ProfileXSIconComponent implements OnInit {

  @Input()
  user: User;

  constructor(private utilService: UtilsService) { }

  ngOnInit() {

  }

  getUserIcon(user: User): string {
    return this.utilService.getUserIcon(user);
  }
}
