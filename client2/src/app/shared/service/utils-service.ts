import {Inject, Injectable} from '@angular/core';
import {User, UserInfo} from '../model/user-model';
import {Question} from '../model/question-model';
import {Blog} from '../model/blog-model';
import {AppState} from "../../store/app.reducer";
import {AppStore} from "../../store/app.store";
import {Store} from "redux";

@Injectable()
export class UtilsService {

  currentUser: UserInfo;
  currentBlog: Blog;
  currentQuestion: Question;
  currentCommentId: string;

  constructor(@Inject(AppStore) private store: Store<AppState>) {}

  isUserLoggedIn(): boolean {
    const userInfo = this.store.getState().user.currentUser;
    return userInfo != null ? true : false;
  }

  getCurrentUser(): string {
    const user = this.store.getState().user.currentUser;
    return user != null ? user._id : '';
  }

  getLoggedInUser(): User {
    const user = this.store.getState().user.currentUser;
    return user != null ? user : null;
  }

  getCurrentBlog(): Blog {
    return this.currentBlog;
  }

  setCurrentBlog(blog: Blog) {
    this.currentBlog = blog;
  }

  getCurrentQuestion(): Question {
    return this.currentQuestion;
  }

  setCurrentQuestion(question: Question) {
    this.currentQuestion = question;
  }

  getCurrentCommentId(): string {
    return this.currentCommentId;
  }

  setCurrentCommentId(commentId: string) {
    this.currentCommentId = commentId;
  }

  getSelectedBlog(): Blog {
    return this.store.getState().blog.selectedBlog[0];
  }

  getSelectedQuestion(): Question {
    return this.store.getState().question.selectedQuestion[0];
  }

  encodeHtml(str): string {
    if (!str) {
      return '';
    }
    const html = str.replace(/[^a-z0-9A-Z ]/g, c => {
      return '&#' + c.charCodeAt() + ';';
    });
    return html;
  }

  // ref-https://gist.github.com/CatTail/4174511
  decodeHTML(str) {
    return str.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    });
  }

  showSkillsHashTag(skills: string[]): string[] {
    return skills.map(skill => '#' + skill);
  }

  getUserWithUpdatedImagePath(user: User, imagePath: string): User {
    if (user.local.name != null) {
      Object.assign(user.local, {'image': imagePath});
    }
    if (user.facebook.name != null) {
      Object.assign(user.facebook, {'image': imagePath});
    }
    if (user.google.name != null) {
      Object.assign(user.google, {'image': imagePath});
    }
    if (user.linkedin.name != null) {
      Object.assign(user.linkedin, {'image': imagePath});
    }

    return user;
  }

  getUserName(userModel: User): string {

    if (userModel.local.name != null) {
      return userModel.local.name;
    }
    if (userModel.facebook.name != null) {
      return userModel.facebook.name;
    }
    if (userModel.google.name != null) {
      return userModel.google.name;
    }
    if (userModel.linkedin.name != null) {
      return userModel.linkedin.name;
    }

    return '';
  }

  getUserIcon(user: User): string {

    if (user.local === null) {
      return '';
    }

    if (user.local.image != null) {
      return user.local.image;
    }
    if (user.facebook.image != null) {
      return user.facebook.image;
    }
    if (user.google.image != null) {
      return user.google.image;
    }
    if (user.linkedin.image != null) {
      return user.linkedin.image;
    }

    return '';
  }

  replyLikesCount(commentType: any, cId: string, rId: string) {
    if (commentType.blog) {
      return commentType.blog[0].comments
        .filter(c => c._id === cId)[0].replies
        .filter(r => r._id === rId)[0].likes.length;
    }
    if (commentType.question) {
      return commentType.question[0].comments
        .filter(c => c._id === cId)[0].replies
        .filter(r => r._id === rId)[0].likes.length;
    }
  }
}
