/**
 * User Model
 * Author:Rahi Akela
 * Date  :03/03/2018
 * Description: This is the User model and also contains helper model
 * */
import {Profile} from "./profile-model";

export interface UserInfo {
  statusCode?: number,
  token?: string,
  user?: User,
  message?: string
}

export interface User {
   _id?: string,
  subscription?: string,
  role?: string,
  local?: Local,
  facebook?: Facebook,
  google?: Google,
  linkedin?: LinkedIn,
  jwtToken?: string,
  profile?: Profile
}

export interface Local {
  email?: string,
  name?: string,
  password?: string,
  salt?: string,
  hash?: string,
  image?: string,
  lastLogin?: Date,
  createdOn?: Date,
  active?: string,
  activatedOn?: Date,
  activateToken?: ActivateToken
}

export interface Facebook {
  email?: string,
  name?: string,
  uid?: string,
  image?: string,
  token?: string,
  provider?: string,
  lastLogin?: Date,
  createdOn?: Date
}

export interface Google {
  email?: string,
  name?: string,
  uid?: string,
  image?: string,
  token?: string,
  provider?: string,
  lastLogin?: Date,
  createdOn?: Date
}

export interface LinkedIn {
  email?: string,
  name?: string,
  uid?: string,
  image?: string,
  token?: string,
  provider?: string,
  lastLogin?: Date,
  createdOn?: Date
}

export interface ActivateToken {
  token?: string,
  expires?: Date
}
