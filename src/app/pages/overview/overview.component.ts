import {Renderer2,Inject,HostListener} from "@angular/core";
import { SuccesfulInvoicePopupComponent } from './../../shared/succesful-invoice-popup/succesful-invoice-popup.component';
import { Router } from '@angular/router';
import { Organization_Invoice_Details } from './../../shared/Dto/invoiceDetails.DTO';
import { InvoiceItemRequest } from './../../shared/Dto/invoice-item.DTO';
import { PurchasePaidPlanService } from './../purchase-paid-plan/purchase-paid-plan.service';
import { planDetails } from './../../shared/Dto/planDetails.DTO';
import { CommonService } from 'src/app/shared/common.service';
import { DepartmentDetailsRequest } from './../../shared/Dto/department.DTO';
import { OrganizationRemoteUserRequest } from './../../shared/Dto/remoteUser.DTO';
import { AddRemoteUserComponent } from './../add-remote-user/add-remote-user.component';
import { PurchasePaidPlanComponent } from '../purchase-paid-plan/purchase-paid-plan.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { OverviewService } from './overview.service';
import { JWTToken } from './../../shared/JWTToken';
import { CookieService } from './../../shared/cookie.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild, SecurityContext, EventEmitter, Output, Input, TemplateRef } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { elementAt } from 'rxjs/operators';
import { UserDetails } from 'src/app/shared/dto/user-details';
import { OrganizationDetails } from 'src/app/shared/dto/organization-details'
import { async } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { isNumber } from 'util';
import { MatDatepicker } from '@angular/material/datepicker';
import { ChangeWorkingModalPopupComponent } from './change-working-modal-popup/change-working-modal-popup.component';
import { invoiceDate } from 'src/app/shared/Dto/invoiceDate.DTO';
import { DOCUMENT } from "@angular/common";
import { ChatWidgetComponent } from 'src/app/shared/chat-widget/chat-widget.directive';
import { AppComponent } from 'src/app/app.component';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})

