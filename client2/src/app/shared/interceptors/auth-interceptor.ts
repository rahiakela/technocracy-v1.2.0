import {Inject, Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Store} from "redux";
import {AppState} from "../../store/app.reducer";
import {AppStore} from "../../store/app.store";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  constructor(@Inject(AppStore) private store: Store<AppState>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq: any;

    // Get the JWT token from the store via user instance.
    const user = this.store.getState().user.currentUser;

    if (user != null) {
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      authReq = req.clone({
        // add JWT token with request headers
        headers: req.headers.set('x-access-token', user.jwtToken)
      });
    }

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
