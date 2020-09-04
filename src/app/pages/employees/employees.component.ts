import {SelectionModel} from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { JWTToken } from './../../shared/JWTToken';
import { EmployeeService } from './employee.service';
import { CookieService } from './../../shared/cookie.service';
import { OrganizationRemoteUserRequest } from './../../shared/Dto/remoteUser.DTO';
import { CommonService } from 'src/app/shared/common.service';
import { isNumber } from 'util';
import { async } from 'rxjs/internal/scheduler/async';
import { AddRemoteUserComponent } from '../add-remote-user/add-remote-user.component';
import { EditRemoteUserComponent } from '../edit-remote-user/edit-remote-user.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormBuilder, Validators } from '@angular/forms';
import { ImportUsersPopUpComponent } from './import-users-pop-up/import-users-pop-up.component';
var moment = require('moment');
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})

export class EmployeesComponent implements OnInit {
  @ViewChild('lightUserTable',{static:true}) lightUserTable: MatTable<any>;
  @ViewChild('LightTablepaginator', { static: true }) Lightpaginator: MatPaginator;
  
  displayedColumns: string[] = ['Id','Email','Full_Name','lastLogin','status','remove'];
  dataSource = new MatTableDataSource<OrganizationRemoteUserRequest>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  userInfo:any;
  azure_status:any[]=[{status:0,value:"Pending"},{status:1,value:"Active"}];
  profile:any[]=[{Usage_Profile:0,value:"Light"},{Usage_Profile:1,value:"Medium"},{Usage_Profile:2,value:"Heavy"}]
  LastTabIndex=0;
  // dialog: any;
  i=0;
  organizationId: number;
  addUserRef: MatDialogRef<AddRemoteUserComponent, any>;
  editAzureStatusForm: any;
  employeePassword: any;
  dialogRef: MatDialogRef<unknown, any>;
  maxUsers: number;
  employeDetails: OrganizationRemoteUserRequest;
    constructor(
    private fb: FormBuilder,
    public dialog :MatDialog,
    private jwtToken : JWTToken,
    private employeeService:EmployeeService,
    private Cookie: CookieService,
    private commonService : CommonService,
    ) {
      this.editAzureStatusForm = this.fb.group({
        Azure_Status: ['', [Validators.required]],
        employeeId:[''],
      })
      this.employeePassword = this.fb.group({
        password: ['', [Validators.required]],
        employeeId:[''],
      })
     }
  async ngOnInit(){
    this.userInfo=await this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
    this.commonService.OrganizationId.subscribe(async (id: any) => {
      if (id != null && id != undefined && isNumber(id)) {
        this.organizationId = id;
        this.getAllEmployes();
      }
    });
 


  }
  getAllEmployes(){
    this.employeeService.GetAllEmployees(this.organizationId).subscribe(async(data:any[])=>{
      this.dataSource.data = data; 
       this.dataSource.data.forEach((x)=>{ 
        x.Usage_Profile_value = x.Usage_Profile ?  this.profile[x.Usage_Profile].value : "Light";
        x.Last_Login = moment(x.Last_Login).format('YYYY-MM-DD HH:mm:ss');
      })
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.employeeService.getTotalUsers(this.organizationId).subscribe((res:number)=>{
        this.maxUsers = res;
      })
    })
  }
  refreshTable(){
    this.getAllEmployes();
  }
  renderTables()
  {
      this.lightUserTable.renderRows();
      }
  
