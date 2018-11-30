import {Inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Store} from "redux";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppStore} from "../../store/app.store";
import {AppState} from "../../store/app.reducer";
import {Observable} from "rxjs/Observable";
import {User, UserInfo} from "../../shared/model/user-model";

@Injectable()
export class ProfileRepository {

  REST_URL = environment.REST_URL;

  constructor(private http: HttpClient, @Inject(AppStore) private store: Store<AppState>) { }

  updateProfileImage(userId: string, user: User): Observable<UserInfo> {
    return this.sendRequest('PUT', `${this.REST_URL}/profile/photo/${userId}`, user);
  }

  private sendRequest(verb: string, url: string, body?: any, params?: any): Observable<any> {

    let headers = null;
    // add JWT token with request headers
    const user = this.store.getState().user.currentUser;
    if (user != null) {
      headers = new HttpHeaders({ 'x-access-token': user.jwtToken, 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' })
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' })
    }

    return this.http.request(verb, url, {
      headers: headers,
      body: body,
      responseType: "json",
      params: new HttpParams({fromString: params})
    })
      .catch((error: Response) => Observable.throw(`Network Error: ${error.statusText} (${error.status})`));
  }

}
