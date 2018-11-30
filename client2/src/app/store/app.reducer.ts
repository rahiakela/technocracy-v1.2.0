/**
 * File Context : App Root Reducer
 * Author       : Rahi Akela
 * Date         : 04/03/2018
 * Description  : This is the Root Reducer that shapes the central state of application
 * */
import {combineReducers, Reducer} from "redux";
import {UserReducer, UserState} from "./user/user.reducer";
import {BlogReducer, BlogState} from "./blog/blog.reducer";
import {QuestionReducer, QuestionState} from "./question/question.reducer";
import {StatisticsReducer, StatisticsState} from "./statistics/statistics.reducer";

// The Root State
export interface AppState {
  user: UserState,
  blog: BlogState,
  question: QuestionState,
  statistics: StatisticsState
}

// The Root Reducer
const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  user: UserReducer,
  blog: BlogReducer,
  question: QuestionReducer,
  statistics: StatisticsReducer
  // search: SearchReducer // Configure reducer to store state at state.search
});

// make store as observable
// const rootReducer$: Reducer<AppState> = from(rootReducer);

export default rootReducer;
