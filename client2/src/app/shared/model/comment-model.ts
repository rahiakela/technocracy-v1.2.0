import {User} from "./user-model";
import {Blog} from "./blog-model";

/**
 * Comment/Reply Model
 * Author:Rahi Akela
 * Date  :03/03/2018
 * Description: This is the main Blog model and also contains child Reply model
 * */

export interface CommentInfo {
  statusCode?: number,
  comment?: Comment,
  comments?: Comment[]
}

export interface Comment {
  _id?: string;
  content?: string;
  commentedBy?: User;
  commentedOn?: Date;
  likes?: string[];
  replies?: Reply[];
  notification?: string;
}

export interface Reply {
  _id?: string;
  content?: string;
  repliedBy?: User;
  repliedOn?: Date;
  likes?: string[];
}
