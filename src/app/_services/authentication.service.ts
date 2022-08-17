import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs'
import { User } from '../_models'
import { BackendService } from './backend.service'


const APP_USER_PROFILE = "CRM-APP"
@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient, private backend: BackendService) { }

  login(user: any) {
    return this.backend.login('token', user)
      .pipe(map((response: Response) => {
        let data = (<any>response);
        let user = <User>data.user;
        if (user && data.access_token) {
          user.token = data.access_token;
          user.isAuthenticated = true;
          localStorage.setItem(APP_USER_PROFILE, JSON.stringify(user));
        }
      }));
  }

  logout() {
    localStorage.removeItem(APP_USER_PROFILE);
  }

  isAuthenticated() {
    let user = this.getUser()
    return user && user.isAuthenticated ? true : false;
  }

  getUser() {
    let user = <User>JSON.parse(localStorage.getItem(APP_USER_PROFILE));
    return user;
  }

}
