import { HttpClient, HttpHeaders,  } from '@angular/common/http';
import { Injectable } from '@angular/core';





const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  @Injectable({
    providedIn: 'root'
  })
export class SignUpService {
  constructor(private http: HttpClient) { }
    readonly rootURL = require('config.json');

public CreateOrganization(organizationDetails: any) {
  // var organizationDetails = {
  //   organization : {
  //     Domain : data.OrganizationDomain,
  //     Communication_Email : data.CommunicationEmail
  //   },
  //   userDetails:{
  //     First_Name : data.Firstname,
  //     Last_Name : data.Lastname,
  //     ComminicationEmail : data.ComminicationEmail
  //   },

  // }

      return this.http.post(this.rootURL.APIurl.URL + '/Organization/CreateOrganization', organizationDetails, {
      });
}
}
