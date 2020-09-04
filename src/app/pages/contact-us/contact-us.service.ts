import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ContactUsService {
  constructor(private http: HttpClient) {}
    
   sendContactUsGoogleForm(ContactUsFormData){
     const formdata= new FormData();
     formdata.append('entry.100872631',ContactUsFormData.firstname);
     formdata.append('entry.1505562477',ContactUsFormData.lastname);
     formdata.append('entry.691160375',ContactUsFormData.email);
     formdata.append('entry.1692966316',ContactUsFormData.messege);
  
      return this.http.post
      ('https://docs.google.com/forms/u/0/d/e/1FAIpQLSeiQEzTOMiD5wpeKxlKlo7BZMwMPEBx-eBYOsFdNZ-7KeYFoQ/formResponse',
      formdata);
   }
    sendOnboardingGoogleForm(OnBoardFormData){
      const formdata= new FormData();
       formdata.append('entry.721138157',OnBoardFormData.sizeOfOrganization);
       formdata.append('entry.1227901969',OnBoardFormData.lightUsage);
       formdata.append('entry.292162447',OnBoardFormData.mediumUsage);
       formdata.append('entry.146848158',OnBoardFormData.largeUsage);
       formdata.append('entry.1856651095',OnBoardFormData.officeOrDomain);
       formdata.append('entry.2120506934',OnBoardFormData.location);
       formdata.append('entry.1340586078',OnBoardFormData.contactNo);
       formdata.append('entry.171812630_hour',String(OnBoardFormData.time).split(':')[0]);
       formdata.append('entry.171812630_minute',String(OnBoardFormData.time).split(':')[1]);
       formdata.append('entry.879050699',OnBoardFormData.comments);
       formdata.append('entry.1185927544',OnBoardFormData.otherSetup);
       

      return this.http.post
      ('https://docs.google.com/forms/u/0/d/e/1FAIpQLSdvEdRahjkDz2K879vtyp-Nhs4h-fzo6lMkAsRvWtj9Yj3fbg/formResponse',
      formdata);
    }
}
