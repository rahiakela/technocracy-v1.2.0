/**
 * File Context : User Action
 * Author       : Rahi Akela
 * Date         : 04-03-2018
 * Description  : This list out all the actions that specifies actions creators concerning User
 * */
import {Action, ActionCreator} from "redux";
import {User} from "../../shared/model/user-model";

export const SET_CURRENT_USER = '[User] Set';
export const REMOVE_CURRENT_USER = '[User] Remove';

export interface SetCurrentUserAction extends Action {
  user: User;
}
export interface RemoveCurrentUserAction extends Action {
  user: User;
}

export const setCurrentUser: ActionCreator<SetCurrentUserAction> = (user) => ({
  type: SET_CURRENT_USER,
  user: user
});

export const removeCurrentUser: ActionCreator<RemoveCurrentUserAction> = (user) => ({
  type: REMOVE_CURRENT_USER,
  user: null
});
