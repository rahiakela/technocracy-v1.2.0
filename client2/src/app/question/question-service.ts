import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Question, QuestionInfo} from '../shared/model/question-model';
import {Comment, Reply} from '../shared/model/comment-model';
import {QuestionRepository} from './question-repository';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class QuestionService {

  question: Question;
  comments: Comment;

  constructor(private questionRepository: QuestionRepository) {

  }

  showAllQuestions(askedBy: string): Observable<any> {
      return this.questionRepository.showAllQuestions(askedBy);
  }

  getPendingQuestionList(): Observable<any> {
    return this.questionRepository.getPendingQuestionList();
  }

  saveQuestion(question: Question, userId: string, actionType: string): Observable<QuestionInfo> {
    return this.questionRepository.saveQuestion(question, userId, actionType);
  }

  modifyQuestion(questionId: string, actionType: string): Observable<QuestionInfo> {
    return this.questionRepository.modifyQuestion(questionId, actionType);
  }

  editQuestion(question: Question, questionId: string): Observable<QuestionInfo> {
    return this.questionRepository.editQuestion(question, questionId);
  }

  editCommentReply(actionType: string, questionId: string, commentReply: any): Observable<QuestionInfo> {
    return this.questionRepository.editCommentReply(actionType, questionId, commentReply);
  }

  deleteCommentAndReply(questionId: string, actionId: string, actionType: string): Observable<any> {
    return this.questionRepository.deleteCommentAndReply(questionId, actionId, actionType);
  }

  deleteQuestion(questionId: string): Observable<any> {
    return this.questionRepository.deleteQuestion(questionId);
  }

  like(questionId: string, userId: string): Observable<any> {
    return this.questionRepository.like(questionId, userId);
  }

  likeComment(userId: string, questionId: string, commentId: string): Observable<any> {
    return this.questionRepository.likeComment(userId, questionId, commentId);
  }

  likeReply(userId: string, questionId: string, commentId: string, replyId: string): Observable<any> {
    return this.questionRepository.likeReply(userId, questionId, commentId, replyId);
  }

  addComment(questionId: string, userId: string, comments: Comment): Observable<any> {
    return this.questionRepository.addComment(questionId, userId, comments);
  }

  reply(userId: string, questionId: string, commentId: string, reply: Reply): Observable<any> {
    return this.questionRepository.reply(userId, questionId, commentId, reply);
  }

  voteUp(questionId: string, userId: string): Observable<any> {
    return this.questionRepository.voteUp(questionId, userId);
  }

  voteDown(questionId: string, userId: string): Observable<any> {
    return this.questionRepository.voteDown(questionId, userId);
  }

}
