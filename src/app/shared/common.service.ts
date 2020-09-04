import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../pages/login/login.service';
import { PasswordConfirmDialogComponent } from './password-confirm-dialog/password-confirm-dialog.component';
import { AccountActivateConfirmDialogComponent } from './account-activate-confirm-dialog/account-activate-confirm-dialog.component';
import { ActiveInactiveConfirmDialogComponent } from './active-inactive-confirm-dialog/active-inactive-confirm-dialog.component';
import { from, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public static MustChangePassword = false;
  public static GlobalVar: any = [];

  localStoragePermission: any = [];

  public OrganizationData = new BehaviorSubject(Object);
  sharedList = this.OrganizationData.asObservable();

  public OrganizationId = new BehaviorSubject(Number);
  sharedId = this.OrganizationId.asObservable();
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private service: LoginService
  ) { }

  // sendOrganizationData(data) {
  //   this.OrganizationData.next(data);
  // }
  sendOrganizationId(id) {
    this.OrganizationId.next(id);
  }
  setMustChangePassword(data) {
    CommonService.MustChangePassword = data;
  }

  async getUserPermission() {
    try {
      const data: any = await this.service.getUserPermission();
      if (data && data.length > 0) {
        data.push({
          is_active: 1,
          permission_id: null,
          permission_name: 'home',
          permissions: [2],
          total: 2,
          upm_id: null
        }
        );
      }
      CommonService.GlobalVar = [];
      this.localStoragePermission = [];
      if (data) {
        for (const userper of data) {
          userper.permission_name = userper.permission_name.toLowerCase();
          if (userper.total > 0) {
            this.localStoragePermission.push(Object.assign({}, userper));
          }
        }
      }
      CommonService.GlobalVar = this.localStoragePermission;
    } catch (e) {
      
    }
  }

  async checkMustChangePassword() {
    // const data: any = await this.service.userdetails();
    // if (data) {
    //   this.setMustChangePassword(data.fcp);
    // }
  }
  openConfirmDialog(msg, subject) {
    return this.dialog.open(MatConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      data: {
        message: msg,
        subject: subject
      },
      restoreFocus: false
    });
  }

  openActiveInactiveConfirmDialog(msg) {
    return this.dialog.open(ActiveInactiveConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      data: {
        message: msg
      },
      restoreFocus: false
    });
  }

  confirmDialogChangePassword(msg) {
    return this.dialog.open(PasswordConfirmDialogComponent, {
      width: '250px',
      data: {
        message: msg
      }
    });
  }
  confirmDialogAccountActivate(msg) {
    return this.dialog.open(AccountActivateConfirmDialogComponent, {
      width: '250px',
      data: {
        message: msg
      }
    });
  }

  openSnackBarSuccess(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['mft-message', 'success-message']
    });
  }

  openSnackBarError(message: string, action: string) {

    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['mft-message', 'error-message']
    });
  }

  openSnackBarWarning(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['mft-message', 'warning-message']
    });
  }

  openSnackBarInfo(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['mft-message', 'info-message']
    });
  }



  getModulePermission(moduleName: string): number {
    const originalElement = CommonService.GlobalVar.find(z => z.permission_name === moduleName.toLowerCase());
    if (originalElement) {
      return originalElement.permissions.reduce((a, b) => a + b, 0);
    }

    // If no permission found for element.
    return 0;
  }

  // Returns Excel's first row cell number based on index
  toColumnName(index: number) {
    let ret = '';
    for (let a = 1, b = 26; (index -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(((index % b) / a) + 65) + ret;
    }
    return ret + '1';
  }
}
