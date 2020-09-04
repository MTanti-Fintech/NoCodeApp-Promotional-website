import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {
 
    constructor(private http: HttpClient) {}

  
  forgotpassword(emailId) {
    return this.http.post<any>(`${environment.APIurl.URL}/User/forgotpassword`, { emailId });       
    }
}
