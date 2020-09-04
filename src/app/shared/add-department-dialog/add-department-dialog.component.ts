import { DepartmentService } from './../../pages/department/department.service';
import { DepartmentDetailsRequest } from './../Dto/department.DTO';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-add-department-dialog',
  templateUrl: './add-department-dialog.component.html',
  styleUrls: ['./add-department-dialog.component.css']
})
export class AddDepartmentDialogComponent implements OnInit {

  addDepartmentForm:FormGroup;
  departmentPresent: boolean = false;
  error: boolean = false;
  constructor(private fb:FormBuilder,public dialogRef:MatDialogRef<AddDepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public service:DepartmentService) { }
  
  ngOnInit(){
    this.addDepartmentForm=this.fb.group({
      Department_Name:['',[Validators.required]],
      Department_Mst_Id:[Number]
    });
    // 
  }
  onNoClick()
  {
    this.dialogRef.close();
  }
  async onInsertDepartment()
  {
    var department=new DepartmentDetailsRequest();
    department.Department_Name=this.addDepartmentForm.value.Department_Name;
    department.Organization_Mst_Id=Number(this.data);
    department.Is_active=1;
    department.Entry_By=1;
    
    await this.service.addDepartment(department).subscribe((deptId)=>{
      
      if(deptId>0)
      {
        this.addDepartmentForm.controls['Department_Mst_Id'].setValue(deptId);
        this.dialogRef.close(this.addDepartmentForm.value);
      }
      else if(deptId == -1){
        this.departmentPresent = true;
      }
      else{
        this.error = true;
      }
    });
  }
}
