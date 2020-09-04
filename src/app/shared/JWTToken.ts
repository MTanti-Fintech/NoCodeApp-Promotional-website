import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class JWTToken {

    constructor(){}
    parseJWTToken(token){
      return jwt_decode(token); 
    }
}