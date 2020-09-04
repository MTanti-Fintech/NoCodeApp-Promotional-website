import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ImportUserDTO } from 'src/app/shared/dto/import-on-premises-user.dto';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { EmployeeService } from '../employee.service';
import { CommonService } from 'src/app/shared/common.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DepartmentService } from '../../department/department.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-import-users-pop-up',
  templateUrl: './import-users-pop-up.component.html',
  styleUrls: ['./import-users-pop-up.component.scss']
})
export class ImportUsersPopUpComponent implements OnInit {
  departments: any[] ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ImportUsersPopUpComponent>,
    readonly apiService: EmployeeService,
    private readonly commonService: CommonService,
    private sanitizer: DomSanitizer,
    private departmentService:DepartmentService,
  ) { }

  uploadedFileDataSource = new MatTableDataSource<ImportUserDTO>();
  columns: any[] = [
    { field: 'UserIndex', name: 'Index', class: '' },
    { field: 'Full_Name', name: 'Full Name', class: '' },
    // { field: 'First_Name', name: 'First Name', class: '' },
    // { field: 'Last_Name', name: 'Last Name', class: '' },
    { field: 'Email', name: 'Email', class: '' },
    { field: 'PhoneNo', name: 'Phone No', class: '' },
    { field: 'Department', name: 'Department', class: '' },
    // { field: 'Usage_Profile', name: 'Usage_PRofile', class: '' },
    // { field: 'Password', name: 'Password' },
  ];
  displayedColumns = [];
  @ViewChild('importUsersPaginator') importUsersPaginator: MatPaginator;
  @ViewChild('importUsersSort') importUsersSort: MatSort;
record
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<ImportUserDTO>(this.allowMultiSelect, this.initialSelection);
  /** TABLE SELECTION */


  fileExtensionError = false;
  fileColumnError = false;
  fileMissingDataError = false;
  submitted = false;
  @ViewChild('csvReader') csvReader: any;

  fileUrl: SafeResourceUrl;
  downloadTemplateData: string = 'Full name,Email Id,Phone No,Department \n abc,abc1@gmai.com,1234567890,test \n abc,abc2@gmai.com,1234567890,test \n abc,abc3@gmai.com,1234567890,test \n abc,abc4@gmai.com,1234567890,test \n abc,abc5@gmai.com,1234567890,test \n abc,abc6@gmai.com,1234567890,test';

 async ngOnInit() {
    this.setDisplayedColumns();
    const blob = new Blob([this.downloadTemplateData], { type: 'csv' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    // this.fileUrl = window.URL.createObjectURL(blob);
    // window.open(this.fileUrl);
    await this.departmentService.getAllDepartments( this.data.organization_Mst_Id).subscribe(async (result: any) => {
          this.departments = result;
    });

  }
  async closeOnPremisesUsersBulkUploadDialog() {
    this.dialogRef.close({ submitted: this.submitted });
  }

  onSubmitImportOnPremisesUsers(form: NgForm) {
    this.apiService.postMultipleOnPremisesUser(this.selection.selected as ImportUserDTO[])
      .subscribe(() => {
        this.submitted = true;
        this.commonService.openSnackBarSuccess('Employee(s) added successfully', 'X');
        this.closeOnPremisesUsersBulkUploadDialog();
      });
  }

  setDisplayedColumns() {
    let i = 0;
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
      i = index;
    });
    this.displayedColumns[i + 1] = 'select';

  }

  /** TABLE SELECTION */
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.uploadedFileDataSource.data.length === this.selection.selected.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.uploadedFileDataSource.data.forEach(row => this.selection.select(row));
  }
  /** TABLE SELECTION END */

  uploadListener($event: any): void {

    const file = $event.srcElement.files[0];

    if (this.isValidCSVFile(file)) {

      this.fileExtensionError = false;

      const input = $event.target;
      const fileReader = new FileReader();
      fileReader.readAsText(input.files[0]);

      fileReader.onload = () => {
        const csvRecordsArray = (fileReader.result as string).split(/\r\n|\n/);
        
        if (this.getHeaderArray(csvRecordsArray).length === 4) {
          this.fileColumnError = false;
          
          this.uploadedFileDataSource.data = this.getUserRecordsArrayFromCSVFile(csvRecordsArray, 4);
          this.uploadedFileDataSource.paginator = this.importUsersPaginator;
          this.uploadedFileDataSource.sort = this.importUsersSort;
        } else {
          this.fileReset();
          this.fileColumnError = true;
        }
      };

      fileReader.onerror = () => {
        alert('error is occurred while reading file!');
      };


    } else {
      // alert('Please import valid .csv file.');
      this.fileReset();
      this.fileExtensionError = true;
    }
  }

  getUserRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: number) {
    let usersArray: ImportUserDTO[] = [];
    var depId = 1;
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const userDataString = csvRecordsArray[i];
      const userDataArray: string[] = userDataString.split(',');
      if (userDataArray.length === headerLength) {
        if(userDataArray[3] !== '')
        
        depId = this.departments.find( x => (x.Department_Name).toLowerCase() === (userDataArray[3].toLowerCase()) ) ? this.departments.find( x => x.Department_Name === userDataArray[3] ).Department_Mst_Id : 13 ;
        
          if ((userDataArray[0] !== '') && (userDataArray[1] !== '')) {
          this.fileMissingDataError = false;
          let user: ImportUserDTO = {
            UserIndex: i,
            Full_Name: userDataArray[0],
            // First_Name: userDataArray[1],
            // Last_Name: userDataArray[2],
            Email: userDataArray[1],
            PhoneNo: userDataArray[2],
            Department: userDataArray[3],
            DepartmentId: depId,
            Usage_Profile: 0,
            organization_Mst_Id : this.data.organization_Mst_Id,
            isValid: true,
          };
          if(userDataArray[1].match("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")!= null){
            if(this.data.capacity>0 ){
              this.selection.select(user);
              this.data.capacity -= 1;
            } 
          }
          else{
            user.isValid = false;
          }
          // user.DepartmentId = depId;
          usersArray.push(user);
        } else {
          this.fileMissingDataError = true;
          usersArray = [];
          this.selection.clear();
          break;
        }
      }
    }
    return usersArray;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  getHeaderArray(csvRecordsArr: any) {
    const headers = (csvRecordsArr[0] as string).split(',');
    const headerArray = [];
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = '';
    this.uploadedFileDataSource.data = [];
  }
  changeCount(event,row){
    if(event.checked == false){
      this.data.capacity += 1;
      this.selection.deselect(row);
     
    }
    if(event.checked == true){
      if(this.data.capacity > 0){
        this.data.capacity -=1;
        this.selection.select(row);
      }
      else{
        
        this.commonService.openSnackBarError('Maximum employee limit reached !','X')
        event.source.checked = false;
      }
    }
    this.isAllSelected()
  }
  /** UPLOAD CSV AND READ END */
  applyFilterStep(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.uploadedFileDataSource.filter = filterValue.trim().toLowerCase();
  }

}
