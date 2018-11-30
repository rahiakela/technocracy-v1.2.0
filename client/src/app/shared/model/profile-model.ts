import {User} from './user-model';

/**
 * Author Model
 * Author:Rahi Akela
 * Date  :03/03/2018
 * Description: This is the main Profile model.
 * */

export interface ProfileInfo {
  statusCode?: number,
  message?: string,
  profile?: Profile
}

export interface Profile {
  _id?: string,
  name?: string,
  designation?: string,
  description?: string,
  company?: string,
  joinedOn?: Date,
  phone?: number,
  address?: string,
  city?: string,
  country?: string,
  photo?: string,
  skills?: string[],
  socialLink?: SocialLink,
  user?: User
}

export interface SocialLink {
  facebook?: string,
  twitter?: string,
  google?: string,
  linkedin?: string
}
