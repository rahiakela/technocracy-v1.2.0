import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmModalComponent} from "../../shared/modal/confirm-modal.component";
import {User, UserInfo} from "../../shared/model/user-model";
import {Comment, Reply} from "../../shared/model/comment-model";
import {EditorModalComponent} from "../../shared/modal/editor-modal.component";
import {Blog, BlogInfo} from "../../shared/model/blog-model";
import {AppState} from "../../store/app.reducer";
import * as BlogActions from "../../store/blog/blog.actions";
import {ShowHideModalObserver} from "../../core/observer/show-hide-modal-observer";
import {Store} from "redux";
import * as moment from 'moment';
import * as $ from 'jquery';
import * as UserActions from "../../store/user/user.actions";
import {UtilsService} from "../../shared/service/utils-service";
import {BlogService} from "../blog.service";
import {FileUploadService} from "../../shared/service/file-upload.service";
import {CoreService} from "../../core/service/core.service";
import {AppStore} from "../../store/app.store";
import {Meta, Title} from "@angular/platform-browser";

declare var tinymce: any;

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.css']
})
export class BlogViewComponent implements OnInit, AfterViewInit, OnDestroy {

  user: User;
  userInfo: UserInfo;
  blog: Blog;
  blogList: Blog[] = new Array<Blog>();
  currentUser = ''; username = ''; errorMessage = ''; newComment = ''; newReply = '';
  totalLikes = 0; totalComments = 0; replyLikes = 0; totalVoteUp = 0; totalVoteDown = 0;
  comment: Comment;
  comments: Comment[] = new Array<Comment>();
  reply: Reply;
  contentToUpdate: string;

  editor: any;
  input: any;

  IS_COMMENT = false;
  commentIdToUpdate: string;
  notification: string;

  @ViewChild(EditorModalComponent) // ref:https://angular.io/guide/component-interaction#!#parent-to-child-local-var
  private editorModalComponent: EditorModalComponent;
  @ViewChild(ConfirmModalComponent)
  private confirmModalComponent: ConfirmModalComponent;

