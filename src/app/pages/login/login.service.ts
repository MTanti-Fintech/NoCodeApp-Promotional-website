import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from '../../shared/cookie.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
declare var require: any;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8'
  })
};
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient,
    private snackBar: MatSnackBar,
    private Cookie: CookieService) { }

  readonly rootURL = environment;

  userlogin(emailId, password) {
    var loginParameters = {
      "emailId": emailId,
      "password": password
    }
    return this.http.post(this.rootURL.APIurl.URL + '/User/SignIn', loginParameters);
  }
  async getUserPermission() {
    return 1;
  }
  userlogout() {
    return this.http.post(this.rootURL.APIurl.URL + '/account/logout', '', {
      headers: new HttpHeaders({
        Authorization: this.Cookie.getCookie('usertoken').toString()
      }),
    });
  }
  forgotPasswordRequest(data: string) {
    let forgotPasswordParameter = {
      'UserEmail': data
    };
    return this.http.post<any>(this.rootURL.APIurl.URL + '/User/ForgotPassword', forgotPasswordParameter, httpOptions);
  }
}
