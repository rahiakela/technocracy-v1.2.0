import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionService} from '../question-service';
import {Meta, Title} from '@angular/platform-browser';
import {CoreService} from '../../core/service/core.service';
import {UtilsService} from '../../shared/service/utils-service';
import {FileUploadService} from '../../shared/service/file-upload.service';
import {Question, QuestionInfo} from '../../shared/model/question-model';
import {User, UserInfo} from '../../shared/model/user-model';
import {Comment, Reply} from '../../shared/model/comment-model';
import {EditorModalComponent} from '../../shared/modal/editor-modal.component';
import {AuthModalComponent} from '../../shared/modal/auth-modal.component';
import {ConfirmModalComponent} from '../../shared/modal/confirm-modal.component';
import * as moment from 'moment';
import * as $ from 'jquery';
import {AppState} from "../../store/app.reducer";
import {AppStore} from "../../store/app.store";
import * as QuestionActions from '../../store/question/question.actions';
import {ShowHideModalObserver} from "../../core/observer/show-hide-modal-observer";
import {Store} from "redux";

declare var tinymce: any;

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.css']
})
export class QuestionViewComponent implements OnInit, AfterViewInit, OnDestroy {

  question: Question;
  userInfo: UserInfo;
  user: User;

  editor: any;
  input: any;

  totalLikes = 0; totalComments = 0; totalVoteUp = 0; totalVoteDown = 0;
  notification = ''; currentUserId = ''; currentUser = ''; username = ''; errorMessage = ''; newComment = ''; newReply = '';

  IS_COMMENT = false;

  comment: Comment;
  reply: Reply;
  contentToUpdate: string;
  comments: Comment[];
  commentIdToUpdate: string;

  @ViewChild(EditorModalComponent) // ref:https://angular.io/guide/component-interaction#!#parent-to-child-local-var
  private editorModalComponent: EditorModalComponent;
  @ViewChild(AuthModalComponent)
  private authModalComponent: AuthModalComponent;
  @ViewChild(ConfirmModalComponent)
  private confirmModalComponent: ConfirmModalComponent;

  constructor(@Inject(AppStore) private store: Store<AppState>,
              private questionService: QuestionService,
              private activeRoute: ActivatedRoute,
              private router: Router,
              private coreService: CoreService,
              private utilService: UtilsService,
              private fileUploadService: FileUploadService,
              public showHideModalObserver: ShowHideModalObserver,
              private titleService: Title,
              private meta: Meta) {
    // console.log('QuestionViewComponent is called...');

    activeRoute.params.subscribe(params => {
      // loading question data from route resolver
      this.question = this.activeRoute.snapshot.data['question'].question[0];
      if (this.question !== undefined) {
        this.questionSoloView();
      }

    });

  }

  ngOnInit() {
    this.clearErrorMessage();
  }

