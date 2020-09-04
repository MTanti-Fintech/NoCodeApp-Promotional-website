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
export class EmployeeService {
    constructor(private http: HttpClient, private cookieService: CookieService) { }
    readonly rootURL = environment;
    httpHeader = {
      headers: new HttpHeaders({
          Authorization: this.cookieService.getCookie('usertoken').toString()
      }),
  };
public AddEmployee(data: any) {
      return this.http.post(this.rootURL.APIurl.URL + '/Employee/AddUser', data, {headers:{ Authorization: this.cookieService.getCookie('usertoken').toString()}});
}
public DeleteEmployee(data: any) {
  return this.http.post(this.rootURL.APIurl.URL + '/Employee/DeleteUser', '', {headers:{ Authorization: this.cookieService.getCookie('usertoken').toString()},params:{employeeId:data.Organization_Remote_Users_Id,departmentId:data.departmentId}});
}
public UpdateEmployeeDetails(data: any) {
  return this.http.post(this.rootURL.APIurl.URL + '/Employee/UpdateUserDetail', data,{headers:{ Authorization: this.cookieService.getCookie('usertoken').toString()}} );
}
public DisableEmployee(status,employeid) {
  return this.http.put(this.rootURL.APIurl.URL + '/Employee/DisableUser', '', {headers:{ Authorization: this.cookieService.getCookie('usertoken').toString()},params:{Is_Enable:status,employeeId:employeid}});
}
public UpdateEmployeePassword(data: any) {
    return this.http.post(this.rootURL.APIurl.URL + '/Employee/UpdateUserPassword', data, {headers:{ Authorization: this.cookieService.getCookie('usertoken').toString()}});
}
public changeAzureStatus(status,employeeId){
  return this.http.put(this.rootURL.APIurl.URL + '/Employee/ChangeEmployeeAzureStatus', '', {headers:{ Authorization: this.cookieService.getCookie('usertoken').toString()},params:{Azure_Status:status,employeeId:employeeId}});
}

public GetAllEmployees(data: any) {
  var OrganizationDetailsReponse = {
    organization_Mst_Id: Number,
    Domain: String,
    Code: String,
    subscription_id: String,
    Communication_Email: String
  }
  
  OrganizationDetailsReponse.organization_Mst_Id = data;
  return this.http.get(this.rootURL.APIurl.URL + '/Employee/GetAllUsers',{params : {organizationId :data}});
}
public postMultipleOnPremisesUser(onPremisesUsers) {
  return this.http.post(this.rootURL.APIurl.URL + '/Employee/AddMultipleEmployee', onPremisesUsers, this.httpHeader);
}
public getTotalUsers(orgId){
  return this.http.get(this.rootURL.APIurl.URL + '/Employee/TotalUsers',{params : {orgId :orgId}});
}
public sendPasswordMail(data){
  return this.http.post(this.rootURL.APIurl.URL + '/Employee/AddEmployeePassword', data, this.httpHeader);
}

}