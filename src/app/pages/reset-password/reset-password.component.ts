import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ResetPasswordService } from "./reset-password.service";
import { CommonService } from "../../shared/common.service";
import { ChangeDetectorRef } from "@angular/core";
import { AppComponent } from "../../app.component";
import * as sha512 from "js-sha512";
import { Location } from "@angular/common";
import { ActivationCodeDto } from "src/app/shared/dto/activation-code";
import { ResetPasswordDTO } from "src/app/shared/dto/reset-pasword";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
})
export class ResetPasswordComponent implements OnInit {
  options = {
    id: "resetPasswordAlert",
    autoClose: true,
    keepAfterRouteChange: false,
  };
  otpButtonText = "Generate OTP";
  otpButtonDisable: boolean = false;
  constructor(
    private readonly resetPasswordService: ResetPasswordService,
    private commonService: CommonService,
    private appComponent: AppComponent,
    private location: Location,
    private cd: ChangeDetectorRef
  ) {}

  pattern = new RegExp(/^(?=.*?[äöüÄÖÜß])/);
  submitted = false;
  confirmPasswordNotMatched = false;
  passwordValidPercentage = 0;
  token;
  email;
  // Empty prop declaration.
  otp;
  new_password;
  confirm_password;

  ngOnInit() {
    this.validateToken();
  }

  validateToken() {
    this.token = this.location.path().split("/")[2];

    if (!this.token) {
      this.redirectToLogin(
        "Invalid Request. Click on Redirect button to redirect to login page."
      );
    } else {
      this.resetPasswordService
        .validateToken(this.token)
        .toPromise()
        .then((res: any) => {
          if (res && Number(res.isValid) == 1) {
            this.email = res.EmailId;
          } else {
            this.redirectToLogin(
              "Your link is expired. Click on Redirect button to redirect to login page."
            );
          }
        });
    }
  }

  redirectToLogin(message: string) {
    this.commonService
      .confirmDialogChangePassword(message)
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

  async generateOTP() {
    if (!this.isRequestValid()) {
      return;
    } else {
      const resetPasswordParameter = new ActivationCodeDto();
      resetPasswordParameter.EmailID = this.email;
      resetPasswordParameter.LinkGUID = this.token;
      resetPasswordParameter.MethodType = 2;
      resetPasswordParameter.EntryBy = this.email;
      resetPasswordParameter.SendMailToUser = true;
      this.resetPasswordService
        .generateOTP(resetPasswordParameter)
        .subscribe((res: any) => {
          if (res.MessageId == 1) {
            this.otpButtonDisable = true;
            this.otpButtonText = "Re-generate OTP";
            this.commonService.openSnackBarSuccess(
              "OTP has been sent to registered email",
              "X"
            );
            this.cd.markForCheck();
            setTimeout(() => {
              this.otpButtonDisable = false;
            }, 120000);
          } else {
            this.commonService.openSnackBarSuccess(res.returnmessage, "X");
          }
        });
    }
  }

  onSubmit(form: NgForm) {
    if (!this.isRequestValid()) {
      return;
    } else {
      this.submitted = true;
      if (form.invalid) {
        return;
      }

      this.confirmPasswordNotMatched =
        form.value.confirm_password !== form.value.new_password;
      if (
        this.confirmPasswordNotMatched ||
        this.passwordValidPercentage < 100
      ) {
        return;
      }

      const passwordDto = new ResetPasswordDTO();
      passwordDto.OTP = form.value.otp;
      passwordDto.NewPassword = sha512.sha512(form.value.confirm_password);

      passwordDto.Token = this.token;
      passwordDto.EmailId = this.email;
      passwordDto.UserAction = 2;
      this.resetPasswordService
        .resetPassword(passwordDto)
        .subscribe((res: any) => {
          if (res == 1) {
            this.token = undefined;
            this.email = undefined;
            // this.commonService.confirmDialogChangePassword('Your password has been reset successfully. Click Redirect button to login page.')
            //   .afterClosed()
            //   .subscribe(() => {
            //     this.appComponent.redirectToLogin();
            //   });
            this.redirectToLogin(
              "Your password has been reset successfully. Click Redirect button to login page."
            );
            form.resetForm();
          } else {
            this.commonService.openSnackBarError(res.returnmessage, "x");
          }
        });
    }
  }

  onStrengthChanged(ev) {
    this.passwordValidPercentage = ev;
  }

  isRequestValid() {
    if (!this.token) {
      this.redirectToLogin(
        "Invalid Request. Click on Redirect button to redirect to login page."
      );
      return false;
    } else if (!this.email) {
      this.redirectToLogin(
        "Your link is expired. Click on Redirect button to redirect to login page."
      );
      return false;
    } else {
      return true;
    }
  }
}
