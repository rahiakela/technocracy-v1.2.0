/**
 * File Context : Question Action
 * Author       : Rahi Akela
 * Date         : 04-03-2018
 * Description  : This list out all the actions that specifies actions creators concerning Question
 * */
import {Action, ActionCreator} from "redux";
import {Question} from "../../shared/model/question-model";

export const ADD_QUESTION = '[Questions] Add';
export const UPDATE_QUESTION = '[Question State] Update';
export const SET_SELECTED_QUESTION = '[Selected Question] Set';
export const RESET_SELECTED_QUESTION = '[Selected Question] Reset';
export const SET_QUESTION_LIST = '[Question List] Set';
export const SET_PENDING_QUESTION_LIST = '[Pending Question List] Set';
export const UPDATE_PENDING_QUESTION_LIST = '[Pending Question List] Update';
export const RESET_QUESTION_LIST = '[Question List] Reset';
export const UPDATE_QUESTION_LIST = '[Question List] Update';
export const DELETE_ITEM_FROM_QUESTION_LIST = '[Question List] Delete Item';
export const SEARCH_QUESTION = '[Question] Search';

export interface QuestionAction extends Action {
  questions: Question[];
}
export interface SetQuestionAction extends Action {
  questionId: string;
  setFor?: string;
}
export interface ResetQuestionAction extends Action {
  question: Question;
}
export interface SearchQuestionAction extends Action {
  keyword: string;
}

export const addQuestions: ActionCreator<QuestionAction> = (questions) => ({
  type: ADD_QUESTION,
  questions: questions
});

export const updateQuestionState: ActionCreator<Action> = () => ({
  type: UPDATE_QUESTION
});

export const setSelectedQuestion: ActionCreator<SetQuestionAction> = (questionId, setFor) => ({
  type: SET_SELECTED_QUESTION,
  setFor: setFor,
  questionId: questionId
});

export const resetSelectedQuestion: ActionCreator<ResetQuestionAction> = (question) => ({
  type: RESET_SELECTED_QUESTION,
  question: question
});

export const setQuestionList: ActionCreator<QuestionAction> = (questions) => ({
  type: SET_QUESTION_LIST,
  questions: questions
});

export const resetQuestionList: ActionCreator<QuestionAction> = (questions) => ({
  type: RESET_QUESTION_LIST,
  questions: questions
});

export const updateQuestionList: ActionCreator<ResetQuestionAction> = (question) => ({
  type: UPDATE_QUESTION_LIST,
  question: question
});

export const deleteItemFromQuestionList: ActionCreator<ResetQuestionAction> = (question) => ({
  type: DELETE_ITEM_FROM_QUESTION_LIST,
  question: question
});

export const setPendingQuestionList: ActionCreator<QuestionAction> = (questions) => ({
  type: SET_PENDING_QUESTION_LIST,
  questions: questions
});

export const updatePendingQuestionList: ActionCreator<ResetQuestionAction> = (question) => ({
  type: UPDATE_PENDING_QUESTION_LIST,
  question: question
});

export const searchQuestion: ActionCreator<SearchQuestionAction> = (keyword) => ({
  type: SEARCH_QUESTION,
  keyword: keyword
});

