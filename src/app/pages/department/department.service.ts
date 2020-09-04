import { CookieService } from './../../shared/cookie.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  readonly rootURL = environment;
  readonly addDepartmentURL=this.rootURL.APIurl.URL+'/Department/AddDepartments/';
  readonly editDepartmentURL=this.rootURL.APIurl.URL+'/Department/UpdateDepartment/';
  readonly deleteDepartmentURL=this.rootURL.APIurl.URL+'/Department/DeleteDepartments/';
  readonly getDepartmentURL=this.rootURL.APIurl.URL+'/Department/GetAllDepartments/';
  constructor(private http:HttpClient,private Cookie: CookieService) { }
  addDepartment(data:any)
  {
    return this.http.post(this.addDepartmentURL,data,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}});
  }
  editDepartment(data:any)
  {
    return this.http.post(this.editDepartmentURL,data,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}});
  }
  deleteDepartment(departmentId:number)
  {
    return this.http.post(this.deleteDepartmentURL,departmentId,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}});
  }
  getAllDepartments(data:any)
  {
    return this.http.get(this.getDepartmentURL,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params:{organizationId:data}});
  }
}
