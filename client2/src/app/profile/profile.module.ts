import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { PortfolioComponent } from './profile/portfolio/portfolio.component';
import {ProfileService} from "./service/profile.service";
import {ProfileRepository} from "./repository/profile.repository";
import { EmploymentComponent } from './profile/employment/employment.component';
import { ExperienceComponent } from './profile/experience/experience.component';
import { SkillsComponent } from './profile/skills/skills.component';
import { EducationComponent } from './profile/education/education.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule
  ],
  declarations: [ProfileComponent, PortfolioComponent, EmploymentComponent, ExperienceComponent, SkillsComponent, EducationComponent],
  providers: [
    ProfileService,
    ProfileRepository
  ]
})
export class ProfileModule { }
