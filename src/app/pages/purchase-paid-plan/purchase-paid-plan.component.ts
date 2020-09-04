import { SuccesfulInvoicePopupComponent } from './../../shared/succesful-invoice-popup/succesful-invoice-popup.component';
import { MatSort } from '@angular/material/sort';
import { invoiceDate } from './../../shared/Dto/invoiceDate.DTO';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { Organization_Invoice_Details } from './../../shared/Dto/invoiceDetails.DTO';
import { Time } from '@angular/common';
import { SignUpService } from './../home/signup.service';
import { planDetails } from './../../shared/Dto/planDetails.DTO';
import { ItemDetails } from './../../shared/Dto/item_mst.DTO';
import { softwareDetails } from './../../shared/Dto/software.DTO';
import { OrganizationDetails } from './../../models/OrganizationDetails';
import { CommonService } from 'src/app/shared/common.service';
import { DepartmentDetailsRequest } from './../../shared/Dto/department.DTO';
import { DepartmentService } from './../department/department.service';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchasePaidPlanService } from './purchase-paid-plan.service';
import { OrganizationRemoteUserRequest } from './../../shared/Dto/remoteUser.DTO';
import { async } from '@angular/core/testing';
import { EditRemoteUserComponent } from './../edit-remote-user/edit-remote-user.component';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { Component, OnInit, ViewChild, Inject, TemplateRef } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddRemoteUserComponent } from '../add-remote-user/add-remote-user.component';
import { Timestamp, timestamp } from 'rxjs/internal/operators/timestamp';
import { MatStepper } from '@angular/material/stepper';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { empty } from 'rxjs';
import { EmployeeService } from '../employees/employee.service';
import { type } from 'os';
import { JWTToken } from 'src/app/shared/JWTToken';
import { CookieService } from 'src/app/shared/cookie.service';

@Component({
  selector: 'app-purchase-paid-plan',
  templateUrl: './purchase-paid-plan.component.html',
  styleUrls: ['./purchase-paid-plan.component.scss']
})
export class PurchasePaidPlanComponent implements OnInit {

  @ViewChild('lightUserTable', { static: true }) lightUserTable: MatTable<any>;
  @ViewChild('LightTablepaginator', { static: true }) Lightpaginator: MatPaginator;

  displayedColumns: string[] = ['Id', 'Email','Department', 'profile','remove'];
  maxUsers: number;
  organizationAdded: boolean;
  constructor(public router: Router, public purchaseRef: MatDialogRef<PurchasePaidPlanComponent>, private organizationService: SignUpService,
    private employeeService: EmployeeService,
     private commonService: CommonService, private fb: FormBuilder,private jwtToken: JWTToken,private Cookie: CookieService, private dialog: MatDialog, private service: PurchasePaidPlanService, private departmentService: DepartmentService, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public organizationData) {
    this.addOrganizationForm = this.fb.group({
      organizationName: ['', Validators.required],
      adminEmail: ['', [Validators.required, Validators.email]],
      communcationEmail: ['', [Validators.required, Validators.email]],
      domain: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9.]+$')]],
      model: ['', [Validators.required]],
      Organization_Mst_Id: [''],
      dayTimeSelection: ['', [Validators.required]],
      StartAt: [Date, [Validators.required]],
      ExpiresAt: [],
      StartTime: [Date, [Validators.required]],
      EndTime: [Date]
    });
    this.inpuEmployeeForm = this.fb.group({
      LightUsers: [[Validators.required]],
      MediumUsers: [[Validators.required]],
      HeavyUsers: [[Validators.required]]
    });

    this.deleteUserForm = this.fb.group({
      organizationId: [''],
      email: ['', [Validators.required, Validators.email]],
      Usage_Profile: ['', [Validators.required]],
      Organization_Remote_Users_Id: [''],
      Is_Active: ['', [Validators.required]],
      departmentId: [],
    });

    this.paymentForm = this.fb.group({
      subscriptionType: ['', [Validators.required]],
      amount: ['']
    });

