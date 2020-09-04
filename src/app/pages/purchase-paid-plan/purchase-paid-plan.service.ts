import { environment } from './../../../environments/environment';
import { CookieService } from './../../shared/cookie.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class PurchasePaidPlanService {
  //readonly rootURL = environment
  readonly rootURL = environment;
  addRemoteUserURL = this.rootURL.APIurl.URL + '/Employee/AddUser/';
  updateRemoteUserURL = this.rootURL.APIurl.URL + '/Employee/UpdateUserDetail/';
  deleteRemoteUserURL = this.rootURL.APIurl.URL + '/Employee/DeleteUser/';
  deleteRemoteUserDepartmentURL = this.rootURL.APIurl.URL + '/Employee/DeleteEmployeeFromDepartment/';
  getRemoteUserURL = this.rootURL.APIurl.URL + '/Employee/GetAllUsers/';
  getAllSoftwareURL = this.rootURL.APIurl.URL + '/Software/GetAllSoftwares/';
  getAllPlanURL = this.rootURL.APIurl.URL + '/Organization/GetAllPlans/';
  addPlanDetailURL = this.rootURL.APIurl.URL + '/Organization/AddPlanDetail/';
  getAllPItemListURL = this.rootURL.APIurl.URL + '/Payment/GetAllItems/';
  addSoftwareURL = this.rootURL.APIurl.URL + '/Software/AddSoftwares/';
  updateUsageProfileURL = this.rootURL.APIurl.URL + '/Employee/UpdateEmployeeUseageProfile/';

  constructor(private http: HttpClient, private Cookie: CookieService) {

  }
  addRemoteUser(data: any) {
    return this.http.post(this.addRemoteUserURL, data, { headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } });
  }
  updateUser(data: any) {
    return this.http.put(this.updateRemoteUserURL, data, { headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } });
  }
  deleteUser(data: any, deptid: any) {
    return this.http.post(this.deleteRemoteUserURL, '', { headers: { Authorization: this.Cookie.getCookie('usertoken').toString() }, params: { employeeId: data, departmentId: deptid } });
  }
  deleteUserDepartment(data: any, deptid: any) {
    return this.http.post(this.deleteRemoteUserDepartmentURL, '', { headers: { Authorization: this.Cookie.getCookie('usertoken').toString() }, params: { employeeId: data, departmentId: deptid } });
  }
  getAllUser(data: any) {
    return this.http.get(this.getRemoteUserURL, { headers: { Authorization: this.Cookie.getCookie('usertoken').toString() }, params: { organizationId: data } });
  }
  getAllSoftware() {
    return this.http.get(this.getAllSoftwareURL, { headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } });
  }
  async getAllPlans() {
    const response= await this.http.get(this.getAllPlanURL, { headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } }).toPromise();
    return response;
  }
  async getAllItemList() {
    const response=await this.http.get(this.getAllPItemListURL, { headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } }).toPromise();
    return response;
  }


  submitPlan(PlanDetail, InvoiceDetail,invoiceDate) {
    var Organization_Plan_Invoice = {
      planDetails: PlanDetail,
      itemList: InvoiceDetail,
      invoiceDetails:invoiceDate
    };
    console.log(typeof(PlanDetail.Expires_At));
    return this.http.post(this.addPlanDetailURL,Organization_Plan_Invoice, { responseType:'text',headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } });
    console.log(Organization_Plan_Invoice);
    //return this.http.post('',Organization_Plan_Invoice, { headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } });
  }
  updateUsageProfile(data){
    var remoteUserDetails={
      organization_Remote_Users_Id:Number(data.Organization_Remote_Users_Id),
      Usage_Profile:Number(data.Usage_Profile)
    }
    console.log(remoteUserDetails);
    return this.http.put(this.updateUsageProfileURL,remoteUserDetails,{ headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } });
  }
  addSotware(organizationId,softwareIdList)
  {
    var organization_software={
      organizationId:Number(organizationId),
      softwareIdList:[]=softwareIdList
    }
    console.log(organization_software);
    return this.http.post(this.addSoftwareURL,organization_software,{ headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } })
  }
}
