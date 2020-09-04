import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { type } from 'os';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class BillingService {

  readonly rootURL = environment;
  readonly getInvoiceURL=this.rootURL.APIurl.URL+'/Payment/GetAllInvoices/';
  readonly getInvoicesMonthwiseURL=this.rootURL.APIurl.URL+'/Payment/GetInvoicesMonthwise/';
  readonly getInvoiceByDateURL=this.rootURL.APIurl.URL+'/Payment/GetInvoicesFromDate/';
  constructor(private http:HttpClient) { }

  getAllInvoices(data:any)
  {
    return this.http.get(this.getInvoiceURL,{params:{organizationId:data}});
  }
  getInvoicesMonthwise(data:any)
  {
    return this.http.get(this.getInvoicesMonthwiseURL,{params:{organizationId:data}});
  }
  async getTranctionsByDate(id,FromDate,ToDate){
    
    var fromDate=FromDate.getFullYear()+"-"+(FromDate.getMonth()+1)+"-"+FromDate.getDate();
    var toDate=ToDate.getFullYear()+"-"+(ToDate.getMonth()+1)+"-"+ToDate.getDate();
    console.log(fromDate +" "+toDate);
    return await this.http.get(this.getInvoiceByDateURL,{params:{fromDate:fromDate,toDate:toDate,organizationId:id}}).toPromise();
  }
}