    this.softWareForm = this.fb.group({
      softwareId: [''],
    });
    this.updateUsageProfileForm = this.fb.group({
      Full_Name: [''],
      Organization_Remote_Users_Id: [],
      Usage_Profile: []
    });
    this.UTCEndTime = "";
    this.UTCStartTime = "";

  }
  // addUserForm:FormGroup;
  addOrganizationForm: FormGroup;
  secondFormGroup: FormGroup;
  deleteUserForm: FormGroup;
  paymentForm: FormGroup;
  softWareForm: FormGroup;
  inpuEmployeeForm: FormGroup;
  updateUsageProfileForm: FormGroup;
  profile:any[]=[{Usage_Profile:0,value:"Light"},{Usage_Profile:1,value:"Medium"},{Usage_Profile:2,value:"Heavy"}]
  days: { [key: number]: string } = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };
  subscriptionTypes: { [key: number]: string } = { 0: "Monthly", 1: "Yearly" };
  models: [];
  deleteUserRef = null;
  dialogRef: any = null;
  addUserRef: any = null;
  softWareList = [];
  editUserRef: any = null;
  userInfo: any = null;
  expirydate: any = null;
  showTimeDaySelection: boolean = false;
  optionDiabled: boolean = true;
  thumbLabel = true;
  stepOfEmployees = 5;
  minEmployees = 10;
  noOfEmployees = 10;
  selectedDays: number[];
  noOfLightUsers = 10;
  noOfMediumUsers = 0;
  noOfHeavyUsers = 0;
  totalNoOfUsers = 10;
  isValid:boolean = true;
  lightUserCount: number = 0;
  mediumUserCount: number = 0;
  heavyUserCount: number = 0;
  totalUserCount = 0;
  dataSource = new MatTableDataSource<OrganizationRemoteUserRequest>();
  LastTabIndex = 0;
  selectedPlan = "";
  minDate: Date = new Date();
  departments: any[];
  yearlyAmount = 0;
  totalDiscount = 0;
  InvoiceDetails: Array<Organization_Invoice_Details> = [];
  invoiceData: any = null;
  itemDetailList: Array<ItemDetails> = [];
  planSelectedDays: Array<any> = [];
  discountRate = 15;
  stepForLightUser = 5;
  selectedSoftware: Array<any> = [];
  Title = "+ Add Organization";
  stemp = '1';
  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public SoftwareFilterCtrl: FormControl = new FormControl();
  usageTypes: { [key: number]: string } = { 0: "Light", 1: "Medium", 2: "Heavy" };
  async ngOnInit() {
    this.userInfo = await this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
    this.dataSource.paginator = this.Lightpaginator;
    this.dataSource.sort = this.sort;
    if (this.organizationData != null) {
      await this.addOrganizationForm.controls['Organization_Mst_Id'].setValue(this.organizationData.OrganizationId);
      this.addOrganizationForm.controls['communcationEmail'].setValue(this.organizationData.CommunicationEmail);
      this.addOrganizationForm.controls['domain'].setValue(this.organizationData.OrganizationDomain);
      this.addOrganizationForm.controls['organizationName'].setValue(this.organizationData.OrganizationName);
      this.addOrganizationForm.controls['adminEmail'].setValue(this.organizationData.AdminEmail);
      this.Title = "+ Buy Premium Plan";
      /* Get All User*/
      // await this.getRemoteUsers();
      this.inpuEmployeeForm.controls['LightUsers'].setValue(10);
      await this.getAllDepartments();
      await this.getAllEmployees();
    }
    else {
      if(this.userInfo.Roles != 1){
        this.addOrganizationForm.controls['adminEmail'].setValue(this.userInfo.EmailId);
      }
      this.inpuEmployeeForm.controls['LightUsers'].setValue(10);
    
    }
    /*Get All Plan Types */
    await this.service.getAllPlans().then(async (data: any) => {
      // 
      console.log(data);
      this.models = data;
      this.addOrganizationForm.controls['model'].setValue(4);
      this.addOrganizationForm.controls['dayTimeSelection'].setValue(["0", "1", "2", "3", "4", "5", "6"]);
      this.planSelectedDays = ["0", "1", "2", "3", "4", "5", "6"];
    });

    this.addOrganizationForm.controls['StartTime'].setValue("00:00");
    this.addOrganizationForm.controls['StartAt'].setValue(new Date());
    this.addOrganizationForm.controls['EndTime'].setValue("23:59");


    /* Get All Items */
    await this.service.getAllItemList().then(async (data: any) => {
      this.itemDetailList = data;
    });
  }
  async getAllDepartments() {
    this.departmentService.getAllDepartments(this.addOrganizationForm.value.Organization_Mst_Id).subscribe((data: any) => {
      this.departments = data;
      console.log(this.departments);
    });
  }
  
 