export class OverviewComponent implements OnInit {
  light: any;
  heavy: any;
  medium: any;
  editStatusForm: FormGroup;
  status:any[]=[{status:0,value:"Pending"},{status:1,value:"Active"}];
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private Cookie: CookieService,
    private jwtToken: JWTToken,
    private overviewService: OverviewService,
    private commonService: CommonService,
    private dom: DomSanitizer,
    private purchaseService: PurchasePaidPlanService,
    private router:Router,
    private appmethod: AppComponent,
    // private renderer: Renderer2,
    // @Inject(DOCUMENT) private document,
  ) {
    this.editOrganizationForm = this.fb.group({
      subscription_id: ['', [Validators.required]],
      Code: ['', [Validators.required]]
    })
    this.addAdminForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      fullName: ['', Validators.required],
      adminEmail: ['', [Validators.required, Validators.email]],

    },{ updateOn: "blur" });
    this.editStatusForm = this.fb.group({
      Status: ['', [Validators.required]],
      orgId:[''],
    })
    this.editAdminForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      fullName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      userId: [],
      organization_Mst_Id: [],

    },{ updateOn: "blur" });
    this.inpuEmployeeForm = this.fb.group({
      LightUsers: [[Validators.required]],
      MediumUsers: [[Validators.required]],
      HeavyUsers: [[Validators.required]]
    });
    this.buyMoreUser = new FormControl(10);

    this.organizationDetails = new OrganizationDetails();
    this.organizationDetails.CommunicationEmail = "No Data Available";
    this.organizationDetails.OrganizationName = "No Data Available";
    this.organizationDetails.OrganizationDomain = "No Data Available";
    this.organizationDetails.OrganizationId = "No Data Available";
    this.organizationDetails.Code = "No Data Available";
    this.organizationDetails.subscription_id = "No Data Available";
    this.organizationDetails.AdminEmail = "No Data Available";
    this.disableOrganizationEditing = true;
    this.selectedDays = [];
    this.workingModel = "No Data Available";
    this.expirydate = "No Data Available";
    this.planDetails = new planDetails();
    this.planDetails.Default_Light_Profile_Users = 0;
    this.planDetails.Default_Medium_Profile_Users = 0;
    this.planDetails.Default_Heavy_Profile_Users = 0;
    this.planDetails.Plan_Name = "No Data Available";
    this.planDetails.Is_Active = "No Data Available";
    this.disablePlanEditing = true;
    this.planDetails.Status = "No Data Available";
    this.noDepartment = true;
    this.priceList = [];
  }

  @ViewChild('addAdminTable', { static: true }) addAdminTable: MatTable<any>;
  @ViewChild('editAdmin', { static: true }) editAdmin: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('successInvoice') successRef: TemplateRef<any>;
  days: { [key: number]: string } = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };
  displayedColumns: string[] = ['Id','Full Name', 'Email Id', 'Action'];
  models: { [key: number]: string } = { 5: "12*5", 6: "12*6", 7: "24*7" };

  addOrganizationForm: FormGroup;
  editOrganizationForm: FormGroup;
  addAdminForm: FormGroup;
  editAdminForm: FormGroup;
  inpuEmployeeForm: FormGroup;
  buyMoreUser: FormControl;
  // organizationDetails=new OrganizationDetails();
  // expirydate;
  addUserRef;
  Issues = null;
  selectedDate;
  addAdminError = false;
  dialogRef: any = null;
  userInfo: any = null;
  submitted = false;
  lightUserCount = 0;
  mediumUserCount = 0;
  heavyUserCount = 0;
  lightUsersBalance = 0;
  mediumUsersBalance = 0;
  heavyUsersBalance = 0;
  showTimeDaySelection: boolean = false;
  datasource = new MatTableDataSource<OrganizationDetails>();
  //remoteUserDetails: OrganizationRemoteUserRequest[];
  organizationDetails: any = null;
  departmentDetails: any[] = null;
  //dataSource = new MatTableDataSource<any>();
  planDetails: any = null;
  selectedDays = null;
  List: [] = null;
  workingModel = null;
  datechange = false;
  newDate = null;
  oldDate;
  generatedInvoice="";
  disablePlanEditing: boolean = false;
  disableOrganizationEditing: boolean = false;
  noDepartment: boolean = false;

  @Output('closed') actionChangeDate: EventEmitter<any> = new EventEmitter;
  @Output() ChangeData: EventEmitter<any> = new EventEmitter;
  @Input() expirydate: any;
  async ngOnInit() {
    // this.chatWidgetService.
    // const s = this.renderer.createElement("script");
    // s.type = "text/javascript";
    // var code = `function initFreshChat() {       window.fcWidget.init({           token: "761b52c4-1994-41df-a761-c9cdc9002b86",           host: "https://wchat.in.freshchat.com"       });   }   function initialize(i, t) { var e; i.getElementById(t) ? initFreshChat() : ((e = i.createElement("script")).id = t, e.async = !0, e.src = "https://wchat.in.freshchat.com/js/widget.js", e.onload = initFreshChat, i.head.appendChild(e)) } function initiateCall() {initialize(document, "freshchat-js-sdk")} window.addEventListener ? window.addEventListener("load", initiateCall, !1) : window.attachEvent("load", initiateCall, !1);`;
    // s.appendChild(this.document.createTextNode(code));
    // this.renderer.appendChild(this.document.body, s);
    this.appmethod.callingmethod();
    this.datasource.paginator = this.paginator;
    this.userInfo = await this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
    this.commonService.OrganizationId.subscribe(async (id: any) => {

      if (id != null && id != undefined && isNumber(id)) {
        this.overviewService.GetOrganizationDetails(id).subscribe((data: any) => {
          console.log(data);
          if (data != null && data != undefined && data.organizationDetails) {
            this.renderData(data.organizationDetails, data.organizationPlanList[0], data.employeeCount, data.departmentEmployeeCount, data.adminList);
          }
        })
      }
    });
  }

