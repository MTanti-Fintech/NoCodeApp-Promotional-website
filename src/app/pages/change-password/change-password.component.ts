import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { ChangePasswordService } from './change-password.service';
import { ChangeDetectorRef } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import * as sha512 from 'js-sha512';
import { ResetPasswordDTO } from 'src/app/shared/dto/reset-pasword';
import { ActivationCodeDto } from 'src/app/shared/dto/activation-code';
import { JWTToken } from 'src/app/shared/jwtToken';
import { CookieService } from 'src/app/shared/cookie.service';
import { CommonService } from 'src/app/shared/common.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {

  otpButtonText = 'Generate OTP';
  otpButtonDisable: boolean = false;
  constructor(
    private readonly changePasswordService: ChangePasswordService,
    private readonly jwtToken: JWTToken,
    private readonly commonService: CommonService,
    private readonly cookieService: CookieService,
    private appComponent: AppComponent,
    // public dialogRef: MatDialogRef<ChangePasswordComponent>
    ) { }

  pattern = new RegExp(/^(?=.*?[äöüÄÖÜß])/);
  submitted = false;
  confirmPasswordNotMatched = false;
  odlNewPasswordSame = false;
  passwordValidPercentage = 0;
  // Empty prop declaration.
  otp;
  old_password;
  new_password;
  confirm_password;
   userInfo;
  
  currentPass = new FormControl('', [
    Validators.required
  ]);

  userOTP = new FormControl('', [
    Validators.required
  ]);

  ngOnInit() {
    
     this.userInfo = this.jwtToken.parseJWTToken(this.cookieService.getCookie('usertoken'))

  }

  resetForm(form?: NgForm) {
    if (form) {
      form.resetForm();
    }
  }

  async generateOTP() {

    const activationCodeParameter = new ActivationCodeDto();
    activationCodeParameter.EmailID = this.userInfo.EmailId;
    activationCodeParameter.LinkGUID = null;
    activationCodeParameter.MethodType = 3;
    activationCodeParameter.EntryBy = this.userInfo.EmailId;
    activationCodeParameter.SendMailToUser = true;
    this.changePasswordService.generateOTP(activationCodeParameter).subscribe( (res:any) => {

      if (res.MessageId == 1) {
        this.otpButtonText = 'Re-generate OTP';
        this.otpButtonDisable = true;
        this.commonService.openSnackBarSuccess('OTP has been sent to registered email', 'X');
setTimeout(() => {
  this.otpButtonDisable = false;
}, 2000);
      } else {
        this.commonService.openSnackBarError(res.returnmessage, 'X');
      }
    });
  }


  onSubmit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) {
      return;
    }
    this.confirmPasswordNotMatched = form.value.confirm_password !== form.value.new_password;
    if (this.confirmPasswordNotMatched || this.odlNewPasswordSame || this.passwordValidPercentage < 100) {
      return;
    }

    const passwordDto = new ResetPasswordDTO();
    passwordDto.OTP = form.value.otp;
   passwordDto.EmailId = this.userInfo.EmailId;
    // passwordDto.confirm_new_password = sha512.sha512(form.value.confirm_password);
    passwordDto.NewPassword = sha512.sha512(form.value.new_password);
    // passwordDto.OldPassword = sha512.sha512(form.value.old_password);
    passwordDto.UserAction = 3; // Change password.
    this.changePasswordService.changePassword(passwordDto).subscribe( (res:any) => {
      if (res > 0) {
        form.resetForm();
        this.commonService.confirmDialogChangePassword("Your password has been changed successfully. Click Redirect button to login again.")
          .afterClosed()
          .subscribe(() => {
            this.appComponent.redirectToLogin();
            this.commonService.openSnackBarSuccess('Logout Successfull','X');
          });
      } else {
        this.commonService.openSnackBarError(res.returnmessage, 'X');
      }
    });
  }

  onStrengthChanged(ev) {
    this.passwordValidPercentage = ev;
  }
  

  checkSamePassword(event) {
    this.odlNewPasswordSame = this.old_password === event.target.value;
  }
}
