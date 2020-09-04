import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { AccountActivationService } from './account-activatio.service'
import { CommonService } from 'src/app/shared/common.service';
import { ChangeDetectorRef } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Location } from '@angular/common';
import * as sha512 from 'js-sha512';
import { ResetPasswordDTO } from 'src/app/shared/dto/reset-pasword';
import { ActivationCodeDto } from 'src/app/shared/dto/activation-code';
import { JWTToken } from 'src/app/shared/jwtToken';
import { CookieService } from 'src/app/shared/cookie.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit {
  otpButtonText = 'Generate OTP';
  linkButtonText = 'Generate Activation Link';
  ValidToken = false;


  constructor(
    private readonly accountActivationService: AccountActivationService,
    private readonly commonService: CommonService,
    private readonly appComponent: AppComponent,
    private readonly jwtToken: JWTToken,
    private location: Location,
    private readonly cookieService: CookieService,
    private readonly cd: ChangeDetectorRef
  ) { }
  pattern = new RegExp(/^(?=.*?[äöüÄÖÜß])/);
  submitted = false;
  confirmPasswordNotMatched = false;
  odlNewPasswordSame = false;
  passwordValidPercentage = 0;
  otp;
  token;
  email;
  old_password;
  new_password;
  confirm_password;
  userInfo;
  serviceIssue = false;

  currentPass = new FormControl('', [
    Validators.required
  ]);

  userOTP = new FormControl('', [
    Validators.required
  ]);

  ngOnInit(): void {
    this.validateToken();
    this.userInfo = this.jwtToken.parseJWTToken(this.cookieService.getCookie('usertoken'))
  }
  validateToken() {

    this.token = this.location.path().split('/')[2];
    if (!this.token) {
      this.redirectToLogin('Invalid Request. Click on Redirect button to redirect to login page.');
    }
    else {
      this.accountActivationService.validateToken(this.token).toPromise().then((res: any) => {

        if (res && Number(res.isValid) == 1) {
          this.email = res.EmailId;
        } else {
          this.redirectToLogin('Your link is expired. Click on Redirect button to redirect to login page.');
        }
      });
    }
  }
  redirectToLogin(message: string) {
    this.commonService.confirmDialogChangePassword(message)
      .afterClosed()
      .subscribe((res) => {
        this.appComponent.redirectToLogin();
      });
  }
  resetForm(form?: NgForm) {
    if (form) {
      form.resetForm();
    }
  }
  generateLink() {
    this.accountActivationService.ActivationLinkRequest(this.userInfo.EmailId).subscribe(function (res: any) {
      this.commonser.openSnackBarSuccess('An email with instruction has been sent to provided email address.', 'X');

    }.bind(this));
  }
  async generateOPT() {

    const activationCodeParameter = new ActivationCodeDto();
    activationCodeParameter.EmailID = this.email;
    activationCodeParameter.LinkGUID = null;
    activationCodeParameter.MethodType = 1;
    activationCodeParameter.EntryBy = this.email;
    activationCodeParameter.SendMailToUser = true;
    this.accountActivationService.generateOTP(activationCodeParameter).subscribe(function (res) {

      if (res.MessageId > 0) {
        this.otpButtonText = 'Re-generate OTP';
        this.commonService.openSnackBarSuccess('OTP has been sent to registered email', 'X');
      } else {
        this.commonService.openSnackBarError(res.returnmessage, 'X');
      }
    }.bind(this));
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
    passwordDto.EmailId = this.email;
    // passwordDto.confirm_new_password = sha512.sha512(form.value.confirm_password);
    passwordDto.NewPassword = sha512.sha512(form.value.new_password);
    passwordDto.Token = this.token;
    passwordDto.UserAction = 1; // Change password.
    this.accountActivationService.changePassword(passwordDto).subscribe((res: any) => {
      if (res > 0) {
        this.accountActivationService.addFreePlan(this.email).subscribe((res: any) => {
          if (res != null) {
            this.commonService.confirmDialogAccountActivate("Your password has been set successfully. Please LogIn for further details")
              .afterClosed()
              .subscribe(() => {
                this.appComponent.redirectToLogin();
              })

          }
        })




      } else {
        this.serviceIssue = true
      }
    });
  }
  onStrengthChanged(ev) {
    this.passwordValidPercentage = ev;
  }

}