  /* Filter Light/Medium/Heavy Users*/
  addEmployee(type){
    var addUserData = {
      Usage_Profile: type,
      organizationId: this.organizationId
    }
    if(this.maxUsers>this.dataSource.data.length){
      this.addUserRef = this.dialog.open(AddRemoteUserComponent, { data: addUserData });
      this.addUserRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          this.getAllEmployes();
        }
      });
    }
    else{
      this.commonService.openSnackBarError("You do not have sufficient balance to add more employee.", 'X');
    }
    
    
  }
  DeleteConfirmPopup(element): void {
    this.commonService.openConfirmDialog('Are you sure you want to delete this employee ?','Delete Employee').afterClosed().subscribe((res)=>{
      if(res){

        this.employeeService.DeleteEmployee(element).subscribe((res)=>{
          if(res){
            this.commonService.openSnackBarSuccess('Employee Deleted successfully !','X');
            this.getAllEmployes();
          }
          else{
            this.commonService.openSnackBarError('Error in deleting employee !','X');
          }
        })
      }
    })}
  /*-------------------------------------Enable/Disable popup-------------------------------------*/
  EnableDisableConfirmPopup(event : MatSlideToggleChange,empId){
    if(event.checked){
      this.commonService.openConfirmDialog("Are you sure you want to activate the user","Enable Employee").afterClosed().subscribe((res=>{
        if(res){
          this.employeeService.DisableEmployee(1,empId).subscribe((res:any)=>{
            if(res == 0){

              event.source.checked = false;
              this.commonService.openSnackBarSuccess("Status Not Changed ! Please try again later",'X');
            }
            else{
              this.commonService.openSnackBarSuccess("Status Changed Successfully !",'X');
            }
          })
        }
        else{
          event.source.checked = false;
        }
      }))
    }
    else{
      this.commonService.openConfirmDialog("Are you sure you want to disable the employee","Disable Employee").afterClosed().subscribe((res=>{
        if(res){
          this.employeeService.DisableEmployee(0,empId).subscribe((res:any)=>{
            if(res == 0){
              event.source.checked = true;
              this.commonService.openSnackBarSuccess("Status Not Changed ! Please try again later",'X');
            }
            else{
              this.commonService.openSnackBarSuccess("Status Changed Successfully !",'X');
            } })
        }
        else{
          event.source.checked = false;
        }
      }))
    }

  }

  EditAzureStatus(ref,element){
    this.dialogRef = this.dialog.open(ref);
    this.dialogRef.afterClosed().subscribe((res)=>{
      this.getAllEmployes();
    })
    this.editAzureStatusForm.controls['Azure_Status'].setValue(element.Azure_Status);
    this.editAzureStatusForm.controls['employeeId'].setValue(element.Organization_Remote_Users_Id);
  }
  onNoClick(){
    this.dialogRef.close();
  }
  EditStatus(){
    this.employeeService.changeAzureStatus(this.editAzureStatusForm.controls['Azure_Status'].value,this.editAzureStatusForm.controls['employeeId'].value).subscribe((res)=>{

        if(res){
          this.commonService.openSnackBarSuccess("Status updated successfully !" , 'X');
          this.dialogRef.close()
        }
        else{
          this.commonService.openSnackBarError("Error in updating employee ststus",'X');
        }
      })
   }
  /*-------------------------------------Enable/Disable popup-------------------------------------*/
  EditEmployeePopup(empDetails): void {

          this.dialog.open(EditRemoteUserComponent,{data:empDetails}).afterClosed().toPromise().then(response => {
            if(response.Organization_Remote_Users_Id>0){
              this.commonService.openSnackBarSuccess("User edited successfully",'X');
              this.dialogRef.close();
            }
          })
        
    
  } 
  openBulkUploadPopUp() {
    if(this.maxUsers>this.dataSource.data.length){
      this.dialog.open(ImportUsersPopUpComponent, {
        data: {organization_Mst_Id:this.organizationId,capacity:(this.maxUsers-this.dataSource.data.length)},
        restoreFocus: false,
      }).afterClosed().toPromise().then(res => {
        if (res) {
          this.getAllEmployes();
        }
  
      });
   
    }
    else{
      this.commonService.openSnackBarError("You do not have sufficient balance to add more employee.", 'X');
    }
     }
     emailPopup(ref,data){
       this.dialogRef = this.dialog.open(ref);
       this.employeePassword.reset();
       this.employeDetails = data;
     }
     addPassword(){
        this.employeDetails.Password = this.employeePassword.controls['password'].value;
       this.employeeService.sendPasswordMail(this.employeDetails).subscribe((res)=>{
         if(res>0){
           this.dialog.closeAll();
          
           this.commonService.openSnackBarSuccess('Mail sent successfully !','X');
           this.getAllEmployes();
         }
         else{
           this.commonService.openSnackBarError('Error in sending email to the user !','X');
         }
       })
     }
     applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}


@Component({
  selector: 'delete-confirm-popup',
  templateUrl: './delete-confirm-popup.html',
  // styleUrls: ['./endpoint.component.scss']
})

export class DeleteConfirmPopupComponent{

}

@Component({
  selector: 'enable-disable-confirm-popup',
  templateUrl: './enable-disable-confirm-popup.html',
  // styleUrls: ['./endpoint.component.scss']
})

export class EnableDisableConfirmPopupComponent{

}

@Component({
  selector: 'edit-employee-popup',
  templateUrl: './edit-employee-popup.html',
  // styleUrls: ['./endpoint.component.scss']
})

export class EditEmployeePopupComponent{

}
