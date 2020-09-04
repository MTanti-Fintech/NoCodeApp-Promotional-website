import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ErrorhandlerService {

  constructor() { }

  handleError(err) {
      // 

       if (err.status >= 400 && err.status < 500) {
        //  
        //  
       } else  {
      //  
       // 
       }

  }
}
