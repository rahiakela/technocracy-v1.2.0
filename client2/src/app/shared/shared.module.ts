import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TinymceEditorComponent} from './tinymce-editor/tinymce-editor.component';
import {ShareComponent} from './share/share.component';
import {SafeHtmlPipe} from './pipe/html-sanitizer';
import {AuthModalComponent} from './modal/auth-modal.component';
import {EditorModalComponent} from './modal/editor-modal.component';
import { ConfirmModalComponent } from './modal/confirm-modal.component';
import {FromNowPipe} from './pipe/from-now.pipe';
import { ProfileIconComponent } from './profile-icon/profile-icon.component';
import {ProfileSmallIconComponent} from './profile-icon/profile-small-icon.component';
import {CommentIconComponent} from "./profile-icon/comment-icon.component";
import {ReplyIconComponent} from "./profile-icon/reply-icon.component";
import {FileUploadService} from "./service/file-upload.service";
import {UtilsService} from "./service/utils-service";
import { AdsenseComponent } from './adsense/adsense.component';
import {ProfileXSIconComponent} from "./profile-icon/profile-xs-icon.component";
import {ProfileService} from "../profile/service/profile.service";
import {ProfileRepository} from "../profile/repository/profile.repository";
import {ShareButtonModule} from "@ngx-share/button";

@NgModule({
  imports: [
    CommonModule,
    ShareButtonModule.forRoot()
  ],
  declarations: [
    TinymceEditorComponent,
    ShareComponent,
    AuthModalComponent,
    EditorModalComponent,
    ConfirmModalComponent,
    ProfileIconComponent,
    ProfileSmallIconComponent,
    ProfileXSIconComponent,
    CommentIconComponent,
    ReplyIconComponent,
    SafeHtmlPipe,
    FromNowPipe,
    AdsenseComponent
  ],
  exports: [
    TinymceEditorComponent,
    ShareComponent,
    AuthModalComponent,
    EditorModalComponent,
    ConfirmModalComponent,
    ProfileIconComponent,
    ProfileSmallIconComponent,
    ProfileXSIconComponent,
    CommentIconComponent,
    ReplyIconComponent,
    SafeHtmlPipe,
    FromNowPipe,
    AdsenseComponent
  ],
  providers: [
    FileUploadService,
    UtilsService,
    ProfileService,
    ProfileRepository
  ]
})
export class SharedModule { }
