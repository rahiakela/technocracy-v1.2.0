import {User} from './user-model';
import {Comment} from './comment-model';

/**
 * Question Model
 * Author:Rahi Akela
 * Date  :03/03/2018
 * Description: This is the main Question model and also contains helper model
 * */

export interface QuestionInfo {
  statusCode?: number,
  page?: number,
  message?: string,
  question?: Question,
  questions?: Question[]
}

export interface QuestionModel {
  questionId?: string,
  title?: string,
  content?: string,
  tag?: string,
  captcha?: string
}

export interface Question {
  _id?: string,
  title?: string,
  content?: string,
  askedBy?: User,
  createdOn?: Date,
  submittedOn?: Date,
  publishedOn?: Date,
  updatedOn?: Date,
  holdOnDate?: Date,
  inactiveDate?: Date,
  rejectedOn?: Date,
  status?: string,
  comments?: Comment[],
  likes?: string[],
  tags?: string[],
  voteUp?: string[],
  voteDown?: string[]
}
