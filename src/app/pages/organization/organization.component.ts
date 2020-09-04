import {SelectionModel} from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { JWTToken } from './../../shared/JWTToken';
import { CookieService } from './../../shared/cookie.service';
import { OrganizationRemoteUserRequest } from './../../shared/Dto/remoteUser.DTO';
import { OrganizationService } from './organization.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OrganizationDetails } from 'src/app/models/OrganizationDetails';
import { CommonService } from 'src/app/shared/common.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  @ViewChild('organizationTable',{static:true}) organizationTable: MatTable<any>;

  displayedColumns: string[] = ['Id','Organization Name', 'Domain', 'Communication Email','Code','Subscription Id','action'];
  dataSource = new MatTableDataSource<OrganizationRemoteUserRequest>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  userInfo:any;
  LastTabIndex=0;
  // dialog: any;
  i=0;
  editOrganizationForm: FormGroup;
  dialogRef: any;
  constructor(
    private fb: FormBuilder,
    public dialog :MatDialog,
    private jwtToken : JWTToken,
    private Cookie: CookieService,
    private organizationService : OrganizationService,
    private commonService :CommonService,
    ) { }
  async ngOnInit(){
    this.userInfo=await this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
    this.getAllOrganization();

    this.editOrganizationForm=this.fb.group({
      Organizationname:['',[Validators.required]],
      CommunicationEmail:['',[Validators.required,Validators.email]],
      Subscription_Id:['',[Validators.required]],
      Code:['',[Validators.required]],
      OrganizationDomain:['',[Validators.required]]
    },{ updateOn: "blur" })
  }
  async getAllOrganization(){
    await this.organizationService.GetAllOrganization(this.userInfo.UserId).subscribe(async(data:any[])=>{
      
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      console.log(this.dataSource);
    })

  }
  renderTables()
  {
      this.organizationTable.renderRows();
      // this.mediumUserTable.renderRows();
      // this.heavyUserTable.renderRows();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  /* Filter Light/Medium/Heavy Users*/
  // async onTabChanged(element)
  // {
  //   this.LastTabIndex=element.index;
  //   const tableFilters = [];
  //   if(element.index==0)
  //   {
  //     this.applyFilter(0);
  //   }
  //   else if(element.index==1)
  //   {
  //     this.applyFilter(1);
  //   }
  //   else
  //   {
  //     this.applyFilter(2);
  //   }
  // }
  disableOrganization(orgDetails : any){

  }
  deleteOrganization(orgDetails : any){

  }

  editOrganizationDetails(ref,orgDetails : any){
    console.log(orgDetails);
    this.dialogRef = this.dialog.open(ref);

    this.editOrganizationForm.setValue({
      Organizationname  : orgDetails.organization_name,
      CommunicationEmail  :orgDetails.Communication_Email,
      OrganizationDomain  : orgDetails.Domain,
      Code : orgDetails.Code,
      Subscription_Id  : orgDetails.subscription_id
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
  saveDetails(){

    this.organizationService.updateOrganization(this.editOrganizationForm.value).subscribe(async(res:any)=>{
      // 
      if(res.responseStatus > 0 ){
        this.dialogRef.close();
        this.commonService.openSnackBarSuccess(res.responseMessage,'X');

        this.dataSource.data[await this.dataSource.data.findIndex(x=>x.organization_Mst_Id == res.organization_Mst_Id)] = res;
        
        this.dataSource.data   = this.dataSource.data
        // this.addAdminTable.renderRows();
      }
    })
  }
  EnableDisableConfirmPopup(event : MatSlideToggleChange,orgId){
    if(event.checked){
      this.commonService.openConfirmDialog("Are you sure you want to activate the organization","Enable Organization").afterClosed().subscribe((res=>{
        if(res){
          this.organizationService.changeStatus(1,orgId).subscribe((res:any)=>{
            if(res == 0){

              event.source.checked = false;
              this.commonService.openSnackBarSuccess("Status Not Changed ! Please try again later",'X');
            }
            else{
              this.commonService.openSnackBarSuccess("Status Changed Successfully !",'X');
            }
          })
        }
      }))
    }
    else{
      this.commonService.openConfirmDialog("Are you sure you want to disable the organization","Disable Organiaztion").afterClosed().subscribe((res=>{
        if(res){
          this.organizationService.changeStatus(0,orgId).subscribe((res:any)=>{
            if(res == 0){
              event.source.checked = true;
              this.commonService.openSnackBarSuccess("Status Not Changed ! Please try again later",'X');
            }
            else{
              this.commonService.openSnackBarSuccess("Status Changed Successfully !",'X');
            } })
        }
      }))
    }

  }


}