  questionSoloView() {
    this.comments = this.question.comments;
    this.totalLikes = this.question.likes !== undefined ? this.question.likes.length : 0;
    this.totalComments = this.question.comments !== undefined ? this.question.comments.length : 0;
    this.totalVoteUp = this.question.voteUp !== undefined ? this.question.voteUp.length : 0;
    this.totalVoteDown = this.question.voteDown !== undefined ? this.question.voteDown.length : 0;
    this.currentUserId = this.question.askedBy !== undefined ? this.question.askedBy._id : '';

    // setting page title
    this.setTitle(this.question.title);
    // setting meta tags
    this.addMetaTag(this.question);

    // set current question for image upload etc.
    this.utilService.setCurrentQuestion(this.question);
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  like(questionId: string) {
    // save user into database who has liked the question
    this.questionService.like(questionId, this.utilService.getCurrentUser()).subscribe(data => {
      const qInfo: QuestionInfo = data;
      this.totalLikes = qInfo.question[0].likes.length || 0;
      // reset selected question into store
      this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question[0]));
      this.router.navigate(['/question/', this.question._id]);
    });
  }

  commentKeyupHandler(value: any) {
    // console.log('Comment content:' + value);
    if (this.IS_COMMENT) {
      this.newReply = value;
    }else {
      this.newComment = value;
    }
  }

  addCommentReply(questionId: string, notification: string): boolean {

    // check, this action is for add comment or add replay
    if (this.IS_COMMENT) {

      // validate reply content
      if (this.newReply === '') {
        this.errorMessage = 'Please write your reply';
        return false;
      }

      this.reply = {
        content: this.utilService.encodeHtml(this.newReply)
      };
      this.questionService.reply(this.utilService.getCurrentUser(), questionId, this.commentIdToUpdate, this.reply).subscribe(data => {
        const qInfo: QuestionInfo = data;
        if (qInfo.statusCode === 200) {
          // loading updated comment list
          this.comments = qInfo.question[0].comments;
          this.totalComments = this.comments.length || 0;
          // reset selected question into store
          this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question[0]));
          // hiding the comment editor by calling child component method
          this.editorModalComponent.hide();
          this.router.navigate(['/question/', this.question._id]);
        }
      });
    } else {

      // validate comment content
      if (this.newComment === '') {
        this.errorMessage = 'Please write your comment';
        return false;
      }

      this.comment = {
        content: this.utilService.encodeHtml(this.newComment),
        notification: notification
      };
      this.questionService.addComment(questionId, this.utilService.getCurrentUser(), this.comment).subscribe(data => {
        const qInfo: QuestionInfo = data;
        if (qInfo.statusCode === 200) {
          // loading updated comment list
          this.comments = qInfo.question[0].comments;
          this.totalComments = this.comments.length || 0;
          // reset selected question into store
          this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question[0]));
          // hiding the comment editor by calling child component method
          this.editorModalComponent.hide();
          this.router.navigate(['/question/', this.question._id]);
        }
      });
    }
  }

  getCommentReplyContentToUpdate(obj: any, actionType: string) {
    if (actionType === 'comment') {
      this.comment = Object.assign({}, obj)
      // set comment editor value ref: https://stackoverflow.com/questions/8576078/set-value-inside-a-tinymce-editor-using-jquery
      tinymce.activeEditor.setContent(this.utilService.decodeHTML(this.comment.content));
      // set current comment id for image upload
      this.utilService.setCurrentCommentId(this.comment._id);
      this.IS_COMMENT = true;
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

      // const updatedComment = Object.assign({content: this.utilService.encodeHtml(this.contentToUpdate)}, this.comment);
      this.comment.content = this.utilService.encodeHtml(this.contentToUpdate);
      this.questionService.editCommentReply('comment', this.question._id, this.comment).subscribe(data => {
        const qInfo: QuestionInfo = data;
        if (qInfo.statusCode === 200) {
          // loading updated comment list
          this.comments = qInfo.question[0].comments;
          // reset selected question into store
          this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question[0]));
          this.router.navigate(['/question/', this.question._id]);
        }
      });
    } else {
      // validate reply content
      if (this.contentToUpdate === '') {
        this.errorMessage = 'Please write your reply';
        return false;
      }

      this.reply.content = this.utilService.encodeHtml(this.contentToUpdate);
      this.questionService.editCommentReply('reply', this.question._id, this.reply).subscribe(data => {
        const qInfo: QuestionInfo = data;
        if (qInfo.statusCode === 200) {
          // loading updated comment list
          this.comments = qInfo.question[0].comments;
          // reset selected question into store
          this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question[0]));
          this.router.navigate(['/question/', this.question._id]);
        }
      });
    }

  }

  deleteCommentAndReply(actionId: string, actionType: string) {

    // delete question to mongodb
    this.questionService.deleteCommentAndReply(this.question._id, actionId, actionType).subscribe(data => {
      const qInfo: QuestionInfo = data;
      if (qInfo.statusCode === 200) {

        if (!data.questionDeleted) {
          // loading updated comment list
          this.comments = qInfo.question[0].comments;
          this.totalComments = this.comments.length || 0;
          // reset selected question into store
          this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question[0]));
          // hide the confirm dialog box
          this.confirmModalComponent.hide();
          this.router.navigate(['/question/', this.question._id]);
        } else {
          this.router.navigate(['/question/']);
        }
      }
    });
  }

  likeComment(questionId: string, commentId: string) {
    // save user into database who has liked the comment
    this.questionService.likeComment(this.userInfo.user._id, questionId, commentId).subscribe(data => {
      const qInfo: QuestionInfo = data;
      if (qInfo.statusCode === 200) {
        const commentLikes = qInfo.question[0].comments.filter(c => c._id === commentId)[0].likes.length;
        // reset selected question into store
        this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question[0]));
        document.getElementById(commentId).innerHTML = '&nbsp;' + commentLikes;
      }
    });
  }

  likeReply(questionId: string, commentId: string, replyId: string) {
    // save user into database who has liked the comment's reply
    this.questionService.likeReply(this.userInfo.user._id, questionId, commentId, replyId).subscribe(data => {
      const qInfo: QuestionInfo = data;
      if (qInfo.statusCode === 200) {
        const replyLikes = this.utilService.replyLikesCount(qInfo, commentId, replyId);
        // reset selected question into store
        this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question[0]));
        document.getElementById(replyId).innerHTML = '&nbsp;' + replyLikes;
      }
    });
  }

  voteUp(questionId: string) {
    // save user into database who has voted up this question
    this.questionService.voteUp(questionId, this.userInfo.user._id).subscribe(data => {
      const qInfo: QuestionInfo = data;
      if (qInfo.statusCode === 200) {
        this.totalVoteUp = qInfo.question[0].voteUp.length;
        // reset selected question into store
        this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question[0]));
      }
    });
  }

  voteDown(questionId: string) {
    // save user into database who has voted down this question
    this.questionService.voteDown(questionId, this.userInfo.user._id).subscribe(data => {
      const qInfo: QuestionInfo = data;
      if (qInfo.statusCode === 200) {
        this.totalVoteDown = qInfo.question[0].voteDown.length;
        // reset selected question into store
        this.store.dispatch(QuestionActions.resetSelectedQuestion(qInfo.question[0]));
      }
    });
  }

  showLoginSignup() {
    this.showHideModalObserver.pushShowHide(true);
  }

  public resolved(captchaResponse: string) {

    if (captchaResponse) {
      if (document.getElementById('question-re-captcha-signup') != null) {
        document.getElementById('question-re-captcha-signup').removeAttribute('disabled');
      }
      if (document.getElementById('question-re-captcha-comment') != null) {
        document.getElementById('question-re-captcha-comment').removeAttribute('disabled');
      }
    }
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
      // set current comment id for image upload
      this.utilService.setCurrentCommentId('');
    }

    return user != null ? 1 : 0;
  }

  clearErrorMessage(): void {
    // clear previous error message
    this.errorMessage = '';
  }

  getCurrentUser(): string {
    return this.utilService.getCurrentUser();
  }

  getCurrentUserId(user: User): string {
    return user != null ? user._id : '';
  }

  getUserName(user: User): string {
    if (user != null) {
      return this.utilService.getUserName(user);
    }

    return '';
  }

  getContent(question: Question): string {
    // trim the content up to 200
    if (question.content.length >= 200) {
      const content = question.content = question.content.substring(0, 200);
      return this.utilService.decodeHTML(content);
    }

    return this.utilService.decodeHTML(question.content);
  }

  showSkillsHashTag(skills: string[]): string[] {
    return this.utilService.showSkillsHashTag(skills);
  }

  addMetaTag(question: Question) {
    // setting page's meta tag
    this.meta.updateTag({property: 'og:title', content: this.question.title});
    this.meta.updateTag({property: 'og:url', content: `https://www.tecknocracy.com/#/question/${this.question._id}`});
    this.meta.updateTag({property: 'article:published_time', content: this.question.publishedOn === null ? '' : moment(this.question.publishedOn, 'YYYYMMDDHHmmss').toString()});
    this.meta.updateTag({property: 'article:modified_time', content: this.question.updatedOn === null ? '' : moment(this.question.updatedOn, 'YYYYMMDDHHmmss').toString()});

    // adding all question keywords into  article tag
    this.question.tags.forEach(tag => {
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
    const file = input.get(0).files[0];

    // check the file size, it should not be 150KB=1024*150=153600
    if (file.size > 153600) {
      alert('Please make sure, the attached file should not be more than 150KB');
      return false;
    }

    // this image upload is for comment update or comment's reply update for blog
    const uploadPath = `images/blogs/${this.utilService.getCurrentQuestion()._id}/comments/${this.utilService.getCurrentCommentId()}`;
    this.fileUploadService.upload(editor, file, uploadPath);
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}
