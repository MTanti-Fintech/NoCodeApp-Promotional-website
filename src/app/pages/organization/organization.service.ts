import { Injectable } from '@angular/core';
import { CookieService } from 'src/app/shared/cookie.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json' ,
    //   'Authorization': 'this.cookieService.getCookie('usertoken').toString()'
    })
  };
@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    constructor(private http: HttpClient, private cookieService: CookieService) { }
    readonly rootURL = environment

public AddEmployee(data: any) {
      return this.http.post(this.rootURL.APIurl.URL + '/Employee/AddUser', data, {
      });
}
public DeleteEmployee(data: any) {
  return this.http.post(this.rootURL.APIurl.URL + '/Employee/DeleteUser', data, {
  });
}
public UpdateEmployeeDetails(data: any) {
  return this.http.post(this.rootURL.APIurl.URL + '/Employee/UpdateUserDetail', data, {
  });
}
public DisableEmployee(data: any) {
  return this.http.post(this.rootURL.APIurl.URL + '/Employee/DisableUser', data, {
  });
}
public UpdateEmployeePassword(data: any) {
    return this.http.post(this.rootURL.APIurl.URL + '/Employee/UpdateUserPassword', data, {
  });
}
changeStatus (status,orgId){
  return this.http.post<any>(this.rootURL.APIurl.URL + '/Organization/DisableOrganization/','',{
    headers: new HttpHeaders(
        {
          'Authorization': this.cookieService.getCookie('usertoken').toString(),
        }),params:{is_Active:status,orgId:orgId}
});
}
public GetAllOrganization(data: any) {
   return this.http.get<any>(this.rootURL.APIurl.URL + '/Organization/GetAllOrganizations/',{
    headers: new HttpHeaders(
        {
            'Authorization': this.cookieService.getCookie('usertoken').toString(),
        }),
});
}
public updateOrganization(data: any) {

  return this.http.post<any>(this.rootURL.APIurl.URL + '/Organization/UpdateOrganizationDetails/',data,{
   headers: new HttpHeaders(
       {
           'Authorization': this.cookieService.getCookie('usertoken').toString(),
       }),
});
}
}
