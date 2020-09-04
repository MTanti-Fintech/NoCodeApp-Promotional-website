import {SelectionModel} from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { DepartmentDetailsRequest } from './../../shared/Dto/department.DTO';
import { DepartmentService } from './department.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { JWTToken } from './../../shared/JWTToken';
import { CookieService } from './../../shared/cookie.service';
import { async } from 'rxjs/internal/scheduler/async';
import { CommonService } from 'src/app/shared/common.service';
import { isNumber } from 'util';
import { Validators, FormBuilder } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AddDepartmentDialogComponent } from 'src/app/shared/add-department-dialog/add-department-dialog.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  @ViewChild('departmentTable',{static:true}) departmentTable: MatTable<any>;
  displayedColumns: string[] = ['id', 'name','users','type','action'];
  dataSource = new MatTableDataSource<DepartmentDetailsRequest>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  userInfo:any;
  organizationId: any;
  addDepartmentForm: any;
  dialogRef: MatDialogRef<unknown, any>;
  add: boolean;
  departmentPresent: boolean = false;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private jwtToken : JWTToken,
    private departmentService:DepartmentService,
    private Cookie: CookieService,
    private commonService : CommonService,
    ) { }

  async ngOnInit(){
    this.userInfo=await this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
    this.commonService.OrganizationId.subscribe(async (id: any) => {
      if (id != null && id != undefined && isNumber(id)) {
        this.organizationId = id;
        this.getAllDepartments();
      }
      this.addDepartmentForm = this.fb.group({
        name: ['', [Validators.required]],
        id:[''],
      },{ updateOn: "blur" })

    })


  }
  async getAllDepartments(){
    await this.departmentService.getAllDepartments(this.organizationId).subscribe(async(data:any[])=>{
        this.dataSource.data = data;
  this.renderTables();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      (this.dataSource.data)
    })
  }
  addDepartment(ref){
    const departmentRef = this.dialog.open(AddDepartmentDialogComponent, { data: this.organizationId });
    departmentRef.afterClosed().subscribe(async (result) => {
      if (result != undefined) {
        this.commonService.openSnackBarSuccess('Department Added', 'x');
        this.getAllDepartments();

      }
    });
  
    // this.add=true;
    // this.addDepartmentForm.reset();
    // this.dialogRef = this.dialog.open(ref);
  }
  Add(){
  
    // var details = new DepartmentDetailsRequest();
    // details.Department_Name = this.addDepartmentForm.value.name;
    // details.Organization_Mst_Id = this.organizationId;
    // details.Is_active = 1;

    // this.departmentService.addDepartment(details).subscribe((res)=>{
      
    //   if(res>0){
    //     this.commonService.openSnackBarSuccess('Department Added Successfully','X');
    //     this.dialogRef.close();
    //     this.getAllDepartments();
    //   }
    //   else if(res == -1){
    //     this.departmentPresent = true;
    //   }
    //   else{
    //     this.commonService.openSnackBarError('Error in adding department !','X');
    //   }
    // })
  }
  editDepartment(ref,element){
    this.add=false;
    this.dialogRef = this.dialog.open(ref);
    this.addDepartmentForm.controls['name'].setValue(element.Department_Name);
    this.addDepartmentForm.controls['id'].setValue(element.Department_Mst_Id);
  }
  edit(){
    var details = new DepartmentDetailsRequest();
    details.Department_Name = this.addDepartmentForm.value.name;
    details.Organization_Mst_Id = this.organizationId;
    details.Is_active = 1;
    details.Department_Mst_id = this.addDepartmentForm.value.id;
    this.departmentService.editDepartment(details).subscribe((res)=>{
      
      if(res>0){
        this.commonService.openSnackBarSuccess('Departement edited successfully !','X')
        this.dialogRef.close();
        this.getAllDepartments();
      }
      else{
        this.commonService.openSnackBarError('Error in editing department !','X');
      }

    })
  }

  deleteDepartment(id:number){
    this.commonService.openConfirmDialog('Are you sure you want to delete this department ?','Delete Department').afterClosed().subscribe((res)=>{
      if(res){

        this.departmentService.deleteDepartment(id).subscribe((res)=>{
          if(res){
            this.commonService.openSnackBarSuccess('Department Deleted successfully !','X');
            this.getAllDepartments();
          }
          else{
            this.commonService.openSnackBarError('Error in deleting department !','X');
          }
        })
      }
    })
  }
  onNoClick(){
    this.dialogRef.close();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  renderTables()
  {
      this.departmentTable.renderRows();
  }
}
