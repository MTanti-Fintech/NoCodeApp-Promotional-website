import { Router } from '@angular/router';
import { Renderer2, HostListener, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { async } from '@angular/core/testing';
import { OverviewService } from './../../pages/overview/overview.service';
import { JWTToken } from './../JWTToken';
import { CookieService } from './../cookie.service';
import { CommonService } from 'src/app/shared/common.service';
import { Component, OnInit, Input, ChangeDetectorRef, Inject, Injectable } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResetPasswordDTO } from '../dto/reset-pasword';
import * as sha512 from 'js-sha512';
import { PurchasePaidPlanComponent } from 'src/app/pages/purchase-paid-plan/purchase-paid-plan.component';
import { ChangePasswordService } from 'src/app/pages/change-password/change-password.service';
import { NgxFreshChatService } from 'ngx-freshchat';
var moment = require('moment');


@Component({
  selector: 'app-office-bcp-header',
  templateUrl: './office-bcp-header.component.html',
  styleUrls: ['./office-bcp-header.component.css']
})
@Injectable()
export class OfficeBcpHeaderComponent implements OnInit, OnDestroy {
  orglist: [];
  usersList: [];
  userInfo: any;
  headerForm: FormGroup;
  mobileQuery: MediaQueryList;
  dialogRef: MatDialogRef<unknown, any>;
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);
  opened = true;
  private _mobileQueryListener: () => void;
  profileData: any;
  changeUserDetails: FormGroup;
  Roles: any;

  constructor(
    public signOut: signOut,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private commmonServie: CommonService,
    private Cookie: CookieService,
    private jwtToken: JWTToken,
    private overviewService: OverviewService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private chat: NgxFreshChatService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.changeUserDetails = this.fb.group({
      Fullname: ['', [Validators.required]],
      FirstName: [''],
      LastName: [''],
      Email: [''],
    }, { updateOn: "blur" })
    this.headerForm = this.fb.group({
      organization: [],
      user: []
    }, );


  }
  async ngOnInit() {
    if (this.Cookie.getCookie('usertoken') && this.Cookie.getCookie('usertoken') != null) {
      this.userInfo = await this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
      if (this.userInfo.EmailId != null && this.userInfo.EmailId != undefined) {
        this.Roles = this.userInfo.Roles;
        if (this.userInfo.Roles == "1") {
          await this.getAdminList();
          this.headerForm.controls['user'].setValue(0);
          await this.getOranizationList(0);
        }
        else {

          await this.getOranizationList(Number(this.userInfo.UserId));
          this.chat.init({
            token: "761b52c4-1994-41df-a761-c9cdc9002b86",
            host: "https://wchat.in.freshchat.com",
          })
            .subscribe(
              () => console.log('FreshChat is ready!')
            );
        }
      }
      else {
        this.router.navigateByUrl('/login');
      }
    }
    else {
      this.router.navigateByUrl('/login');
    }

  }
  ngOnDestroy() {
    if (this.Roles != "1")
      this.chat.destroy();
  }
  async getOranizationList(id) {
    await this.overviewService.getOrganizationList(id).subscribe(async (data: any) => {
      this.orglist = data;
      this.headerForm.controls.organization.setValue(data[0].organization_Mst_Id);
      this.commmonServie.sendOrganizationId(Number(this.headerForm.controls.organization.value));
    });
  }

  async getAdminList() {
    await this.overviewService.getAllAdmins().subscribe(async (data: any) => {
      this.usersList = data;
    });

  }
  async onOrganizationChange(element) {
    this.commmonServie.sendOrganizationId(element.value);
  }
  async onUserChange(element) {
    this.getOranizationList(element.value);
  }
  Logout() {
    this.signOut.Logout(true);

    // this.renderer.removeChild(this.document.body,s);
  }
  ChangePassword() {
    const dialogRef = this.dialog.open(ChangePassPopupComponent, { data: { userInfo: this.userInfo } });
  }
  Profile(ref) {
    this.dialogRef = this.dialog.open(ref);
    this.overviewService.getUserDetails(this.userInfo.EmailId).subscribe((res: any) => {
      console.log(res);
      this.profileData = res;
      this.changeUserDetails.controls['Fullname'].setValue(this.profileData.Full_Name.toUpperCase())
      this.changeUserDetails.controls['FirstName'].setValue(this.profileData.FirstName)
      this.changeUserDetails.controls['LastName'].setValue(this.profileData.LastName)
      this.changeUserDetails.controls['Email'].setValue(this.profileData.EmailID)
      this.profileData.Entry_Dt_Time = moment(this.profileData.Entry_Dt_Time).format('YYYY-MM-DD HH:mm:ss');
    })
  }
  addOrganization() {
    this.dialog.open(PurchasePaidPlanComponent, {
      panelClass: "org-popup-main"
    });
  }
  saveDetails() {
    this.overviewService.changeUserDetails(this.changeUserDetails.value).subscribe((res) => {
      if (res > 0) {
        this.dialogRef.close();
        this.commmonServie.openSnackBarSuccess("Profile details changed successfully", 'X');
      }
      else {
        this.commmonServie.openSnackBarError("Error in updating profile details", 'X');
      }
    })
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
@Injectable()
export class signOut {
  constructor(private commmonServie: CommonService, private Cookie: CookieService, private router: Router) {
  }
  Logout(index) {
    if (index == true) {
      this.commmonServie.openConfirmDialog('Are you sure you want to logout', 'Logout').afterClosed().subscribe((res) => {
        if (res) {
          this.Cookie.clearCookies();
          this.router.navigate(['/login']);
          this.commmonServie.openSnackBarSuccess("Logout successfull !", 'X');
        }
      })
    }
    else {
      this.Cookie.clearCookies();
      this.router.navigate(['/login']);
      this.commmonServie.openSnackBarSuccess("Password Changed Successfully. Please Login Using New Password!", 'X');
    }
  }
}
@Component({
  selector: 'change-password-popup',
  templateUrl: './change-password-popup.html',
  // styleUrls: ['./endpoint.component.scss']
})

export class ChangePassPopupComponent {
  submitted = false;
  old_password;
  new_password;
  oldNewPasswordSame = false;
  confirm_password;
  confirmPasswordNotMatched;
  passwordValidPercentage = 0;
  oldpasswordincorrect: boolean;
  constructor(
    public singOut: signOut,
    private commonService: CommonService,
    private changePasswordService: ChangePasswordService,
    public dialogRef: MatDialogRef<ChangePassPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  onSubmit(form: NgForm) {
    this.submitted = true;

    this.confirmPasswordNotMatched = form.value.confirm_password !== form.value.new_password;
    if (this.confirmPasswordNotMatched || this.oldNewPasswordSame || this.passwordValidPercentage < 100) {
      return;
    }

    this.oldNewPasswordSame = this.new_password == this.old_password ? true : false;

    const passwordDto = new ResetPasswordDTO();
    passwordDto.EmailId = this.data.userInfo.EmailId;
    passwordDto.OldPassword = sha512.sha512(form.value.old_password);
    passwordDto.NewPassword = sha512.sha512(form.value.new_password);
    passwordDto.UserAction = 3; // Change password.
    this.changePasswordService.changePassword(passwordDto).subscribe((res: any) => {
      if (res > 0) {
        this.dialogRef.close();
        this.commonService.openSnackBarSuccess("Password changed successfully !", 'X');
        this.singOut.Logout(false);
      }
      else if (res == -1) {
        this.oldpasswordincorrect = true;
      }
      else {
        this.commonService.openSnackBarError('Error is change password ! Please try again after sometime', 'X');
        setTimeout(() => {
          this.dialogRef.close();
        }, 1000);
      }
    });
  }
  onStrengthChanged(ev) {
    this.passwordValidPercentage = ev;
  }
  checkSamePassword(event) {
    this.oldNewPasswordSame = this.old_password === event.target.value;
  }
}