check(domain) {
     this.organizationService.checkDomain(domain + ".officebcp.com").subscribe(async (res:any) => {
      if(res==1){
        this.isValid =  true;
      }
      else{
        this.isValid =  false;
      }
    })
  
  }
  async getAllEmployees() {
    this.employeeService.GetAllEmployees(this.addOrganizationForm.controls['Organization_Mst_Id'].value).subscribe(async (data: any[]) => {
      await this.getAllDepartments();
      this.dataSource.data = data;
      console.log(this.dataSource.data)
      this.dataSource.data.forEach((x) => {
        x.Usage_Profile_value = x.Usage_Profile ? this.profile[x.Usage_Profile].value : "Light";
      })
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.Lightpaginator;
      
    })
  }
  moveToStep(index) {
    this.myStepper.selectedIndex = index;
  }
  searchUser(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  daysCheckChange(element, item) {
    if (element.checked == true) {
      if (this.planSelectedDays == undefined) {
        this.planSelectedDays = item.key;
      }
      else {
        this.planSelectedDays.push(item.key);
      }
    }
    else {
      this.planSelectedDays = this.planSelectedDays.filter(value => {
        return value != item.key;
      });
    }
    //this.addOrganizationForm.controls['dayTimeSelection'].patchValue(this.planSelectedDays);
    console.log(this.planSelectedDays);
    console.log(this.addOrganizationForm.value.dayTimeSelection);
    if (this.addOrganizationForm.value.model == 2) {
      if (this.planSelectedDays.length >= 5)
        this.optionDiabled = true;
      else {
        this.optionDiabled = false;
      }
    }
    if (this.addOrganizationForm.value.model == 3) {
      if (this.planSelectedDays.length >= 6)
        this.optionDiabled = true;
      else {
        this.optionDiabled = false;
      }
    }
  }
  onEditUsageProfile(element, ref) {
    console.log(element);
    this.updateUsageProfileForm.controls['Usage_Profile'].setValue(element.Usage_Profile + "");
    this.updateUsageProfileForm.controls['Full_Name'].setValue(element.Full_Name);
    this.updateUsageProfileForm.controls['Organization_Remote_Users_Id'].setValue(element.Organization_Remote_Users_Id);
    this.dialogRef = this.dialog.open(ref);
    this.dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.dataSource.data = this.dataSource.data.filter(value => {
          if (value.Organization_Remote_Users_Id == element.Organization_Remote_Users_Id) {
            value.Usage_Profile = result.Usage_Profile;
          }
          return true;
        });
        this.incrementUserCount(result.Usage_Profile);
        this.decrementUserCount(element.Usage_Profile);
      }
    });
  }
  onUpdateUsageProfile() {
    this.service.updateUsageProfile(this.updateUsageProfileForm.value).subscribe(async (data) => {
      if (data != undefined) {
        console.log(data);
        this.commonService.openSnackBarSuccess("User Profile Successfully Updated.", "X");
        this.dialogRef.close(this.updateUsageProfileForm.value);
      }
    });
  }
  async getRemoteUsers() {

    await this.service.getAllUser(this.addOrganizationForm.value.Organization_Mst_Id).subscribe(async (data: any[]) => {
      // 
      this.dataSource.data = data;
      console.log(this.dataSource.data);
      data.forEach(element => {
        //console.log(element);
        if (element.Usage_Profile == 0) {
          this.lightUserCount++;
        } else if (element.Usage_Profile == 1) {
          this.mediumUserCount++;
        }
        else {
          this.heavyUserCount++;
        }
      });
      this.totalUserCount = this.lightUserCount + this.mediumUserCount + this.heavyUserCount;
      if (this.totalUserCount < 10) {
        this.inpuEmployeeForm.controls['LightUsers'].setValue(10);
      } else {
        this.inpuEmployeeForm.controls['LightUsers'].setValue((Math.ceil(this.totalUserCount / this.stepForLightUser) * this.stepForLightUser));
      }
    });
  }
  incrementUserCount(index) {
    if (Number(index) == 0)
      this.lightUserCount++;
    if (Number(index) == 1)
      this.mediumUserCount++;
    if (Number(index) == 2)
      this.heavyUserCount++;

    this.totalUserCount++;
  }
  decrementUserCount(index) {
    if (Number(index) == 0)
      this.lightUserCount--;
    if (Number(index) == 1)
      this.mediumUserCount--;
    if (Number(index) == 2)
      this.heavyUserCount--;

    this.totalUserCount--;
  }

  /* Add RemoteUser*/
  hasBalance() {
    var response: boolean;
    if (Number(this.inpuEmployeeForm.value.LightUsers) > this.totalUserCount) {
      response = true;
    } else {
      response = false;
    }
    return response;
  }
  async onAddUser() {
    if(this.inpuEmployeeForm.value.LightUsers>this.dataSource.data.length){
      var addUserData = {
        organizationId: this.addOrganizationForm.controls['Organization_Mst_Id'].value
      }
      this.addUserRef = this.dialog.open(AddRemoteUserComponent, { data: addUserData });
      
      this.addUserRef.afterClosed().subscribe(async (result) => {
        if (result != undefined) {
          this.getAllEmployees();
        }
      });
    }
    else{
      this.commonService.openSnackBarError("You do not have sufficient balance to add more employee.", 'X');
    }
    
    








   }

  /*Edit Remote User*/
  // onEditRemoteUser(element) {

  //   this.editUserRef = this.dialog.open(EditRemoteUserComponent, { data: element });
  //   this.editUserRef.afterClosed().subscribe(result => {
  //     if (result != undefined) {
  //       // 
  //       if (result.Usage_Profile != element.Usage_Profile) {
  //         this.incrementUserCount(result.Usage_Profile);
  //         this.decrementUserCount(element.Usage_Profile);
  //       }
  //       this.dataSource.data = this.dataSource.data.filter((value => {
  //         if (value.Organization_Remote_Users_Id == result.Organization_Remote_Users_Id) {
  //           value.Email = result.Email;
  //           value.First_Name = result.First_Name;
  //           value.Last_Name = result.Last_Name;
  //           value.Full_Name = result.Full_Name;
  //           value.Password = result.Password;
  //           value.PhoneNo = result.PhoneNo;
  //           value.departmentId = result.departmentId;
  //           //value.de=result.departmentId;
  //           //value.Usage_Profile=result.Usage_Profile;
  //         }
  //         return true;
  //       }));
  //       //this.renderTables();
  //     }
  //   });
  // }
  EditEmployeePopup(empDetails): void {

    this.dialog.open(EditRemoteUserComponent,{data:empDetails}).afterClosed().toPromise().then(response => {
      if(response.Organization_Remote_Users_Id>0){
        this.commonService.openSnackBarSuccess("User edited successfully",'X');
        this.dialogRef.close();
      }
    })
  

} 

  /*Refresh Table Data*/
  renderTables() {
    // this.lightUserTable.renderRows();
    // this.mediumUserTable.renderRows();
    // this.heavyUserTable.renderRows();
  }
  async deleteUser() {
    // var user=new OrganizationRemoteUserRequest();
    // user.Organization_Remote_Users_Id=this.deleteUserForm.controls['Organization_Remote_Users_Id'].value;
    // user.organization_Mst_Id=this.deleteUserForm.controls['organizationId'].value;
    // user.Is_Active=this.deleteUserForm.controls['Is_Active'].value;
    // 

    this.service.deleteUser(this.deleteUserForm.controls['Organization_Remote_Users_Id'].value, Number(this.deleteUserForm.controls['departmentId'].value)).subscribe(async (data) => {

      if (data > 0) {
        this.commonService.openSnackBarSuccess("User Successfully Delete", 'X');
        this.decrementUserCount(this.deleteUserForm.controls['Usage_Profile'].value);
        this.dataSource.data = await this.dataSource.data.filter((value) => {
          return value.Email != this.deleteUserForm.controls['email'].value;
        });
        //this.renderTables();
        this.deleteUserRef.close();
      }
      else {
        this.commonService.openSnackBarSuccess("User Successfully Delete", 'X')
      }
    });
  }
  onDeleteRemoteUser(element, ref) {
    this.deleteUserRef = this.dialog.open(ref);
    this.deleteUserForm.controls['email'].setValue(element.Email);
    this.deleteUserForm.controls['organizationId'].setValue(element.organization_Mst_Id);
    this.deleteUserForm.controls['Usage_Profile'].setValue(element.Usage_Profile);
    this.deleteUserForm.controls['Is_Active'].setValue(element.Is_Active);
    this.deleteUserForm.controls['departmentId'].setValue(element.departmentId);
    this.deleteUserForm.controls['Organization_Remote_Users_Id'].setValue(element.Organization_Remote_Users_Id);
    this.deleteUserForm.controls['email'].disable();
  }
  onTimeDaySelectionChange() {


    if (this.addOrganizationForm.value.model == '2') {
      if (this.addOrganizationForm.value.dayTimeSelection.length == 5) {
        this.optionDiabled = true;
      }
      else {
        this.optionDiabled = false;
      }
    }
    if (this.addOrganizationForm.value.model == '3') {
      if (this.addOrganizationForm.value.dayTimeSelection.length == 6) {
        this.optionDiabled = true;
      }
      else {
        this.optionDiabled = false;
      }
    }
    console.log(this.addOrganizationForm.value.dayTimeSelection);
  }
  clearSelection() {
    this.addOrganizationForm.controls['dayTimeSelection'].reset();
    this.optionDiabled = false;
    this.planSelectedDays = [];
  }
  onModelValueChange() {
    if (this.addOrganizationForm.value.model != 4) {
      this.showTimeDaySelection = true;
      this.addOrganizationForm.controls['dayTimeSelection'].reset();
      this.optionDiabled = false;
      this.planSelectedDays = [];
      this.addOrganizationForm.controls['StartTime'].setValue("08:00");
      this.addOrganizationForm.controls['EndTime'].setValue("20:00");
      this.getUTCTime();
    }
    else {
      this.showTimeDaySelection = false;
      this.addOrganizationForm.controls['dayTimeSelection'].setValue(["0", "1", "2", "3", "4", "5", "6"]);
      this.planSelectedDays = ["0", "1", "2", "3", "4", "5", "6"];
      this.addOrganizationForm.controls['StartTime'].setValue("00:00");
      this.addOrganizationForm.controls['EndTime'].setValue("23:59");
    }
    console.log(this.addOrganizationForm.value.dayTimeSelection);
  }
  onNoClick() {
    this.dialogRef.close();
  }
  onPlanSubmit() {
  }
  onsubscriptionTypeChange() {
    if (this.paymentForm.value.subscriptionType == '0') {
      this.generateBill(0);
    }
    else {
      this.generateBill(1);
    }
  }

  getUTCTime() {
    if (this.addOrganizationForm.value.model != 4) {
      var startHour = this.addOrganizationForm.value.StartTime.split(":");
      var remainingHour, endHour, finalvalue;
      if (Number(startHour[0]) >= 12) {
        remainingHour = 24 - Number(startHour[0]);
        endHour = 12 - remainingHour;
        finalvalue = String(endHour) + ":" + startHour[1];
        this.addOrganizationForm.controls['EndTime'].setValue(finalvalue);
      }
      else {
        endHour = Number(startHour[0]) + 12;
        finalvalue = String(endHour) + ":" + startHour[1];
        this.addOrganizationForm.controls['EndTime'].setValue(finalvalue);
      }
    }
    const utcStartTime = new Date('01-01-2020 ' + this.addOrganizationForm.value.StartTime + ':00');
    const utcEndTime = new Date("1/1/2020 " + this.addOrganizationForm.value.EndTime + ":00");
    this.UTCStartTime = utcStartTime.getUTCHours() + ":" + utcStartTime.getUTCMinutes();
    this.UTCEndTime = utcEndTime.getUTCHours() + ":" + utcEndTime.getUTCMinutes();
  }
  async generateBill(type) {
    this.getUTCTime();
    var amount = 0;
    var planExpireDate = new Date(this.addOrganizationForm.value.StartAt);
    this.InvoiceDetails = [];
    var LightuserCost, MediumUserCost, HeavyUserCost, organizationCost;
    this.itemDetailList.forEach(element => {
      this.invoiceData = new Organization_Invoice_Details();
      if (element.Item_Type_Mst_Id == 1) {
        if (element.Plan_Type_Mst_Id == this.addOrganizationForm.value.model) {
          if (element.Item_Code.trim() == "L") {
            LightuserCost = element.Price;
            this.invoiceData.Item_Mst_Id = element.Item_Mst_Id;
            this.invoiceData.Quantity = Number(this.inpuEmployeeForm.value.LightUsers);
            this.InvoiceDetails.push(this.invoiceData);
          }
          // if (element.Item_Code.trim() == "M") {

          //   MediumUserCost = element.Price;
          //   this.invoiceData.Item_Mst_Id = element.Item_Mst_Id;
          //   this.invoiceData.Quantity = this.noOfMediumUsers;
          //   this.InvoiceDetails.push(this.invoiceData);
          // }
          // if (element.Item_Code.trim() == "H") {
          //   HeavyUserCost = element.Price;

          //   this.invoiceData.Item_Mst_Id = element.Item_Mst_Id;
          //   this.invoiceData.Quantity = this.noOfHeavyUsers;
          //   this.InvoiceDetails.push(this.invoiceData);
          // }
        }
      }
      else if (element.Item_Type_Mst_Id == 2 && element.Plan_Type_Mst_Id == 0) {
        organizationCost = element.Price;

        this.invoiceData.Item_Mst_Id = element.Item_Mst_Id;
        this.invoiceData.Quantity = 1;
        this.InvoiceDetails.push(this.invoiceData);
      }

    });
    amount = organizationCost + (this.inpuEmployeeForm.value.LightUsers * LightuserCost);
    this.models.forEach((item: any) => {
      if (item.Plan_Type_Mst_Id == this.addOrganizationForm.value.model) {
        this.discountRate = item.Yearly_Discount;
      }
    });
    if (type == 0) {
      planExpireDate.setMonth(planExpireDate.getMonth() + 1);
      this.addOrganizationForm.controls['ExpiresAt'].setValue(planExpireDate);
    }
    else {
      planExpireDate.setFullYear(planExpireDate.getFullYear() + 1);
      this.addOrganizationForm.controls['ExpiresAt'].setValue(planExpireDate);
      amount = (amount * 12);
      this.yearlyAmount = amount;
      this.totalDiscount = ((amount * this.discountRate) / 100);
      amount = amount - this.totalDiscount;
    }
    amount = Math.ceil(amount);
    this.paymentForm.controls['amount'].setValue(amount);
    console.log(this.InvoiceDetails);
  }
  UTCStartTime: any = "";
  UTCEndTime: any = "";

  async onSubmitPlan() {
    var PlanDetails = new planDetails();
    var InvoiceDate = new invoiceDate();
    if (this.addOrganizationForm.value.model != 1) {
      PlanDetails.Organisation_Mst_Id = this.addOrganizationForm.value.Organization_Mst_Id;
      PlanDetails.Plan_Type_Mst_Id = this.addOrganizationForm.value.model;
      PlanDetails.Expires_At = this.addOrganizationForm.value.ExpiresAt;
      PlanDetails.No_of_Users = this.inpuEmployeeForm.value.LightUsers;
      PlanDetails.No_Medium_Profile_Users = this.noOfMediumUsers;
      PlanDetails.No_Heavy_Profile_Users = this.noOfHeavyUsers;
      PlanDetails.Status = 2;
      PlanDetails.Is_Active = 0;
      PlanDetails.Days = this.planSelectedDays.sort().toString();

      PlanDetails.Start_Time = this.UTCStartTime;
      PlanDetails.End_Time = this.UTCEndTime;
      InvoiceDate.ToDate = this.addOrganizationForm.value.ExpiresAt;
      InvoiceDate.FromDate = this.addOrganizationForm.value.StartAt;
      console.log(InvoiceDate);
      this.service.submitPlan(PlanDetails, this.InvoiceDetails, InvoiceDate).subscribe(async (data) => {
        console.log(data);
        if (data) {
          this.dialogRef.close();
          this.dialogRef = this.dialog.open(SuccesfulInvoicePopupComponent, { data: data });
          this.dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
              this.purchaseRef.close();
            }
          });
        }
      });
      /* Add Software */
      await this.service.addSotware(Number(this.addOrganizationForm.value.Organization_Mst_Id), this.selectedSoftware).subscribe(async (data) => {
        console.log(data);
        if (data > 0) {
          console.log("softwares done");
        }
      });
    }
  }

  async onStepChange(event) {

    if (event.selectedIndex == 2) {
      this.generateBill(1);
      this.paymentForm.controls['subscriptionType'].setValue('1');
    }
    else if (event.selectedIndex == 1) {

      console.log(this.addOrganizationForm.value);
      if ((this.organizationData == null || this.organizationData.OrganizationId == undefined) && !this.organizationAdded) {
        var orgnization = new OrganizationDetails();
        if (this.addOrganizationForm.valid) {
          orgnization.OrganizationName = this.addOrganizationForm.value.organizationName;
          orgnization.OrganizationDomain = this.addOrganizationForm.value.domain + ".officebcp.com";
          orgnization.CommunicationEmail = this.addOrganizationForm.value.communcationEmail;
          orgnization.AdminEmail = this.addOrganizationForm.value.adminEmail;

          /* Create Organization*/
          this.organizationService.CreateOrganization(orgnization).subscribe(async (data) => {
            this.organizationAdded = true;
            if (data > 0) {
              this.addOrganizationForm.controls['Organization_Mst_Id'].setValue(data);
              this.commonService.openSnackBarSuccess("Organization Added ! Email with further details is sent to admin email", "X");
            }
            else {
              this.commonService.openSnackBarError("Can't add Organization,Something went Wrong", "X");
            }
          });
        }
      }
      else if(this.organizationAdded){
        var orgnization = new OrganizationDetails();
        if (this.addOrganizationForm.valid) {
          orgnization.OrganizationName = this.addOrganizationForm.value.organizationName;
          orgnization.OrganizationDomain = this.addOrganizationForm.value.domain + ".officebcp.com";
          orgnization.CommunicationEmail = this.addOrganizationForm.value.communcationEmail;
          orgnization.AdminEmail = this.addOrganizationForm.value.adminEmail;
        }
      }
      else{
        this.getAllEmployees();
      }
      if (this.softWareList[0] == undefined) {
        this.selectedSoftware = [];

        this.service.getAllSoftware().subscribe(async (data: any) => {
          this.softWareList = data;

          this.softWareList.forEach(element => {
            if (element.Category_Mst_Id == 2) {
              element.SoftwareList.forEach(data => {
                this.selectedSoftware.push(data.Software_Mst_Id);
              });
            }
          });
        });
      }
    }
  }
  onEmployeeNumberInputChange(index) {
    if (index == 0) {
      // if (this.inpuEmployeeForm.value.LightUsers < this.lightUserCount) {
      //   this.noOfLightUsers = Math.ceil(this.noOfLightUsers / 5) * 5;
      // }
      // this.noOfLightUsers = this.inpuEmployeeForm.value.LightUsers;
      // if (this.noOfLightUsers < 10) {
      //   this.noOfLightUsers = 10;
      // }
      // this.noOfLightUsers = Math.ceil(this.noOfLightUsers / 5) * 5;
      // this.inpuEmployeeForm.controls['LightUsers'].setValue(this.noOfLightUsers);
      if (Number(this.inpuEmployeeForm.value.LightUsers) <= 10 && this.totalUserCount <= 10) {
        this.inpuEmployeeForm.controls['LightUsers'].setValue(10);
      } else if (Number(this.inpuEmployeeForm.value.LightUsers) <= 10 && this.totalUserCount > 10) {
        this.inpuEmployeeForm.controls['LightUsers'].setValue((Math.ceil(this.totalUserCount / this.stepForLightUser) * this.stepForLightUser));
      }
      else {
        this.inpuEmployeeForm.controls['LightUsers'].setValue((Math.ceil(this.inpuEmployeeForm.value.LightUsers / this.stepForLightUser) * this.stepForLightUser));
      }
    }
    // if (index == 1) {
    //   if (this.inpuEmployeeForm.value.MediumUsers < this.mediumUserCount) {
    //     this.noOfMediumUsers = Math.ceil(this.mediumUserCount / 5) * 5;
    //   } else {
    //     this.noOfMediumUsers = this.inpuEmployeeForm.value.MediumUsers;
    //     this.noOfMediumUsers = Math.ceil(this.noOfMediumUsers / 5) * 5;
    //   }
    //   this.inpuEmployeeForm.controls['MediumUsers'].setValue(this.noOfMediumUsers);
    // }
    // if (index == 2) {
    //   if (this.inpuEmployeeForm.value.HeavyUsers < this.heavyUserCount) {
    //     this.noOfHeavyUsers = Math.ceil(this.heavyUserCount / 5) * 5;
    //   }
    //   else {
    //     this.noOfHeavyUsers = this.inpuEmployeeForm.value.HeavyUsers;
    //     this.noOfHeavyUsers = Math.ceil(this.noOfHeavyUsers / 5) * 5;
    //   }
    //   this.inpuEmployeeForm.controls['HeavyUsers'].setValue(this.noOfHeavyUsers);
    // }
  }

  onDecrementNumberOfUser(index) {
    if (index == 0) {
      if (this.totalUserCount <= 10) {
        if (this.inpuEmployeeForm.value.LightUsers - this.stepForLightUser >= 10) {
          this.inpuEmployeeForm.controls["LightUsers"].setValue(Number(this.inpuEmployeeForm.value.LightUsers) - this.stepForLightUser);
        }
      }
      else {
        if (this.inpuEmployeeForm.value.LightUsers - this.stepForLightUser >= this.totalUserCount) {
          this.inpuEmployeeForm.controls["LightUsers"].setValue(Number(this.inpuEmployeeForm.value.LightUsers) - this.stepForLightUser);
        }
      }
    }
    // if (index == 1) {
    //   if (this.noOfMediumUsers >= this.stepForMediumUser && (this.noOfMediumUsers - this.stepForMediumUser) >= this.mediumUserCount) {
    //     this.noOfMediumUsers -= this.stepForMediumUser
    //     this.inpuEmployeeForm.controls["MediumUsers"].setValue(this.noOfMediumUsers);
    //   }
    // }
    // if (index == 2) {
    //   if (this.noOfHeavyUsers >= this.stepForHeavyUser && (this.noOfHeavyUsers - this.stepForHeavyUser) >= this.heavyUserCount) {
    //     this.noOfHeavyUsers -= this.stepForHeavyUser
    //     this.inpuEmployeeForm.controls["HeavyUsers"].setValue(this.noOfHeavyUsers);
    //   }
    // }
    // this.totalNoOfUsers = this.noOfLightUsers + this.noOfMediumUsers + this.noOfHeavyUsers;
  }
  onIncrementNumberOfUser(index) {
    if (index == 0) {
      this.inpuEmployeeForm.controls["LightUsers"].setValue(Number(this.inpuEmployeeForm.value.LightUsers) + this.stepForLightUser);
    }
    // if (index == 1) {
    //   this.noOfMediumUsers += 5;
    //   this.inpuEmployeeForm.controls["MediumUsers"].setValue(this.noOfMediumUsers);
    // }
    // if (index == 2) {
    //   this.noOfHeavyUsers += 5;
    //   this.inpuEmployeeForm.controls["HeavyUsers"].setValue(this.noOfHeavyUsers);
    // }
    // this.totalNoOfUsers = this.noOfLightUsers + this.noOfMediumUsers + this.noOfHeavyUsers;
  }
  onDepartmentTabChanged(element) {

  }

  softwarewCheckChange(element) {
    if (element.option.selected == true) {
      if (this.selectedSoftware == undefined) {
        this.selectedSoftware = element.option.value;
      }
      else {
        this.selectedSoftware.push(element.option.value);
      }
    }
    else {
      this.selectedSoftware = this.selectedSoftware.filter(value => {
        return value != element.option.value;
      });
    }
    console.log(this.selectedSoftware);
  }
  onConfirmationPopup(confirmation) {
    this.dialogRef = this.dialog.open(confirmation);
  }
}