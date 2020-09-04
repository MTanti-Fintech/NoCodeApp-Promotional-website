import { debounceTime } from 'rxjs/operators';
import { CommonService } from 'src/app/shared/common.service';
import { DepartmentService } from './../department/department.service';
import { async } from '@angular/core/testing';
import { DepartmentDetailsRequest } from './../../shared/Dto/department.DTO';
import { AddDepartmentDialogComponent } from './../../shared/add-department-dialog/add-department-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchasePaidPlanService } from './../purchase-paid-plan/purchase-paid-plan.service';
import { OrganizationRemoteUserRequest } from './../../shared/Dto/remoteUser.DTO';

import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, Inject, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { of, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-add-remote-user',
  templateUrl: './add-remote-user.component.html',
  styleUrls: ['./add-remote-user.component.css']
})
export class AddRemoteUserComponent implements OnInit,OnDestroy {
  @ViewChild(MatSelect, { static: true }) departmentSelect: MatSelect;
  hideUsage: boolean;
  @Input()
  debounceTime = 500;

  @Output()
  debounceClick = new EventEmitter();

  private clicks = new Subject();
  private subscription: Subscription;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private snackbar: MatSnackBar, private service: PurchasePaidPlanService, private departmentService: DepartmentService, private fb: FormBuilder, private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddRemoteUserComponent>, private commonService: CommonService) {
    this.addUserForm = this.fb.group({
      organization_Mst_Id: [''],
      Organization_Remote_Users_Id: [''],
      Email: ['', [Validators.required, Validators.email]],
      // First_Name: ['', []],
      // Last_Name: ['', []],
      Full_Name: ['', [Validators.required]],
      PhoneNo: ['', []],
      Password: ['', []],
      departmentId: ['', [Validators.required]],
      Usage_Profile: [''],
      Is_Active: []
    },
    { updateOn: "blur" });
  }
  addUserForm: FormGroup;
  usageTypes: { [key: number]: string } = { 0: "Light", 1: "Medium", 2: "Heavy" };
  departments: Array<DepartmentDetailsRequest> = [];

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  async ngOnInit() {
    this.subscription = this.clicks.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(e => this.debounceClick.emit(e));
    this.hideUsage = false;
    // this.addUserForm.controls['departmentId'].setValue(1);
    this.addUserForm.controls['Is_Active'].setValue(1);
    // if (this.data.Usage_Profile != null || this.data.Usage_Profile != undefined) {
    this.addUserForm.controls['organization_Mst_Id'].setValue(this.data.organizationId);

    this.addUserForm.controls['Usage_Profile'].setValue(this.data.Usage_Profile);
    this.hideUsage = true;
    await this.departmentService.getAllDepartments(this.addUserForm.controls['organization_Mst_Id'].value).subscribe(async (result: any) => {
      this.departments = result;
      this.addUserForm.controls['departmentId'].setValue(13);
    });
    this.addUserForm.controls['Usage_Profile'].setValue('Light');
    // }
    // else{
    //   await  this.syncData();
    //   await  this.getAllDepartMents();
    // }

  }
  // async getAllDepartMents()
  // {
  //   await this.departmentService.getAllDepartments(this.addUserForm.controls['organization_Mst_Id'].value).subscribe(async (result: any) => {
  //         this.departments = result;
  //   });

  //}
  // async syncData()
  // {
  //   this.addUserForm.controls['Email'].setValue(this.data.Email);
  //   this.addUserForm.controls['First_Name'].setValue(this.data.First_Name);
  //   this.addUserForm.controls['Last_Name'].setValue(this.data.Last_Name);
  //   this.addUserForm.controls['Full_Name'].setValue(this.data.Full_Name);
  //   this.addUserForm.controls['Password'].setValue(this.data.Password);
  //   this.addUserForm.controls['PhoneNo'].setValue(this.data.PhoneNo);
  //   if(this.data.Organization_Mst_Id!=undefined)
  //     this.addUserForm.controls['organization_Mst_Id'].setValue(this.data.Organization_Mst_Id);
  //   else if(this.data.organization_Mst_Id!=undefined)
  //     this.addUserForm.controls['organization_Mst_Id'].setValue(this.data.organization_Mst_Id);

  // }
  async onInsertUser() {
    var user = new OrganizationRemoteUserRequest();
    user.Email = this.addUserForm.value.Email;
    // user.First_Name = this.addUserForm.value.First_Name;
    // user.Last_Name = this.addUserForm.value.Last_Name;
    user.Full_Name = this.addUserForm.value.Full_Name;
    user.Password = this.addUserForm.value.Password;
    user.PhoneNo = this.addUserForm.value.PhoneNo;
    user.Usage_Profile = Number(0);
    user.departmentId = Number(this.addUserForm.value.departmentId);
    user.organization_Mst_Id = this.addUserForm.value.organization_Mst_Id;
    user.Entry_By = 1;

     this.service.addRemoteUser(user).subscribe(async (data) => {
      if (data > 0) {
        this.addUserForm.controls['Organization_Remote_Users_Id'].setValue(data);
        this.commonService.openSnackBarSuccess("User Successfully Added", 'X');
        this.dialogRef.close(this.addUserForm.value);
      }
      else {
        this.commonService.openSnackBarError("Something went wrong,Please Try again.", 'X');
      }
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
  onDepartmentChange(ele) {
  }
  async addDepartment() {
    const departmentRef = this.dialog.open(AddDepartmentDialogComponent, { data: this.addUserForm.value.organization_Mst_Id });
    departmentRef.afterClosed().subscribe(async (result) => {
      if (result != undefined) {
        this.commonService.openSnackBarSuccess('Department Added', 'x');
        this.departments.push(result);

      }
    });
  }

}
