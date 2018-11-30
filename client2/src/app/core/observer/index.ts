import {UserAuthObserver} from "./user-auth-observer";
import {DataChangeObserver} from "./data-change-observer";
import {ShowHideModalObserver} from "./show-hide-modal-observer";
import {BlogStateObserver} from "./blog-state-observer";
import {QuestionStateObserver} from "./question-state-observer";

export const OBSERVERS: any = [
  UserAuthObserver,
  DataChangeObserver,
  ShowHideModalObserver,
  BlogStateObserver,
  QuestionStateObserver
];
