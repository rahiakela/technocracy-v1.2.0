/**
 * File Context : Central Application State Store
 * Author       : Rahi Akela
 * Date         : 04-03-2018
 * Description  : This is the only one central store that holds the entire application object state
 * */
import {InjectionToken} from "@angular/core";
import {compose, createStore, Store, StoreEnhancer} from "redux";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer} from 'redux-persist';
import { reduxSearch } from 'redux-search';
import {AppState, default as rootReducer} from "./app.reducer";

export const AppStore = new InjectionToken('App.store');

const devtools: StoreEnhancer<AppState> = window['devToolsExtension'] ? window['devToolsExtension']() : f => f;

const persistConfig = {
  key: 'root',
  storage: storage, // defaults to localStorage for web and AsyncStorage for react-native
  whitelist: ['user'] // only users will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function createAppStore(): Store<AppState> {
  const store = createStore<AppState>(persistedReducer, compose(devtools));
  persistStore(store);

  return store;
}

export const appStoreProviders = [
  { provide: AppStore, useFactory: createAppStore}
];

/*// Compose :reduxSearch with other store enhancers
const searchEnhancer = compose(
  reduxSearch({
    // Configure redux-search by telling it which resources to index for searching
    resourceIndexes: {
      // Blog will be searchable by :title and :author
      blogs: ['title', 'description']
    },
    // This selector is responsible for returning each collection of searchable resources
    resourceSelector: (resourceName, state) => {
      // all resources are stored in the state under a :resources Map
      // For example "blogs" are stored under state.resources.blogs
      return state.resources.get(resourceName);
    }
  })
);*/