  // functional expression
  private blogLocator= (b: Blog, _id: string) => b._id === _id;
  private commentLocator= (c: Comment, _id: string) => c._id === _id;

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private blogService: BlogService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private coreService: CoreService,
              private utilService: UtilsService,
              private fileUploadService: FileUploadService,
              public showHideModalObserver: ShowHideModalObserver,
              private titleService: Title,
              private meta: Meta) {

    activeRoute.params.subscribe(params => {
      // loading blog data from route resolver
      this.blog = this.activeRoute.snapshot.data['blog'].blog[0];
      this.blogSoloView();
    });
  }

  ngOnInit(): void {

  }

  blogSoloView() {
    if (this.blog !== undefined) {
      // set current blog for image upload etc
      this.utilService.setCurrentBlog(this.blog);

      this.comments = this.blog.comments;
      this.totalLikes = this.blog.likes.length || 0;
      this.totalComments = this.comments.length || 0;

      // setting page title
      this.setTitle(this.blog.title);
      // add meta tag description etc.
      this.addMetaTag(this.blog);
    }
  }

  getBlogs() {
    this.blogList = this.coreService.getBlogs(0);
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  public resolved(captchaResponse: string) {

    if (captchaResponse) {
      if (document.getElementById('blog-re-captcha-signup') != null) {
        document.getElementById('blog-re-captcha-signup').removeAttribute('disabled');
      }
      if (document.getElementById('blog-re-captcha-comment') != null) {
        document.getElementById('blog-re-captcha-comment').removeAttribute('disabled');
      }
    }
  }

  showLoginSignup() {
    this.showHideModalObserver.pushShowHide(true);
  }

  logout() {
    // remove the current User from the store
    this.store.dispatch(UserActions.removeCurrentUser({}));
  }

  isUserLoggedIn(commentId: string): number {
    const user = this.store.getState().user.currentUser;
    // identify that add comment or replay comment button is clicked
    if (commentId.length > 0) {
      this.commentIdToUpdate = commentId;
      // set current comment id for image upload
      this.utilService.setCurrentCommentId(commentId);
      this.IS_COMMENT = true;
    } else {
      this.utilService.setCurrentCommentId('');
      this.IS_COMMENT = false;
    }

    return user != null ? 1 : 0;
  }

  getCommentReplyContentToUpdate(obj: any, actionType: string) {
    if (actionType === 'comment') {
      this.comment = obj;
      // set comment editor value ref: https://stackoverflow.com/questions/8576078/set-value-inside-a-tinymce-editor-using-jquery
      tinymce.activeEditor.setContent(this.utilService.decodeHTML(this.comment.content));
      this.IS_COMMENT = true;
      // set current comment id for image upload
      this.utilService.setCurrentCommentId(this.comment._id);
    } else {
      this.reply = obj;
      // set comment editor value
      tinymce.activeEditor.setContent(this.utilService.decodeHTML(this.reply.content));
      // set current comment id for image upload
      this.utilService.setCurrentCommentId(this.reply._id);
      this.IS_COMMENT = false;
    }
  }

  editCommentReply() {
    // check, this action is for edit comment or edit replay
    if (this.IS_COMMENT) {
      // validate comment content
      if (this.contentToUpdate === '') {
        this.errorMessage = 'Please write your comment';
        return false;
      }

      this.comment.content = this.utilService.encodeHtml(this.contentToUpdate);
      this.blogService.editCommentReply('comment', this.blog._id, this.comment).subscribe(data => {
        const bInfo: BlogInfo = data;
        if (data.statusCode === 200) {
          // loading updated comment list
          this.comments = bInfo.blog[0].comments;
          // reset selected blog into store
          this.store.dispatch(BlogActions.resetSelectedBlog(bInfo.blog[0]));
          this.router.navigate(['/blog/', this.blog._id]);
        }
      });
    } else {
      // validate reply content
      if (this.contentToUpdate === '') {
        this.errorMessage = 'Please write your reply';
        return false;
      }

      this.reply.content = this.utilService.encodeHtml(this.contentToUpdate);
      this.blogService.editCommentReply('reply', this.blog._id, this.reply).subscribe(data => {
        const bInfo: BlogInfo = data;
        if (bInfo.statusCode === 200) {
          // loading updated comment list
          this.comments = bInfo.blog[0].comments;
          // reset selected blog into store
          this.store.dispatch(BlogActions.resetSelectedBlog(bInfo.blog[0]));
          this.router.navigate(['/blog/', this.blog._id]);
        }
      });
    }
  }

  deleteCommentAndReply(actionId: string, actionType: string) {
    // delete question to mongodb
    this.blogService.deleteCommentAndReply(this.blog._id, actionId, actionType).subscribe(data => {
      const bInfo: BlogInfo = data;
      if (bInfo.statusCode === 200) {
        // loading updated comment list
        this.comments = bInfo.blog[0].comments;
        this.totalComments = this.comments.length || 0;
        // reset selected blog into store
        this.store.dispatch(BlogActions.resetSelectedBlog(bInfo.blog[0]));
        // hide the confirm dialog box
        this.confirmModalComponent.hide();
        this.router.navigate(['/blog/', this.blog._id]);
      }
    });
  }

  likeBlog() {
    // save user into database who has liked the blog
    this.blogService.like(this.blog._id, this.getStoredUser().user._id).subscribe(data => {
      if (data.statusCode === 200) {
        const blogInfo: BlogInfo = data;
        this.totalLikes = blogInfo.blog[0].likes.length || 0;
        // reset selected blog into store
        this.store.dispatch(BlogActions.resetSelectedBlog(blogInfo.blog[0]));
        this.router.navigate(['/blog/', this.blog._id]);
      }
    });
  }

  likeComment(commentId: string) {
    // save user into database who has liked the comment
    this.blogService.likeComment(this.blog._id, this.getStoredUser().user._id, commentId).subscribe(data => {
      const blogInfo: BlogInfo = data;
      if (blogInfo.statusCode === 200) {
        const commentLikes = blogInfo.blog[0].comments.filter(c => c._id === commentId)[0].likes.length;
        // reset selected blog into store
        this.store.dispatch(BlogActions.resetSelectedBlog(blogInfo.blog[0]));
        document.getElementById(commentId).innerHTML = '&nbsp;' + commentLikes;
      }
    });
  }

  likeReply(commentId: string, replyId: string) {
    // save user into database who has liked the comment's reply
    this.blogService.likeReply(this.blog._id, this.getStoredUser().user._id, commentId, replyId).subscribe(data => {
      const blogInfo: BlogInfo = data;
      if (blogInfo.statusCode === 200) {
        const replyLikes = this.utilService.replyLikesCount(blogInfo, commentId, replyId);
        // reset selected blog into store
        this.store.dispatch(BlogActions.resetSelectedBlog(blogInfo.blog[0]));
        document.getElementById(replyId).innerHTML = '&nbsp;' + replyLikes;
      }
    });
  }

  keyupHandler(value: any) {
    this.newComment = value;
    if (this.IS_COMMENT) {
      this.newReply = value;
    }
  }

  addComment(notification: string): boolean {

    // call add comment or replay comment
    if (this.IS_COMMENT) {

      // validate reply content
      if (this.newReply === '') {
        this.errorMessage = 'Please write your reply';
        return false;
      }

      const reply = {content: this.encodeHtml(this.newReply)};

      this.blogService.reply(this.blog._id, this.utilService.getCurrentUser(), this.commentIdToUpdate, reply).subscribe(data => {
        const blogInfo: BlogInfo = data;
        if (blogInfo.statusCode === 200) {
          // loading updated comment list
          this.comments = blogInfo.blog[0].comments;
          // reset selected blog into store
          this.store.dispatch(BlogActions.resetSelectedBlog(blogInfo.blog[0]));
          // hiding the comment editor by calling child component method
          this.editorModalComponent.hide();
          // this.router.navigate(['/blog/', this.blog._id]);
        }
      });
    } else {

      // validate comment content
      if (this.newComment === '') {
        this.errorMessage = 'Please write your comment';
        return false;
      }

      const comment = {
        content: this.encodeHtml(this.newComment),
        notification: notification
      };

      this.blogService.addComment(this.blog._id, this.utilService.getCurrentUser(), comment).subscribe(data => {
        const blogInfo: BlogInfo = data;
        if (blogInfo.statusCode === 200) {
          // loading updated comment list
          this.comments = blogInfo.blog[0].comments;
          this.totalComments = this.comments.length || 0;
          // reset selected blog into store
          this.store.dispatch(BlogActions.resetSelectedBlog(blogInfo.blog[0]));
          // hiding the comment editor by calling child component method
          this.editorModalComponent.hide();
        }
      });
    }

  }

  clearErrorMessage(): void {
    // clear previous error message
    this.errorMessage = '';
  }

  getUserName(user: User): string {
    if (user != null) {
      return this.utilService.getUserName(user);
    }

    return '';
  }

  getCurrentUser(): string {
    return this.utilService.getCurrentUser();
  }

  getCurrentUserId(user: User): string {
    return user != null ? user._id : '';
  }

  storeUser(userInfo: UserInfo): void {
    localStorage.setItem('userInfo' , JSON.stringify(userInfo));
  }

  getStoredUser(): UserInfo {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.coreService.currentUser = this.userInfo;

    return this.userInfo;
  }

  showSkillsHashTag(skills: string[]) {
    return skills.map(skill => '#' + skill);
  }

  encodeHtml(str) {
    if (!str) {
      return '';
    }
    const html = str.replace(/[^a-z0-9A-Z ]/g, c => {
      return '&#' + c.charCodeAt() + ';';
    });
    return html;
  }

  getContent(content: string): string {
    // trim the content up to 300
    if (content.length >= 300) {
      const deContent = content = content.substring(0, 300);
      return this.utilService.decodeHTML(content);
    }

    return this.utilService.decodeHTML(content);
  }

  addMetaTag(blog: Blog) {
    // setting page's meta tag
    this.meta.updateTag({property: 'og:title', content: this.blog.title});
    this.meta.updateTag({property: 'og:description', content: this.blog.description});
    this.meta.updateTag({property: 'og:url', content: `https://www.tecknocracy.com/#/blog/${this.blog._id}`});
    this.meta.updateTag({property: 'og:image', content: this.blog.image});
    this.meta.updateTag({property: 'og:image:secure_url', content: this.blog.image});
    this.meta.updateTag({property: 'article:published_time', content: this.blog.publishedOn === null ? '' : moment(this.blog.publishedOn, 'YYYYMMDDHHmmss').toString()});
    this.meta.updateTag({property: 'article:modified_time', content: this.blog.updatedOn === null ? '' : moment(this.blog.updatedOn, 'YYYYMMDDHHmmss').toString()});

    // adding all blog keywords into  article tag
    this.blog.tags.forEach(tag => {
      this.meta.addTag({property: 'article:tag', content: tag});
    });
  }

  ngAfterViewInit() {

    tinymce.init({
      selector: '#comment-update-editor',
      plugins : ['link', 'paste', 'table', 'codesample'],
      toolbar: 'styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table codesample imageupload',
      skin_url : 'assets/skins/lightgray',
      setup: editor => {
        this.editor = editor;

        editor.on('keyup', () => {
          this.contentToUpdate = editor.getContent();
        });
        editor.on('change', () => {
          this.contentToUpdate = editor.getContent();
        });
        this.initImageUpload(editor);
      }
    });

    // removing background spinning wheel
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('loading'); // removing background spinning wheel image class
    body.classList.add('noloading');  // adding no background spinning wheel image class
  }

  initImageUpload(editor: any) {

    // create input and insert in the DOM
    this.input = $('<input id="tinymce-uploader" type="file" name="pic" accept="image/*" style="display:none">');
    $(editor.getElement()).parent().append(this.input);

    // add the image upload button to the editor toolbar
    editor.addButton('imageupload', {
      text: '',
      icon: 'image',
      title: 'add image to your post',
      onclick: (e) => this.input.trigger('click') // when toolbar button is clicked, open file select modal
    });

    // when a file is selected, upload it to the server
    this.input.on('change', (e) => this.uploadFile(this.input, editor));
  }

  uploadFile(input, editor) {
    console.log('File Name:' + input.get(0).files[0].name);
    const file = input.get(0).files[0];

    // check the file size, it should not be 150KB=1024*150=153600
    if (file.size > 153600) {
      alert('Please make sure, the attached file should not be more than 150KB');
      return false;
    }

    // this image upload is for comment update or comment's reply update for blog
    const uploadPath = `images/blogs/${this.utilService.getCurrentBlog()._id}/comments/${this.utilService.getCurrentCommentId()}`;
    this.fileUploadService.upload(editor, file, uploadPath);
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

}
