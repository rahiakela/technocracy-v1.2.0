/**
 * File Context : Statics Action
 * Author       : Rahi Akela
 * Date         : 04-07-2018
 * Description  : This file list out all the actions that specifies actions creators concerning Statics
 * */
import {Action, ActionCreator} from "redux";
import {Statistics} from "../../shared/model/statistics";

export const ADD_STATISTICS = '[Statistics] Add';
export const UPDATE_STATISTICS = '[Statistics] Update';
export const RESET_STATISTICS = '[Selected Statistics] Reset';
export const UPDATE_STATISTICS_STATE = '[Statistics State] Update';

export interface StatisticsAction extends Action {
  statistics: Statistics;
}
export interface UpdateStatisticsAction extends Action {
  data: number;
  actionType?: string;
}
export interface ResetStatisticsAction extends Action {
  statistics: Statistics;
}

export const addStatistics: ActionCreator<StatisticsAction> = (statistics) => ({
  type: ADD_STATISTICS,
  statistics: statistics
});

export const updateStatistics: ActionCreator<UpdateStatisticsAction> = (data, type) => ({
  type: UPDATE_STATISTICS,
  actionType: type,
  data: data
});
export const resetStatistics: ActionCreator<ResetStatisticsAction> = (statistics) => ({
  type: RESET_STATISTICS,
  statistics: statistics
});
export const updateStatisticsState: ActionCreator<Action> = () => ({
  type: UPDATE_STATISTICS_STATE
});

