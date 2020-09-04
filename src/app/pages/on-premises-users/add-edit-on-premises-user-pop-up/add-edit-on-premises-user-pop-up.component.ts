import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { OnPremisesUserDTO } from 'src/app/shared/dto';
import { OnPremisesUsersService } from '../on-premises-users.service';
import { CommonService } from 'src/app/shared/common.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-import-users-pop-up',
  templateUrl: './add-edit-on-premises-user-pop-up.component.html',
  styleUrls: ['./add-edit-on-premises-user-pop-up.component.css']
})
export class AddEditOnPremisesUserPopUpComponent implements OnInit {

  onPremisesUser: OnPremisesUserDTO;
  onPremises:boolean;

  constructor(
    public dialogRef: MatDialogRef<AddEditOnPremisesUserPopUpComponent>,
    readonly apiService: OnPremisesUsersService,
    private readonly commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  ngOnInit(): void {
    this.onPremisesUser = this.data.user;
    this.onPremises = true;
  }

  async closeOnPremisesUsersAddEditDialog() {
    this.dialogRef.close({});
  }

  onSubmitOnPremisesUsers(form: NgForm) {
    if (form.valid) {
      if (this.onPremisesUser.OrganizationOnPremisesUsersId === undefined || this.onPremisesUser.OrganizationOnPremisesUsersId === null) {
        this.onPremisesUser.OrganizationMstId = this.data.OrganizationMstId;
        this.apiService.postOnPremisesUser(this.onPremisesUser).subscribe(res => {
          if (res >= 1) {
            this.commonService.openSnackBarSuccess('On Premises User added successfully', 'X');
            this.closeOnPremisesUsersAddEditDialog();
          } else {
            this.commonService.openSnackBarError('Error adding On Premises User', 'X');
          }
        });

      } else {
        ;
        this.apiService.putOnPremisesUser(this.onPremisesUser).subscribe(res => {
          if (res >= 1) {
            this.commonService.openSnackBarSuccess('On Premises User updated successfully', 'X');
            this.closeOnPremisesUsersAddEditDialog();
          } else {
            this.commonService.openSnackBarError('Error updating On Premises User', 'X');
          }
        });

      }
    }
  }

}
