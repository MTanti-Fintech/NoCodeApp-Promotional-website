import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OnPremisesUserDTO } from '../../shared/dto';
import { OnPremisesUsersService } from './on-premises-users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';

import { DeleteConfirmationDialogComponent } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { AddEditOnPremisesUserPopUpComponent } from './add-edit-on-premises-user-pop-up/add-edit-on-premises-user-pop-up.component';
import { EditRemoteUserComponent }from '../edit-remote-user/edit-remote-user.component';
import { CommonService } from 'src/app/shared/common.service';
import { EmployeeService } from 'src/app/pages/employees/employee.service';
import { OrganizationEmployeeDetails } from 'src/app/shared/Dto/organization-employee';
import { isNumber } from 'util';
import { OrganizationRemoteUserRequest } from 'src/app/shared/Dto/remoteUser.DTO';
import { AddRemoteUserComponent } from '../add-remote-user/add-remote-user.component';

@Component({
  selector: 'app-on-premises-users',
  templateUrl: './on-premises-users.component.html',
  styleUrls: ['./on-premises-users.component.css']
})
export class OnPremisesUsersComponent implements OnInit {

  onPremisesUserDataSource = new MatTableDataSource<OnPremisesUserDTO>();
  columns: any[] = [
    // { field: 'Organization_On_Premises_Users_Id', name: 'Organization_On_Premises_Users_Id', class: '' },
    // { field: 'Organization_Mst_Id', name: 'Organization_Mst_Id', class: '' },
    { field: 'FullName', name: 'Full Name', class: '' },
    { field: 'FirstName', name: 'First Name', class: '' },
    { field: 'LastName', name: 'Last Name', class: '' },
    { field: 'Email', name: 'Email', class: '' },
    { field: 'PhoneNo', name: 'Phone No', class: '' },
    // { field: 'Password', name: 'Password' },
  ];
  displayedColumns = [];
  organizationId;


  @ViewChild('onPremisesUsersPaginator') onPremisesUsersPaginator: MatPaginator;
  @ViewChild('onPremisesUsersSort') onPremisesUsersSort: MatSort;

  constructor(
    readonly apiService: OnPremisesUsersService,
    private readonly commonService: CommonService,
    public dialog: MatDialog,
    private readonly employeeService : EmployeeService,
  ) { }

  ngOnInit(): void {
    this.commonService.OrganizationId.subscribe(async (id: any) => {
      
      if (id != null && id != undefined && isNumber(id)) {
      this.getAllOnPremisesUsers(id);
      }
      this.organizationId = id;
    })
    this.setDisplayedColumns();
    
  }

  /**  */
  getAllOnPremisesUsers(organizationid:number) {
    this.apiService.getOnPremisesUsers(organizationid).subscribe((res: OnPremisesUserDTO[]) => {
      
      this.onPremisesUserDataSource.data = res;
      this.onPremisesUserDataSource.sort = this.onPremisesUsersSort;
      this.onPremisesUserDataSource.paginator = this.onPremisesUsersPaginator;
    });
  }
  /**  */

  /** Filter, Search and Display */
  filterOnPremisesUsers(filterValue: string) {
    this.onPremisesUserDataSource.filter = filterValue.trim().toLowerCase();
  }

  setDisplayedColumns() {
    let i = 0;
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
      i = index;
    });
    // if (this.hasEditOrDeletePermission(this.currentModulePermission)) {
    this.displayedColumns[i + 1] = 'action';
    this.displayedColumns[i + 1] = 'add_as_remote_user';
    // }
  }
  /** Filter, Search and Display END */


  

  openDeleteConfirmationPopUp(user: OnPremisesUserDTO): void {
    this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { entity: 'On Premises User' }
    }).afterClosed().toPromise().then(confirmation => {
      if (confirmation) {
        user.IsActive = 0;
        this.apiService.putOnPremisesUser(user).subscribe(res => {
          if (res >= 1) {
            this.getAllOnPremisesUsers(this.organizationId);
            this.commonService.openSnackBarSuccess('On Premises User deleted successfully', 'X');
          } else {
            this.commonService.openSnackBarError('Error deleting On Premises User', 'X');
          }
        });
      }
    });
  }

  openEditOnPremisesUserPopUp(user: OnPremisesUserDTO) {
    this.dialog.open(AddEditOnPremisesUserPopUpComponent, {
      width: '50%',
      maxWidth: '100vw',
      minWidth: '1024px',
      data: { user: Object.assign({}, user) },
      restoreFocus: false,
    }).afterClosed().toPromise().then(res => {
      if (res) {
        this.getAllOnPremisesUsers(this.organizationId);
      }
    });
  }
  addAsRemote(event,element){
    this.commonService.openConfirmDialog("Are you sure you want to add this user as remote user", "Add as Employe").afterClosed().subscribe((res) => {
      if (res) {
    var empDetails = new OrganizationRemoteUserRequest();
    empDetails.Full_Name = element.FullName;
    empDetails.First_Name = element.FirstName;
    empDetails.Last_Name = element.LastName;
    empDetails.PhoneNo = element.PhoneNo;
    empDetails.Is_Active = element.IsActive;
    empDetails.Email = element.Email;
    empDetails.organization_Mst_Id = element.OrganizationMstId;
    empDetails.Password = element.Password;
      this.dialog.open(AddRemoteUserComponent,{data:empDetails}).afterClosed().toPromise().then(response => {
        if(response.Organization_Remote_Users_Id>0){
          this.getAllOnPremisesUsers(this.organizationId);
      this.commonService.openSnackBarSuccess("User successfully added Employee",'X');
        }
      })
    }
    else{
      this.commonService.openSnackBarError("Error adding user as remote user",'X');
    }
  
    // })
  // }
})
  }
  openAddOnPremisesUserPopUp() {
    this.dialog.open(AddEditOnPremisesUserPopUpComponent, {
      data: { user: {} },
      restoreFocus: false,
    }).afterClosed().toPromise().then(res => {
      if (res) {
        this.getAllOnPremisesUsers(this.organizationId);
      }
    });
  }

  openMoveOnPremisesUserToEmployee(user: OnPremisesUserDTO) {

  }
}
