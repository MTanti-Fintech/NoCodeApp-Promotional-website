import { CookieService } from './../../shared/cookie.service';
import { HttpClient, HttpHeaders,  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'    
    })
  };
@Injectable({
    providedIn: 'root'
})
export class SignUpService {
  constructor(private http: HttpClient,private Cookie: CookieService) { }
    readonly rootURL = environment;

public CreateOrganization(organizationDetails: any) {
  console.log("called");
  console.log(organizationDetails);
      return this.http.post(this.rootURL.APIurl.URL + '/Organization/CreateOrganization', organizationDetails, {headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}});
}
public SignUpOrganization(organizationDetails: any) {
  console.log("called");
  console.log(organizationDetails);
      return this.http.post(this.rootURL.APIurl.URL + '/Organization/SignUpOrganization', organizationDetails, {headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}});
}
public checkDomain(domain: any) {
  console.log("called");
  console.log(domain);
      return this.http.get(this.rootURL.APIurl.URL + '/Organization/CheckDomain', {headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params:{domain:domain}});
}

}