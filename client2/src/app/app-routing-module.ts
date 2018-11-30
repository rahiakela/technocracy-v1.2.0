import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {QuestionComponent} from './question/question.component';
import {questionRoutes} from './question/question.module';
import {PageNotFoundComponent} from './page-not-found.component';
import {BlogComponent} from "./blog/blog.component";
import {blogRoutes} from "./blog/blog.module";
import {ProfileModule} from "./profile/profile.module";

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'blog', component: BlogComponent, children: blogRoutes },
  { path: 'question', component: QuestionComponent, children: questionRoutes },
  { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true})
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
