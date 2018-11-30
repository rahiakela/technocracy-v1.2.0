/**
 * File Context : Statics Reducer State Branch
 * Author       : Rahi Akela
 * Date         : 04-07-2018
 * Description  : This branch of the state tree could hold information about all of the statistics and describes
 *                the state concerning statistics, how to modify it using given a particular action through the reducer,
 *                and the selectors.
 * */
import {Action} from "redux";
import * as StatisticsActions from "./statistics.actions";
import {Statistics} from "../../shared/model/statistics";

export interface StatisticsState {
  statistics: Statistics;
}

const initialState: StatisticsState = {
  statistics: {}
};

/**
 * The `StatisticsReducer` describes how to modify the `StatisticsState` given a particular action.
 */
export const StatisticsReducer = (state: StatisticsState = initialState, action: Action): StatisticsState => {

  switch (action.type) {

    case StatisticsActions.ADD_STATISTICS:
      const statistics = (<StatisticsActions.StatisticsAction>action).statistics;

      return {
        statistics: statistics
      };

    case StatisticsActions.UPDATE_STATISTICS:
      let staticsToUpdate = {};
      const data = (<StatisticsActions.UpdateStatisticsAction>action).data;
      const type = (<StatisticsActions.UpdateStatisticsAction>action).actionType;

      switch (type) {
        case 'totalBlog':
          let  totalBlog = {};
          totalBlog = {totalBlog: state.statistics.totalBlog + data};
          staticsToUpdate = Object.assign(state.statistics.totalBlog, totalBlog);
          break;
        case 'totalQuestion' :
          let  totalQuestion = {};
          totalQuestion = {totalQuestion: state.statistics.totalQuestion + data};
          staticsToUpdate = Object.assign(state.statistics.totalQuestion, totalQuestion);
          break;
        case 'totalPendingBlog':
          let  totalPendingBlog = {};
          totalPendingBlog = {totalPendingBlog: state.statistics.totalPendingBlog + data};
          staticsToUpdate = Object.assign(state.statistics.totalPendingBlog, totalPendingBlog);
          break;
        case 'totalPendingQuestion' :
          let  totalPendingQuestion = {};
          totalPendingQuestion = {totalPendingQuestion: state.statistics.totalPendingQuestion + data};
          staticsToUpdate = Object.assign(state.statistics.totalPendingQuestion, totalPendingQuestion);
          break;
        case 'totalFollowers' :
          let  totalFollowers = {};
          totalFollowers = {totalFollowers: state.statistics.totalFollowers + data};
          staticsToUpdate = Object.assign(state.statistics.totalFollowers, totalFollowers);
          break;
        case 'totalFollowing' :
          let  totalFollowing = {};
          totalFollowing = {totalFollowing: state.statistics.totalFollowing + data};
          staticsToUpdate = Object.assign(state.statistics.totalFollowing, totalFollowing);
          break;
      }

      return {
        statistics: Object.assign(state.statistics, staticsToUpdate)
      };

    case StatisticsActions.RESET_STATISTICS:
      // get Statics payload from action
      const resetStatics = (<StatisticsActions.ResetStatisticsAction>action).statistics;

      return {
        statistics: Object.assign(state.statistics, resetStatics) // update state of statistics of store
      };

    case StatisticsActions.UPDATE_STATISTICS_STATE:
      // clear statistics after logout
      return {
        statistics: {}
      };

    default:
      return state;
  }
};

