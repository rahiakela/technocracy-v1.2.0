/**
 * File Context : Question Reducer-Question State Branch
 * Author       : Rahi Akela
 * Date         : 04-03-2018
 * Description  : This branch of the state tree could hold information about all of the question and describes
 *                the state concerning question, how to modify it using given a particular action through the reducer,
 *                and the selectors.
 * */
import {Question} from "../../shared/model/question-model";
import {Action} from "redux";
import * as QuestionActions from './question.actions';
import * as BlogActions from "../blog/blog.actions";

export interface QuestionState {
  selectedQuestion: Question,
  questions: Question[];
  questionList: Question[];
  pendingQuestionList: Question[];
  filteredQuestion: Question[];
}

export const initialState: QuestionState = {
  selectedQuestion: {},
  questions: [],
  questionList: [],
  pendingQuestionList: [],
  filteredQuestion: []
};

/**
 * The `QuestionReducer` describes how to modify the `QuestionState` given a particular action.
 */
export const QuestionReducer = (state: QuestionState = initialState, action: Action): QuestionState => {

  switch (action.type) {

    case QuestionActions.ADD_QUESTION:
      const questions = (<QuestionActions.QuestionAction>action).questions;

      return {
        questions: questions,
        selectedQuestion: state.selectedQuestion,
        questionList: state.questionList,
        pendingQuestionList: state.pendingQuestionList,
        filteredQuestion: state.filteredQuestion
      };

    case QuestionActions.UPDATE_QUESTION:
      // only questions is required after logout
      return {
        questions: state.questions,
        selectedQuestion: {},
        questionList: [],
        pendingQuestionList: [],
        filteredQuestion: []
      };

    case QuestionActions.SET_SELECTED_QUESTION:
      let selectedQuestion = {};
      // set selected question
      const questionId = (<QuestionActions.SetQuestionAction>action).questionId;
      const setFor = (<QuestionActions.SetQuestionAction>action).setFor;
      // query question from questions array using question id based on set parameter
      if (setFor === 'dpp_view') {
        selectedQuestion = state.questionList.find(question => question._id === questionId);
      } else if (setFor === 'p_q_view') {
        selectedQuestion = state.pendingQuestionList.find(question => question._id === questionId);
      } else {
        selectedQuestion = state.questions.find(question => question._id === questionId);
      }

      return {
        questions: state.questions,
        selectedQuestion: selectedQuestion,
        questionList: state.questionList,
        pendingQuestionList: state.pendingQuestionList,
        filteredQuestion: state.filteredQuestion
      };

    case QuestionActions.RESET_SELECTED_QUESTION:
      // get question payload from action
      const resetQuestion = (<QuestionActions.ResetQuestionAction>action).question;
      // update state question array of store
      const resetQuestions = state.questions.map(question => {
        if (question._id === resetQuestion._id) {
          return {...question, ...resetQuestion};
        }
        return question;
      });
      return {
        questions: resetQuestions,
        selectedQuestion: resetQuestion,
        questionList: state.questionList,
        pendingQuestionList: state.pendingQuestionList,
        filteredQuestion: state.filteredQuestion
      };

    case QuestionActions.SET_QUESTION_LIST:
      const questionList = (<QuestionActions.QuestionAction>action).questions;
      return {
        questions: state.questions,
        selectedQuestion: state.selectedQuestion,
        questionList: questionList,
        pendingQuestionList: state.pendingQuestionList,
        filteredQuestion: state.filteredQuestion
      };

    case QuestionActions.RESET_QUESTION_LIST:
      const resetQuestionList = (<QuestionActions.QuestionAction>action).questions;
      return {
        questions: state.questions,
        selectedQuestion: state.selectedQuestion,
        questionList: resetQuestionList,
        pendingQuestionList: state.pendingQuestionList,
        filteredQuestion: state.filteredQuestion
      };

    case QuestionActions.UPDATE_QUESTION_LIST:
      const updateQuestion = (<QuestionActions.ResetQuestionAction>action).question;
      // remove old question from question list
      const filteredQuestionList = state.questionList.filter(question => question._id !== updateQuestion._id);

      return {
        questions: state.questions,
        selectedQuestion: state.selectedQuestion,
        questionList: filteredQuestionList.concat(updateQuestion), // update question list with updated one
        pendingQuestionList: state.pendingQuestionList,
        filteredQuestion: state.filteredQuestion
      };

    case QuestionActions.DELETE_ITEM_FROM_QUESTION_LIST:
      const deletedQuestion = (<QuestionActions.ResetQuestionAction>action).question;
      // remove deleted question from question list
      const updatedQuestionList = state.questionList.filter(question => question._id !== deletedQuestion._id);

      return {
        questions: state.questions,
        selectedQuestion: state.selectedQuestion,
        questionList: updatedQuestionList, // update question list after removing deleted one
        pendingQuestionList: state.pendingQuestionList,
        filteredQuestion: state.filteredQuestion
      };

    case QuestionActions.SET_PENDING_QUESTION_LIST:
      const pendingQuestionList = (<QuestionActions.QuestionAction>action).questions;

      return {
        questions: state.questions,
        selectedQuestion: state.selectedQuestion,
        questionList: state.questionList,
        pendingQuestionList: pendingQuestionList,
        filteredQuestion: state.filteredQuestion
      };

    case QuestionActions.UPDATE_PENDING_QUESTION_LIST:
      const updatedPendingQuestion = (<QuestionActions.ResetQuestionAction>action).question;
      // remove old question from pending question list
      const filteredPendingQuestionList = state.pendingQuestionList.filter(q => q._id !== updatedPendingQuestion._id);
      return {
        questions: state.questions,
        selectedQuestion: state.selectedQuestion,
        questionList: state.questionList,
        pendingQuestionList: filteredPendingQuestionList, // update pending question list
        filteredQuestion: state.filteredQuestion
      };

    case QuestionActions.SEARCH_QUESTION:
      const keyword = (<QuestionActions.SearchQuestionAction>action).keyword;
      // search question from question list array using status keyword
      const filteredQuestion = state.questionList.filter(question => question.status === keyword);
      return {
        questions: state.questions,
        selectedQuestion: selectedQuestion,
        questionList: state.questionList,
        pendingQuestionList: state.pendingQuestionList,
        filteredQuestion: filteredQuestion
      };

    default:
      return state;
  }
};
