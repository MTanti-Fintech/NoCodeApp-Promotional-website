import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,  } from '@angular/common/http';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'    
    })
  };
@Injectable({
    providedIn: 'root'
})
export class ResetPasswordService {
    constructor(private http: HttpClient) { }
    readonly rootURL = environment;

public generateOTP(data) {
        return this.http.post(this.rootURL.APIurl.URL + '/User/SendResetPasswordOtp', data, {
        });
}

public validateToken(token: string) {      
        return this.http.post(this.rootURL.APIurl.URL + '/User/ValidateForgotPasswordToken', '"' + token + '"', 
        httpOptions);
}

public resetPassword(data: any) {
        return this.http.post(this.rootURL.APIurl.URL + '/User/ResetPassword', data, {
        });
}
}
