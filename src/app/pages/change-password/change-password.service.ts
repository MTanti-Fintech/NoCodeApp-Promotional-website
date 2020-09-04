import { Injectable } from '@angular/core';
import { CookieService } from '../../shared/cookie.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ChangePasswordService {
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

    public changePassword(data: any) {
        return this.http.post(this.rootURL.APIurl.URL + '/User/ChangePassword', data, {
            headers: new HttpHeaders(
                {
                    Authorization: this.cookieService.getCookie('usertoken').toString()
                }),
        });
    }
}