checkFormFieldInFocus(element:FormControl){
element.markAsUntouched();
}
  onClose(event: any) {
    console.log(event);
  }
  renderEmployeeCount(Light, Medium, Heavy) {
    this.lightUserCount = Light;
    this.mediumUserCount = Medium;
    this.heavyUserCount = Heavy;
  }

  renderOranization(OrganizationDetail) {
    this.organizationDetails = new OrganizationDetails();
    if (OrganizationDetail.Domain != undefined && OrganizationDetail.Domain != null) {
      this.organizationDetails.CommunicationEmail = OrganizationDetail.Communication_Email;
      this.organizationDetails.OrganizationName = OrganizationDetail.organizationName;
      this.organizationDetails.OrganizationDomain = OrganizationDetail.Domain;
      this.organizationDetails.OrganizationId = OrganizationDetail.organization_Mst_Id;
      this.organizationDetails.Code = OrganizationDetail.Code;
      this.organizationDetails.subscription_id = OrganizationDetail.subscription_id;
      this.organizationDetails.AdminEmail = this.userInfo.EmailId;
      this.disableOrganizationEditing = false;
    }
    else {
      this.organizationDetails.CommunicationEmail = "No Data Available";
      this.organizationDetails.OrganizationName = "No Data Available";
      this.organizationDetails.OrganizationDomain = "No Data Available";
      this.organizationDetails.OrganizationId = "No Data Available";
      this.organizationDetails.Code = "No Data Available";
      this.organizationDetails.subscription_id = "No Data Available";
      this.organizationDetails.AdminEmail = "No Data Available";
      this.disableOrganizationEditing = true;
    }
  }
  renderPlanDetails(PlanDetail) {
    this.planDetails = new planDetails();
    if (PlanDetail != undefined && PlanDetail.PlanId != undefined && PlanDetail.PlanId != null) {
      //this.planDetails.Default_Light_Profile_Users = PlanDetail.No_of_Users;
      //this.planDetails.Default_Medium_Profile_Users = PlanDetail.No_Medium_Profile_Users;
      //this.planDetails.Default_Heavy_Profile_Users = PlanDetail.No_Heavy_Profile_Users;
      this.planDetails.PlanId = PlanDetail.PlanId;
      this.planDetails.Plan_Name = PlanDetail.Plan_Name;
      this.planDetails.Is_Active = PlanDetail.Is_Active;
      this.planDetails.Start_Time = PlanDetail.Start_Time;
      this.planDetails.No_of_Users = PlanDetail.No_of_Users;
      this.selectedDays = PlanDetail.Days.split(",");
      // if (this.selectedDays.length == 5) {
      //   this.workingModel = "12 * 5";
      // }
      // else if (this.selectedDays.length == 6) {
      //   this.workingModel = "12 * 6";
      // }
      // else if (this.selectedDays.length == 7) {
      //   this.workingModel = "24 *7";
      // } else {
      //   this.workingModel = "Custom";
      // }
      this.workingModel = PlanDetail.Plan_Name;
      //this.workingModel=PlanDetail.Plan_Name;
      if (this.planDetails.Is_Active == 1) {
        this.planDetails.Status = "Active";
      }
      else {
        this.planDetails.Status = "Pending";
      }
      this.planDetails.Expires_At = PlanDetail.Expires_At;
      this.expirydate = new FormControl(new Date(this.planDetails.Expires_At).toDateString());
      this.disablePlanEditing = false;
    }
    else {
      this.selectedDays = [];
      this.workingModel = "No Data Available";
      this.expirydate = "No Data Available";
      this.planDetails.Default_Light_Profile_Users = 0;
      this.planDetails.Default_Medium_Profile_Users = 0;
      this.planDetails.Default_Heavy_Profile_Users = 0;
      this.planDetails.Plan_Name = "No Data Available";
      this.planDetails.Is_Active = "No Data Available";
      this.disablePlanEditing = true;
      this.planDetails.Status = "No Data Available";
    }


  }
  async renderData(OrganizationDetail, PlanDetail, EmployeeCount, DepartmentDetail, AdminDetail) {

    await this.renderOranization(OrganizationDetail);
    await this.renderPlanDetails(PlanDetail);
    /*RemoteUser Details*/
    if (EmployeeCount != undefined || EmployeeCount != null) {
      this.renderEmployeeCount(EmployeeCount.No_of_Users, EmployeeCount.No_Medium_Profile_Users, EmployeeCount.No_Heavy_Profile_Users);
    }
    else {
      this.renderEmployeeCount(0, 0, 0);
    }

    /*Department Details*/
    if (DepartmentDetail[0] != undefined || DepartmentDetail[0] != null) {
      this.departmentDetails = DepartmentDetail;
      this.noDepartment = false;
    }
    else {
      this.noDepartment = true;
      this.departmentDetails = [];
    }
    if (AdminDetail != undefined) {
      this.datasource.data = AdminDetail;
    }
    else {
      this.datasource.data = [];
    }

  }
  openEditStatusDialog(ref,element){
    this.dialogRef = this.dialog.open(ref);
    this.editStatusForm.controls['Status'].setValue(element.Is_Active);
    this.editStatusForm.controls['orgId'].setValue(this.organizationDetails.OrganizationId);
  }
  EditStatus(){
    this.overviewService.updatePlanStatus(this.editStatusForm.controls['Status'].value,this.editStatusForm.controls['orgId'].value).subscribe((res)=>{
      if(res>0){
        this.dialog.closeAll();
        this.commonService.openSnackBarSuccess('Status changed successfully','X');
        this.ngOnInit();
      }
      else{
        this.commonService.openSnackBarError('Error in changing status !','X');
      }
    })
  }
  sendPlanActiveStatus(){
    this.commonService.openConfirmDialog('Click yes to send email to Organization admin that your office is active in the cloud now and can be used!','Email Confirmation').afterClosed().subscribe((res)=>{
      if(res){
        this.overviewService.sendPlanActiveStatus(this.userInfo.FullName,this.userInfo.EmailId).subscribe((res)=>{
          if(res>0){
            this.commonService.openSnackBarSuccess('Mail sent successfully !','X');
          }
          else{
            this.commonService.openSnackBarError('Error in sending mail','X');
          }
        })
      }
    })
    
  }
  changeDate() {
    this.overviewService.changePlanExpiry(this.newDate, this.organizationDetails.OrganizationId).subscribe((res) => {
      if (res > 0) {
        this.dialogRef.close();
        this.commonService.openSnackBarSuccess("Plan expiry date changed successfully !", 'X');
        this.expirydate.value = this.newDate;
      }
      else {
        this.commonService.openSnackBarError("Error update plan expiry ! Please try again later", 'X');
      }
      this.datechange = false;

    })

  }
  onSelect(event) {
    this.selectedDate = event;
    this.newDate = event.toDateString();
    this.datechange = true;
  }
  onChangePlan() {

  }
  onChangeExpiryDate(ref) {
    this.dialogRef = this.dialog.open(ref);
  }
  onChangeExpiry() {

  }
  onAddOrganization() {

    this.dialogRef = this.dialog.open(PurchasePaidPlanComponent, {
      panelClass: "org-popup-main"
    });
  }
  EnableDisableConfirmPopup(event: MatSlideToggleChange, userId) {



    if (event.checked) {
      this.commonService.openConfirmDialog("Are you sure you want to activate the admin", "Enable Admin").afterClosed().subscribe((res => {
        if (res) {
          var details = new OrganizationDetails();
          details.AdminEmail = userId;
          details.is_Active = 1;
          this.overviewService.changeStatus(details).subscribe((res: any) => {
            if (res == 0) {
              event.source.checked = false;
              this.commonService.openSnackBarSuccess("Status Not Changed ! Please try again later", 'X');
            }
            else {
              this.commonService.openSnackBarSuccess("Status Changed Successfully !", 'X');
            }
          })
        }
      }))
    }
    else {
      this.commonService.openConfirmDialog("Are you sure you want to disable the admin", "Disable Admin").afterClosed().subscribe((res => {
        if (res) {
          var details = new OrganizationDetails();
          details.AdminEmail = userId;
          details.is_Active = 0;

          this.overviewService.changeStatus(details).subscribe((res: any) => {
            if (res == 0) {
              event.source.checked = true;
              this.commonService.openSnackBarSuccess("Status Not Changed ! Please try again later", 'X');
            }
            else {
              this.commonService.openSnackBarSuccess("Status Changed Successfully !", 'X');
            }
          })
        }
      }))
    }

  }
 
  onAddAdmin(ref) {

    this.addAdminForm.reset();
    this.dialogRef = this.dialog.open(ref);
  }
  onEditDetails(data: any, ref) {


    this.dialogRef = this.dialog.open(ref);
    this.editAdminForm.setValue({
      firstName: data.FirstName,
      lastName: data.LastName,
      fullName: data.Full_Name,
      Email: data.EmailID,
      userId: data.UserId,
      organization_Mst_Id: this.organizationDetails.OrganizationId
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
  onInsertOrganization() {

  }
  onEditAdmin() {


    this.overviewService.updateAdmin(this.editAdminForm.value).subscribe(async (res: OrganizationDetails) => {
      // 
      if (res.responseStatus > 0) {
        this.dialogRef.close();
        this.commonService.openSnackBarSuccess("Admin Updated Successfully", 'X');
        this.datasource.data[await this.datasource.data.findIndex(x => x.userId == res.userId)] = res;

        this.datasource.data = this.datasource.data
        // this.addAdminTable.renderRows();
      }
    })

  }
  onInsertAdmin() {

    var user = new OrganizationDetails();
    user.OrganizationId = this.organizationDetails.OrganizationId;
    user.Firstname = this.addAdminForm.value.firstName;
    user.Lastname = this.addAdminForm.value.lastName;
    user.Fullname = this.addAdminForm.value.fullName;
    user.AdminEmail = this.addAdminForm.value.adminEmail;

    this.overviewService.addAdmin(user).subscribe(async (res: OrganizationDetails) => {
      // 
      if (res.responseStatus == 1 || res.responseStatus == -1) {
        this.dialogRef.close();
        this.commonService.openSnackBarSuccess(res.responseMessage, 'X');
      }
      else if (res.responseStatus == 0) {
        this.Issues = res.responseMessage;
      }

    })

  }
  // onIncrementNumberOfUser(index) {
  //   if (Number(index) == 0)
  //     this.light += 5;
  //   if (Number(index) == 1)
  //     this.medium += 5;
  //   if (Number(index) == 2)
  //     this.heavy += 5;


  // }
  // onDecrementNumberOfUser(index) {
  //   if (Number(index) == 0)
  //     this.lightUserCount--;
  //   if (Number(index) == 1)
  //     this.mediumUserCount--;
  //   if (Number(index) == 2)
  //     this.heavyUserCount--;


  //   if (Number(index) == 0) {
  //     if (this.light > this.planDetails.Default_Light_Profile_Users && this.light > this.lightUserCount)
  //       this.light -= 5;
  //   }
  //   if (Number(index) == 1) {
  //     if (this.medium > this.planDetails.Default_Medium_Profile_Users && this.medium > this.mediumUserCount)
  //       this.medium -= 5;
  //   }
  //   if (Number(index) == 2) {
  //     if (this.heavy > this.planDetails.Default_Heavy_Profile_Users && this.heavy > this.mediumUserCount)
  //       this.heavy -= 5;
  //   }

  // }
  onSaveUserLimit() {
    var plan = this.planDetails;
    plan.No_of_Users = Number(this.inpuEmployeeForm.value.LightUsers);
    // plan.Default_Medium_Profile_Users = Number(this.inpuEmployeeForm.value.MediumUsers);
    // plan.Default_Heavy_Profile_Users = Number(this.inpuEmployeeForm.value.HeavyUsers);
    this.overviewService.updatePlanUser(plan, this.organizationDetails.OrganizationId).subscribe((res: any) => {

      if (res > 0) {
        this.dialogRef.close();
        this.commonService.openSnackBarSuccess('The organization user limit update successfully !', 'X');
        this.planDetails.No_of_Users = this.inpuEmployeeForm.value.LightUsers;
        // this.planDetails.Default_Medium_Profile_Users = this.inpuEmployeeForm.value.MediumUsers;
        // this.planDetails.Default_Heavy_Profile_Users = this.inpuEmployeeForm.value.HeavyUsers;
      }
      else {
        this.commonService.openSnackBarError("Error in updating plan details ! Please try again", 'X');
      }
    })

  }
  onEmployeeNumberInputChange(index) {
    if (index == 0) {
      if (Number(this.inpuEmployeeForm.value.LightUsers) < this.planDetails.No_of_Users) {
        this.inpuEmployeeForm.controls['LightUsers'].setValue(this.planDetails.No_of_Users);
      } else {
        this.inpuEmployeeForm.controls['LightUsers'].setValue((Math.ceil(this.inpuEmployeeForm.value.LightUsers / 5) * 5));
      }
    }
    // if (index == 1) {
    //   if (Number(this.inpuEmployeeForm.value.MediumUsers) < this.planDetails.Default_Medium_Profile_Users) {
    //     this.inpuEmployeeForm.controls['MediumUsers'].setValue(this.planDetails.Default_Medium_Profile_Users);
    //   } else {
    //     this.inpuEmployeeForm.controls['MediumUsers'].setValue((Math.ceil(this.inpuEmployeeForm.value.MediumUsers / 5) * 5));
    //   }
    // }
    // if (index == 2) {
    //   if (Number(this.inpuEmployeeForm.value.HeavyUsers) < this.planDetails.Default_Heavy_Profile_Users) {

    //     this.inpuEmployeeForm.controls['HeavyUsers'].setValue(this.planDetails.Default_Heavy_Profile_Users);
    //   }
    //   else {
    //     this.inpuEmployeeForm.controls['HeavyUsers'].setValue((Math.ceil(this.inpuEmployeeForm.value.HeavyUsers / 5) * 5));
    //   }
    // }
  }
  onDecrementNumberOfUser(index) {
    if (index == 0) {
      if (this.inpuEmployeeForm.value.LightUsers - this.stepForLightUser >= this.planDetails.No_of_Users) {
        this.inpuEmployeeForm.controls["LightUsers"].setValue(Number(this.inpuEmployeeForm.value.LightUsers) - this.stepForLightUser);
      }
    }
    if (index == 1) {
      if (this.inpuEmployeeForm.value.MediumUsers - this.stepForMediumUser >= this.planDetails.Default_Medium_Profile_Users) {
        this.inpuEmployeeForm.controls["MediumUsers"].setValue(Number(this.inpuEmployeeForm.value.MediumUsers) - this.stepForMediumUser);
      }
    }
    if (index == 2) {
      if (this.inpuEmployeeForm.value.HeavyUsers - this.stepForHeavyUser >= this.planDetails.Default_Heavy_Profile_Users) {

        this.inpuEmployeeForm.controls["HeavyUsers"].setValue(Number(this.inpuEmployeeForm.value.HeavyUsers) - this.stepForHeavyUser);
      }
    }
  }
  stepForLightUser = 5;
  stepForMediumUser = 5;
  stepForHeavyUser = 5;
  onIncrementNumberOfUser(index) {
    if (index == 0) {
      this.inpuEmployeeForm.controls["LightUsers"].setValue(Number(this.inpuEmployeeForm.value.LightUsers) + this.stepForLightUser);
    }
    if (index == 1) {
      this.inpuEmployeeForm.controls["MediumUsers"].setValue(Number(this.inpuEmployeeForm.value.MediumUsers) + this.stepForMediumUser);
    }
    if (index == 2) {
      this.inpuEmployeeForm.controls["HeavyUsers"].setValue(Number(this.inpuEmployeeForm.value.HeavyUsers) + this.stepForHeavyUser);
    }
  }
  onChangeCommunicationEmail() {

  }
  onchangeUserLimit(ref) {
    this.dialogRef = this.dialog.open(ref)
    this.inpuEmployeeForm.controls['LightUsers'].setValue(this.planDetails.No_of_Users);
    // this.inpuEmployeeForm.controls['MediumUsers'].setValue(this.planDetails.Default_Medium_Profile_Users);
    // this.inpuEmployeeForm.controls['HeavyUsers'].setValue(this.planDetails.Default_Heavy_Profile_Users);
  }
  onAddUser(type) {
    var addUserData = {
      //Usage_Profile: type,
      organizationId: this.organizationDetails.OrganizationId
    }
    this.addUserRef = this.dialog.open(AddRemoteUserComponent, { data: addUserData });
    this.addUserRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.Usage_Profile == 0) {
          this.lightUserCount += 1;
        }
        else if (result.Usage_Profile == 1) {
          this.mediumUserCount += 1;
        }
        else {
          this.heavyUserCount += 1;
        }
      }
    });
  }
  onChangePassword(data) {
    // 
    var message = "Are you sure you want to send reset password link to <b>" + data.EmailID + "</b> \nAn Email with the reset password instruction will to sent to the " + data.Full_Name;
    message = this.dom.sanitize(SecurityContext.HTML, message);

    this.commonService.openConfirmDialog("Are you sure you want to send reset password link to <b>" + data.EmailID + "</b> \nAn Email with the reset password instruction will to sent to the " + data.Full_Name, "Reset Password").afterClosed().subscribe((res: any) => {
      // 
      if (res) {
        this.overviewService.resetPassword(data).subscribe((res: any) => {
          // 
          if (res > 0) {
            this.commonService.openSnackBarSuccess("An Email with reset password instruction is send to " + data.EmailID.toUpperCase(), 'X');
          }
        })
      }
    })

  }
  onModelValueChange() {
    if (this.addOrganizationForm.value.model != 7) {
      this.showTimeDaySelection = true;
    }
    else {
      this.showTimeDaySelection = false;
    }
    this.addOrganizationForm.controls['dayTimeSelection'].reset();
    this.optionDiabled = false;
  }
  optionDiabled;
  onTimeDaySelectionChange() {

    if (this.addOrganizationForm.value.dayTimeSelection.length == this.addOrganizationForm.value.model) {
      this.optionDiabled = true;
    }
    else {
      this.optionDiabled = false;
    }
  }
  clearSelection() {
    this.addOrganizationForm.controls['dayTimeSelection'].reset();
    this.optionDiabled = false;
  }
  onPurchasePlan() {
    this.dialogRef = this.dialog.open(PurchasePaidPlanComponent, {
      data: this.organizationDetails,
      panelClass: "org-popup-main"
    });
  }
  onEditSubscription(ref) {
    this.dialogRef = this.dialog.open(ref);
    this.editOrganizationForm.controls['subscription_id'].setValue(this.organizationDetails.subscription_id);
  }
  async EditSubscriptionId() {
    await this.overviewService.editOrganizationSubsctiption(this.organizationDetails.OrganizationId, this.editOrganizationForm.value.subscription_id)
      .subscribe(async (data) => {

        if (data > 0) {
          this.organizationDetails.subscription_id = this.editOrganizationForm.value.subscription_id;
          this.dialogRef.close();
        }
      });
  }
  onEditCode(ref) {
    this.dialogRef = this.dialog.open(ref);
    this.editOrganizationForm.controls['Code'].setValue(this.organizationDetails.Code);
  }
  async EditCode() {
    await this.overviewService.editOrganizationCode(this.organizationDetails.OrganizationId, this.editOrganizationForm.value.Code)
      .subscribe(async (data) => {

        if (data > 0) {
          this.organizationDetails.Code = this.editOrganizationForm.value.Code;
          this.dialogRef.close();
        }
      });
  }
  changeWorkingModelPopup() {
    var data = {
      PlanId: this.planDetails.PlanId,
      Plan_Name: this.planDetails.Plan_Name,
      Days: this.selectedDays.toString(),
      Start_Time: this.planDetails.Start_Time,
      No_of_Users:this.planDetails.No_of_Users,
      Expires_At:this.planDetails.Expires_At,
      OrganizationId:this.organizationDetails.OrganizationId
    };
    console.log(data);
    this.dialogRef=this.dialog.open(ChangeWorkingModalPopupComponent, {
      restoreFocus: false,
      panelClass: "ChangeWorkingModalPopup-main", data: data
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.ngOnInit();
      }
    });
  }
  priceList: any[];
  pricePerUser: number = 0;
  totalCost: number = 0;
  currentDate: any;
  itemsList: Array<Organization_Invoice_Details> = [];
  calculateCost() {
    this.currentDate = new Date();
    var oneDay = 24 * 60 * 60 * 1000;
    var expiry: any = new Date(this.planDetails.Expires_At);
    expiry.setHours(11,59,59);
    var numberOfDaysLeft = Math.round(Math.abs((expiry - this.currentDate) / oneDay));
    console.log(numberOfDaysLeft);
    this.totalCost = this.buyMoreUser.value * this.pricePerUser;
    this.totalCost = Math.ceil((numberOfDaysLeft * this.totalCost) / 30);
  }
  async getAllItemList() {
    await this.purchaseService.getAllItemList().then(async (data: any) => {
      this.priceList = data;
    }
    );
  }
  async insertInvoiceList() {
    var invoiceItem: any;
    console.log(this.priceList);
    this.priceList.forEach(element => {
        if (element.Plan_Type_Mst_Id == this.planDetails.PlanId && element.Item_Code.trim() == "L") {
          console.log("inside");
          invoiceItem = new Organization_Invoice_Details();
          invoiceItem.Item_Mst_Id = element.Item_Mst_Id;
          invoiceItem.Quantity = this.buyMoreUser.value;
          this.itemsList.push(invoiceItem);
        }
    });
    console.log(this.itemsList);
  }
  buyRef:any;
  async onBuyMoreUsers(ref) {
    await this.getAllItemList();
    this.priceList.forEach(element => {
      if (element.Plan_Type_Mst_Id == this.planDetails.PlanId && element.Item_Code.trim() == "L") {
        this.pricePerUser = element.Price;
        console.log(element);
        this.calculateCost();
      }
    });
     this.dialogRef = this.dialog.open(ref);
  }
  onMoreUserChange() {
    if (this.buyMoreUser.value < 10) {
      this.buyMoreUser.setValue(10);
    }
    else {
      this.buyMoreUser.setValue(Math.ceil(this.buyMoreUser.value / this.stepForLightUser) * this.stepForLightUser);
    }
    this.calculateCost();
  }

  onIncrementMoreUser() {
    this.buyMoreUser.setValue(this.buyMoreUser.value + this.stepForLightUser);
    this.calculateCost();
  }
  onDecrementMoreUser() {
    if (this.buyMoreUser.value - this.stepForLightUser >= 10) {
      this.buyMoreUser.setValue(this.buyMoreUser.value - this.stepForLightUser);
      this.calculateCost();
    }
  }
  // download() {
  //   let link = document.createElement('a');
  //   link.setAttribute('type', 'hidden');
  //   link.href = 'assets/pdf/OfficeBCPGuide.pdf';
  //   link.download = "OfficeBCPGuide.pdf";
  //   document.body.appendChild(link);
  //   link.click();
  //   // link.remove();
  //   //window.fetch('assets/pdf/OfficeBCPGuide.pdf');
  //   //window.open('assets/pdf/OfficeBCPGuide.pdf', '_blank');
  // }
  // finalOkClick(index) {
  //   this.dialogRef.close();
  //   this.buyRef.close();
  //   if (index == 1) {
  //     this.router.navigate(['howUseServices']);
  //   }
  // }
  async onSaveMoreUsers() {
    await this.insertInvoiceList();
    var InvoiceDate = new invoiceDate();
    var planDetail=new planDetails();
    var expiry=new Date(this.planDetails.Expires_At);
    planDetail.Organisation_Mst_Id=this.organizationDetails.OrganizationId;
    planDetail.No_of_Users= this.planDetails.No_of_Users+this.buyMoreUser.value;
    planDetail.Plan_Type_Mst_Id=this.planDetails.PlanId
    expiry.setHours(11,59,59);
    InvoiceDate.FromDate=new Date();
    InvoiceDate.ToDate=expiry;
    console.log("save");
    await this.overviewService.buyMoreUsers(planDetail,this.itemsList,InvoiceDate).then((data:any)=>{
      console.log(data);
      this.generatedInvoice=data;
      this.planDetails.No_of_Users+=this.buyMoreUser.value;
      this.dialogRef=this.dialog.open(SuccesfulInvoicePopupComponent,{data:data});
      this.dialogRef.afterClosed().subscribe(result => {
        if(result==true){
          this.buyRef.close();
        }
      });
      this.itemsList=[];
    });
  }
}
