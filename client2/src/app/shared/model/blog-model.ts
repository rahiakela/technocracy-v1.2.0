import {Profile} from './profile-model';
import {Comment} from './comment-model';

/**
 * Blog Model
 * Author:Rahi Akela
 * Date  :03/03/2018
 * Description: This is the main Blog model and also contains helper model
 * */

export interface BlogInfo {
  statusCode?: number,
  page?: number,
  message?: string,
  blog?: Blog,
  blogs?: Blog[]
}

export interface BlogModel {
  blogId?: string,
  title?: string,
  content?: string,
  tag?: string,
  captcha?: string
}

export interface Blog {
  _id?: string,
  title?: string,
  content?: string,
  description?: string,
  profile?: Profile,
  createdOn?: Date,
  submittedOn?: Date,
  publishedOn?: Date,
  updatedOn?: Date,
  holdOnDate?: Date,
  inactiveDate?: Date,
  rejectedOn?: Date,
  image?: string,
  status?: string,
  comments?: Comment[],
  likes?: string[],
  tags?: string[]
}

