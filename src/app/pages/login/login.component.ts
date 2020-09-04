import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as sha512 from 'js-sha512';
import { CookieService } from '../../shared/cookie.service';
import { LoginService } from './login.service';
import { CommonService } from '../../shared/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { JWTToken } from 'src/app/shared/jwtToken';
import { Router } from '@angular/router';
import { ChangePassPopupComponent } from 'src/app/shared/office-bcp-header/office-bcp-header.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  submitted = false;
  forgetPass = false;
  options = {
    id : 'loginAlert',
    autoClose: true,
    keepAfterRouteChange: false
};
  constructor(
    private service: LoginService,
    private router: Router,
    private commonservice: CommonService,
    private Cookie: CookieService,
    private appmethod: AppComponent,
    private jwtToken : JWTToken,
    public dialog: MatDialog,
    ) {
  }
  userInfo:any;
  show=false;
  readonly config = environment;
  ngOnInit() {
    // this.appmethod.callingmethod();
    if (this.Cookie.getCookie('usertoken') != "" && this.Cookie.getCookie('usertoken') != null) {
      this.userInfo = this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
      if (this.userInfo.EmailId != null && this.userInfo.EmailId != undefined) {
        if(this.userInfo.MustChangePasswordFlag == "1"){
          this.commonservice.openSnackBarSuccess('You need to change your password','X');
          const dialogRef = this.dialog.open(ChangePassPopupComponent, { data: { userInfo: this.userInfo } }).afterClosed().subscribe((res)=>{
            if(res){
              this.router.navigate(['/overview']);
            }
          })
        }
        else{
          this.router.navigateByUrl('/overview');
        }
        
      }
    }
  }

  openForgetPass() {
    this.forgetPass = true;
  }
  backToLogin() {
    this.forgetPass = false;
  }
  password() {
    this.show = !this.show;
}
  onBlurMethod (event:any){
    if(event.target.value != ''){
      event.target.classList.add('has-val');
    }
    else {
      event.target.classList.remove('has-val');
    }
  }
  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      return;
    }
    try {
    this.service.userlogin(form.value.Username, sha512.sha512(form.value.Password)).subscribe(
      async (data: any) => {
        // 

      if(data)
      {
        if(data.IsSuccess == true)
        {
          this.userInfo =  this.jwtToken.parseJWTToken(data.Token);
          this.Cookie.setCookie('usertoken', data.Token);
          if(this.userInfo.MustChangePasswordFlag == "1"){
            this.commonservice.openSnackBarSuccess('You need to change your password','X');
            const dialogRef = this.dialog.open(ChangePassPopupComponent, { data: { userInfo: this.userInfo } }).afterClosed().subscribe((res)=>{
              if(res){
                this.router.navigate(['/overview']);
              }
            })
          }
          else {
            this.commonservice.openSnackBarSuccess('You have been logged in successfully','X');
            this.router.navigate(['/overview']);
          }
       }
       else
       {
        this.commonservice.openSnackBarError(data.Message, 'X');
       }
      }
       else{
         this.commonservice.openSnackBarError('There is issue in service', 'X');
       }
      }, (err: HttpErrorResponse) => {
        if (err.error.message != null) {
          this.commonservice.openSnackBarError(err.error.message,'x')
        } else {
          this.commonservice.openSnackBarError(err.message.toString(), 'x');
        }
      });
    } catch (e) {
      
    }
  }

  forgotRequest(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.service.forgotPasswordRequest(form.value.email).subscribe(function(res: any) {
    this.forgetPass = false;
   form.resetForm();
   this.commonservice.openSnackBarSuccess('An email with instruction has been sent to provided email address.', 'X');

    }.bind(this));
  }

}
