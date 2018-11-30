import {Component, Input, OnInit} from '@angular/core';
import {Blog} from '../../shared/model/blog-model';
import {User} from "../../shared/model/user-model";
import {UtilsService} from '../../shared/service/utils-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input()
  blog: Blog;
  currentUserId = ''

  constructor(private utilService: UtilsService,) { }

  ngOnInit() {
  }

  showSkillsHashTag(skills: string[]) {
    return skills.map(skill => '#' + skill);
  }

  getCurrentUser(): User {
    return this.utilService.getLoggedInUser();
  }

  getUserIcon(user: User): string {
    return this.utilService.getUserIcon(user);
  }
}
