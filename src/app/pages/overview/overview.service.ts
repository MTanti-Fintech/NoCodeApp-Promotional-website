import { environment } from './../../../environments/environment';
import { CookieService } from './../../shared/cookie.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { planDetails } from 'src/app/shared/Dto/planDetails.DTO';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class OverviewService {
  constructor(private http:HttpClient,private Cookie: CookieService) { }
  readonly rootURL = environment;
  private readonly GetOrganizationDetailsURL=this.rootURL.APIurl.URL+'/Organization/GetOrganizationDetails/';
  private readonly GetOrganizationListURL=this.rootURL.APIurl.URL+'/Organization/GetAllOrganizations';
  private readonly GetAllAdminsURL=this.rootURL.APIurl.URL+'/Organization/GetAllAdmins/';
  private readonly editCodeURL=this.rootURL.APIurl.URL+'/Organization/UpdateOrganizationCode/';
  private readonly editSubsctiptionIdURL=this.rootURL.APIurl.URL+'/Organization/UpdateOrganizationSubscriptionId/';
  private readonly updatePlanUserURL = this.rootURL.APIurl.URL + '/Organization/UpdatePlanDetails';
  private readonly sendPlanUpdateStatus = this.rootURL.APIurl.URL + '/Organization/SendPlanStatusUpdate';
  private readonly updatePlanStatusURL = this.rootURL.APIurl.URL + '/Organization/UpdatePlanStatus';
  private readonly updatePlanExpiry = this.rootURL.APIurl.URL + '/Organization/UpdatePlanExpiry';
  private readonly GetUserProfileDetails = this.rootURL.APIurl.URL + '/User/GetUserProfileDetails';
  private readonly ChangeUserDetails = this.rootURL.APIurl.URL + '/User/ChangeUserDetails';
  
  private readonly BuyMoreUsersURL = this.rootURL.APIurl.URL + '/Organization/BuymoreUsers';
  private readonly updateWorkingModelURL = this.rootURL.APIurl.URL + '/Organization/UpdatePlanDays';
  private readonly changeWorkingModelURL = this.rootURL.APIurl.URL + '/Organization/UpdatePlanModel';

  addAdmin(user){
    return this.http.post(this.rootURL.APIurl.URL + '/Organization/AddAdmin',user,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}});
  }
  updateAdmin(user){
    return this.http.post(this.rootURL.APIurl.URL +'/Organization/UpdateAdminDetails',user,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}} );
  }
  GetOrganizationDetails(data:any)
  {
    return this.http.get(this.GetOrganizationDetailsURL,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params:{organizationId:data}});
  }
  getAllAdmins(){
    return this.http.get(this.GetAllAdminsURL,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString(),"Access-Control-Allow-Origin":"http://localhost:4200/"}});
  }
  getUserDetails(userId){
    return this.http.get(this.GetUserProfileDetails,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString(),"Access-Control-Allow-Origin":"http://localhost:4200/"},params:{userId:userId}});
  }
  resetPassword(data:any){
    data={
      UserEmail : data.EmailID
    }
    return this.http.post(this.rootURL.APIurl.URL+'/User/ForgotPassword',data,httpOptions)
  }
  changeStatus(details:any){
    var data ={
      is_Active : details.is_Active,
      Email : details.AdminEmail
    }

    return this.http.post(this.rootURL.APIurl.URL+'/Organization/DeleteAdmin','',{headers:{Authorization: this.Cookie.getCookie('usertoken').toString()},params : {is_Active:details.is_Active,Email:details.AdminEmail}});
  }
  getOrganizationList(id)
  {
       return this.http.get(this.GetOrganizationListURL,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params:{userId:id}});
  }
  editOrganizationCode(orgId,Code)
  {
    console.log(orgId+" "+Code);
    return this.http.put(this.editCodeURL,'',{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params:{organizationId:orgId,code:Code}});
  }
  editOrganizationSubsctiption(orgId,subId)
  {
    console.log(orgId+" "+subId);
    return this.http.put(this.editSubsctiptionIdURL,'',{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params:{organizationId:orgId,subId:subId}});
  }
  updatePlanStatus(Is_Active,orgId){
    return this.http.put(this.updatePlanStatusURL,'',{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params:{Is_Active:Is_Active,orgId : orgId}})
  }
  updatePlanUser(plan,orgId){
    var planRequest = {
      No_of_Users : plan.No_of_Users,
      Is_Active : plan.Is_Active,
      Organisation_Mst_Id : Number(orgId)
    }
    console.log(planRequest);
    return this.http.put(this.updatePlanUserURL,planRequest,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}})
  }
  changePlanExpiry(date,orgId){
    return this.http.put(this.updatePlanExpiry,'',{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params : {date:date,orgId:orgId}});
  }
  sendPlanActiveStatus(name,emailId){
    return this.http.get(this.sendPlanUpdateStatus,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params:{name:name,emailId:emailId}})
  }
  changeUserDetails(data){
    return this.http.post(this.ChangeUserDetails,data,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}});
  }
  async buyMoreUsers(PlanDetail, InvoiceDetail,invoiceDate) {
    var Organization_Plan_Invoice = {
      planDetails: PlanDetail,
      itemList: InvoiceDetail,
      invoiceDetails:invoiceDate
    };
    console.log(Organization_Plan_Invoice);
    return await this.http.post(this.BuyMoreUsersURL,Organization_Plan_Invoice, { responseType:'text',headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } }).toPromise();    
  }
  async updateWorkingModel(planId,orgId,StartTime,EndTime,days){
    var requestData={
      Organisation_Mst_Id:orgId,
      Start_Time:StartTime,
      End_Time:EndTime,
      Days:days,
      Plan_Type_Mst_Id:planId
    }
    console.log(requestData);
    return await this.http.put(this.updateWorkingModelURL,requestData, { responseType:'text',headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } }).toPromise();    
  }
  async changeWorkingModel(PlanDetail, InvoiceDetail,invoiceDate) {
    var Organization_Plan_Invoice = {
      planDetails: PlanDetail,
      itemList: InvoiceDetail,
      invoiceDetails:invoiceDate,
    };
    console.log(Organization_Plan_Invoice);
    // return await this.http.post('',Organization_Plan_Invoice, { responseType:'text',headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } }).toPromise();    
    return await this.http.put(this.changeWorkingModelURL,Organization_Plan_Invoice, { responseType:'text',headers: { Authorization: this.Cookie.getCookie('usertoken').toString() } }).toPromise();    
  }
}
