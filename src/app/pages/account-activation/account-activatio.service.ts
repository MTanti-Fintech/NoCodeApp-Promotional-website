import { Injectable } from '@angular/core';
import { CookieService } from 'src/app/shared/cookie.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'    
    })
  };
@Injectable({
    providedIn: 'root'
})
export class AccountActivationService {
    constructor(private http: HttpClient, private cookieService: CookieService) { }
    readonly rootURL = environment;

    public generateOTP(activationCodeParameter) {
        
        return this.http.post(this.rootURL.APIurl.URL + '/User/SendResetPasswordOtp', activationCodeParameter, {
            headers: new HttpHeaders(
                {
                    Authorization: this.cookieService.getCookie('usertoken').toString()
                }),
        });
    }
    public generateLink(activationCodeParameter) {
        
        return this.http.post(this.rootURL.APIurl.URL + '/User/SendResetPasswordOtp', activationCodeParameter, {
            headers: new HttpHeaders(
                {
                    Authorization: this.cookieService.getCookie('usertoken').toString()
                }),
        });
    }
    public validateToken(token) {

        
        return this.http.post(this.rootURL.APIurl.URL + '/User/ValidateForgotPasswordToken/', '"' + token + '"', 
        httpOptions);
    }
    public changePassword(data) {
        return this.http.post(this.rootURL.APIurl.URL + '/User/ResetPassword', data,{headers:{ Authorization: this.cookieService.getCookie('usertoken').toString()}});
    }

    ActivationLinkRequest(data: string) {
       var forgotPasswordParameter = {
         "UserEmail": data 
       }
         return this.http.post<any>(this.rootURL.APIurl.URL + '/User/ForgotPassword', forgotPasswordParameter, httpOptions);
       }
    public addFreePlan(email){
        var Organization = {
            AdminEmail : email
        }
        return this.http.post(this.rootURL.APIurl.URL + '/Organization/OrganizationActivation', Organization, {headers:{ Authorization: this.cookieService.getCookie('usertoken').toString()}});
    }
}
