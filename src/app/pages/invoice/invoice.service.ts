import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'src/app/shared/cookie.service';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  readonly rootURL = environment;
  readonly getInvoiceURL=this.rootURL.APIurl.URL+'/Payment/GetInvoiceItems/';
  readonly deleteInvoiceItemURL=this.rootURL.APIurl.URL+'/Payment/DeleteInvoiceItem/';
  readonly getAllPItemListURL = this.rootURL.APIurl.URL + '/Payment/GetAllItems/';
  readonly addItemURL = this.rootURL.APIurl.URL + '/Payment/AddInvoiceItem/';
  readonly editItemURL = this.rootURL.APIurl.URL + '/Payment/EditInvoiceItem/';
  readonly getTransactionsURL=this.rootURL.APIurl.URL+'/Payment/GetAllTransactions/';
  readonly updateInvoiceStatusURL=this.rootURL.APIurl.URL+'/Payment/UpdateInvoiceStatus/';
  readonly deleteTransactionURL=this.rootURL.APIurl.URL+'/Payment/DeleteTransaction/';
  readonly addTransactionURL = this.rootURL.APIurl.URL + '/Payment/AddTransaction/';
  readonly updateTransactionURL = this.rootURL.APIurl.URL + '/Payment/UpdateTransaction/';

  constructor(private http:HttpClient,private Cookie: CookieService) { }

  async getInvoiceItems(invoiceId)
  {
    const reponse = await this.http.get(this.getInvoiceURL,{params:{invoiceId:invoiceId}}).toPromise();
    return reponse;
  }
  deleteInvoiceItem(invoiceId, itemId)
  {
    return this.http.put(this.deleteInvoiceItemURL,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}},{params: {invoiceId:invoiceId, itemId :itemId}});
  }
  getAllItemList(){
    return this.http.get(this.getAllPItemListURL,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}});
  }
  addInvoiceItem(data){
    return this.http.post(this.addItemURL, data ,{});
  }
  editInvoiceItem(data){
    return this.http.post(this.editItemURL, data ,{});
  }
  async getAllTransactions(data:any)
  {
    return await this.http.get(this.getTransactionsURL , {params:{invoiceId:data}}).toPromise();
  }
  updateInvoiceStatus(invoiceId, Status)
  {
    return this.http.put(this.updateInvoiceStatusURL,'',{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params:{Organization_Invoice_Id:invoiceId, Status :Status}});
  }
  deleteTransaction(transactionId, paymentId)
  {
    return this.http.put(this.deleteTransactionURL,'',{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()},params:{Payment_Transaction_Dtl_Id:transactionId, Payment_Id :paymentId}});
  }
  addTransaction(data){
    return this.http.post(this.addTransactionURL, data ,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}});
  }
  udpateTransaction(data){
    return this.http.put(this.updateTransactionURL, data ,{headers:{ Authorization: this.Cookie.getCookie('usertoken').toString()}});
  }
}
