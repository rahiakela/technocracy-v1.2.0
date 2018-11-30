/**
 * File Context : User Reducer-User State Branch
 * Author       : Rahi Akela
 * Date         : 04-03-2018
 * Description  : This branch of the state tree could hold information about the user and describes
 *                the state concerning user, how to modify it using given a particular action through the reducer,
 *                and the selectors.
 * */
import {Action} from 'redux';
import {createSelector} from 'reselect';
import {User} from '../../shared/model/user-model';
import * as UserActions from './user.actions';

export interface UserState {
  currentUser: User;
}

const initialState: UserState = {
  currentUser: null
};

export const UserReducer = (state: UserState = initialState, action: Action): UserState => {

  switch (action.type) {

    case UserActions.SET_CURRENT_USER:
      const setUser: User = (<UserActions.SetCurrentUserAction>action).user;
      return {
        currentUser: setUser
      };

    case UserActions.REMOVE_CURRENT_USER:
      const removeUser: User = (<UserActions.RemoveCurrentUserAction>action).user;
      return {
        currentUser: removeUser
      };

    default:
      return state;
  }
};

export const getUsersState = (state): UserState => state.user;

export const getCurrentUser = createSelector(getUsersState, (state: UserState) => state.currentUser);

