import { DepartmentService } from './../department/department.service';
import { CommonService } from 'src/app/shared/common.service';
import { async } from '@angular/core/testing';
import { PurchasePaidPlanService } from './../purchase-paid-plan/purchase-paid-plan.service';
import { OrganizationRemoteUserRequest } from './../../shared/Dto/remoteUser.DTO';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { DepartmentDetailsRequest } from 'src/app/shared/Dto/department.DTO';

@Component({
  selector: 'app-edit-remote-user',
  templateUrl: './edit-remote-user.component.html',
  styleUrls: ['./edit-remote-user.component.css']
})
export class EditRemoteUserComponent implements OnInit {

  constructor(private departmentService:DepartmentService,private commonService:CommonService,private fb:FormBuilder,
              public dialogRef:MatDialogRef<EditRemoteUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,private service:PurchasePaidPlanService)
    {
      this.editUserForm=this.fb.group({
        //usageType:['',Validators.required]
        organization_Mst_Id:[''],
        Organization_Remote_Users_Id:[''],
        Email:['',[Validators.required,Validators.email]],
        First_Name:['',[Validators.required]],
        Last_Name:['',[Validators.required]],
        Full_Name:['',[Validators.required]],
        PhoneNo:['',[Validators.required]],
        Password:['',[Validators.required]],
        departmentId:['',[Validators.required]],
        usageType:['',Validators.required],
        Is_Active:['',Validators.required],
        // departmentId:['',[Validators.required]]
      },{ updateOn: "blur" });
     }
  editUserForm:FormGroup;
  // usageTypes: {[key:number]:string}={0:"Light",1:"Medium",2:"Heavy"};
  usageTypes:any[]=[{Usage_Profile:0,value:"Light"},{Usage_Profile:1,value:"Medium"},{Usage_Profile:2,value:"Heavy"}]
  departments: Array<DepartmentDetailsRequest> = [];
  async ngOnInit(){
    await this.syncData();
    await this.getAllDepartMents()
  }
  async getAllDepartMents()
  {

    await this.departmentService.getAllDepartments( this.editUserForm.controls['organization_Mst_Id'].value).subscribe(async (result: any) => {
          

          this.departments = result;
          this.editUserForm.controls['departmentId'].setValue(this.data.departmentId);
    });

  }
  async syncData()
  {
    this.editUserForm.controls['Email'].setValue(this.data.Email);
    this.editUserForm.controls['First_Name'].setValue(this.data.First_Name);
    this.editUserForm.controls['Last_Name'].setValue(this.data.Last_Name);
    this.editUserForm.controls['Full_Name'].setValue(this.data.Full_Name);
    this.editUserForm.controls['Password'].setValue(this.data.Password);
    this.editUserForm.controls['PhoneNo'].setValue(this.data.PhoneNo);
    if(this.data.Usage_Profile!=undefined)
      this.editUserForm.controls['usageType'].setValue(this.usageTypes[this.data.Usage_Profile].value);
    if(this.data.Organization_Mst_Id!=undefined)
      this.editUserForm.controls['organization_Mst_Id'].setValue(this.data.Organization_Mst_Id);
    else if(this.data.organization_Mst_Id!=undefined)
      this.editUserForm.controls['organization_Mst_Id'].setValue(this.data.organization_Mst_Id);
    this.editUserForm.controls['Organization_Remote_Users_Id'].setValue(this.data.Organization_Remote_Users_Id);
  }
  async onEditUser()
  {
    var user=new OrganizationRemoteUserRequest();
    user.Email=this.editUserForm.value.Email;
    user.First_Name=this.editUserForm.value.First_Name;
    user.Last_Name=this.editUserForm.value.Last_Name;
    user.Full_Name=this.editUserForm.value.Full_Name;
    user.Password=this.editUserForm.value.Password;
    user.PhoneNo=this.editUserForm.value.PhoneNo;
    user.Usage_Profile=Number(this.editUserForm.value.usageType);
    user.Organization_Remote_Users_Id=this.editUserForm.value.Organization_Remote_Users_Id;
    user.organization_Mst_Id=this.editUserForm.value.organization_Mst_Id;
    user.departmentId=Number(this.editUserForm.value.departmentId);
    debugger;
    await this.service.updateUser(user).subscribe(async(data)=>{
      if(data>0)
      {
        // this.commonService.openSnackBarSuccess("User Successfully Added",'X');
        this.dialogRef.close(this.editUserForm.value);
      }
      else
      {
        this.commonService.openSnackBarSuccess("Something Went Wrong",'X');
      }
    });
  }
  onNoClick()
  {
    this.dialogRef.close();
  }
  onDepartmentChange(event){

  }
}
