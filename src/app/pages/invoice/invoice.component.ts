import { AddTransactionComponent } from './../add-transaction/add-transaction.component';
import { ItemDetails } from './../../shared/Dto/item_mst.DTO';
import { OrganizationComponent } from './../organization/organization.component';
import { EditInvoiceItemComponent } from './../edit-invoice-item/edit-invoice-item.component';
import { AddInvoiceComponent } from './../add-invoice/add-invoice.component';
import { InvoiceService } from './invoice.service';
import { UserInfo } from './../../shared/Dto/UserInfo';
import { Component, OnInit, SecurityContext, ViewChild, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DepartmentDetailsRequest } from 'src/app/shared/Dto/department.DTO';
import { JWTToken } from 'src/app/shared/JWTToken';
import { CookieService } from 'src/app/shared/cookie.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EditTransactionComponent } from '../edit-transaction/edit-transaction.component';
import { elementAt } from 'rxjs/operators';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  @Input() editable: boolean = false;
  @ViewChild('invoiceItemsTable', { static: true }) invoiceItemsTable: MatTable<any>;
  @ViewChild('transactionTable', { static: true }) transactionTable: MatTable<any>;
  @ViewChild('itemPaginator', { static: true }) itemTablePaginator: MatPaginator;
  @ViewChild('transactionPaginator', { static: true }) transactionTablePaginator: MatPaginator;
  displayedColumns: string[] = ['Id', 'Item Name', 'Quantity',  'TotalPrice', 'Actions'];
  displayedCols: string[] = ['Id', 'Source', 'Amount', 'Timestamp', 'Actions'];
  dataSource = new MatTableDataSource<DepartmentDetailsRequest>();
  datasource = new MatTableDataSource<DepartmentDetailsRequest>();
  status: { [key: number]: string } = { 0: "Invoice Generation Pending", 1: "Payment Pending", 2: "Payment Received" };
  Month: { [key: number]: string } = { 0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December" };
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  userInfo: any;
  trnsactionTotalAmount = 0;
  itemTotalAmount = 0;
  buttonDisabled: boolean;
  dialogRef: any = null;
  itemDataSouce = null;
  transactionDataSouce =null;
  constructor(private fb: FormBuilder, public dialog: MatDialog, public dialogReg: MatDialogRef<InvoiceComponent>, private jwtToken: JWTToken, private dom: DomSanitizer, private commonService: CommonService, private Cookie: CookieService, private invoiceService: InvoiceService, @Inject(MAT_DIALOG_DATA) public organizationData) { }
  addOrganizationInvoiceForm: FormGroup;
  
  async ngOnInit() {
    this.addOrganizationInvoiceForm = this.fb.group({
      organizationName: ['', Validators.required],
      Status: ['', [Validators.required]],
      invoiceNumber: ['', [Validators.required]],
      Month: ['', [Validators.required]],
      pendingAmount : ['', [Validators.required]],
    });
    
    
    
    this.addOrganizationInvoiceForm.controls['organizationName'].setValue(this.organizationData.OrganizationName);
    this.addOrganizationInvoiceForm.controls['invoiceNumber'].setValue(this.organizationData.Invoice_Number);
    this.addOrganizationInvoiceForm.controls['Month'].setValue(this.organizationData.Invoice_Number.split('-')[0]);
    this.addOrganizationInvoiceForm.controls['Status'].setValue(this.organizationData.Status + "");
    this.userInfo = await this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
    // this.dataSource.filterPredicate = (data: any, filtersJson: string) => {
    //   const matchFilter = [];
    //   const filters = JSON.parse(filtersJson);

    //   filters.forEach(filter => {
    //     const val = data[filter.id] === null ? '' : data[filter.id];
    //     matchFilter.push(val == filter.value);
    //   });
    //   return matchFilter.every(Boolean);
    // };
    
    await this.getAllItems();
    await this.getAllTransactions();
    
    this.calculateAmountDifference();
  }
  async getAllTransactions()
  {
    await this.invoiceService.getAllTransactions(this.organizationData.Organization_Invoice_Id).then(async (data: any[]) => {
      this.datasource.data = data;
      this.renderTables();
    });
    return;
  }
  getDisplayedColumnsForItemList(): string[] {
   const columnD = [
      { def: 'Id', show: true },
      { def: 'Item Name', show: true },
      { def: 'Quantity', show: true },
      { def: 'TotalPrice', show: true },
      { def: 'Actions', show: (this.userInfo.Roles != 1 ? false : true) },
    ];
    return columnD
      .filter(cd => cd.show)
      .map(cd => cd.def);
  }
  getDisplayedColumns(): string[] {
    const columnDefinitions = [
       { def: 'Id', showColumn: true },
       { def: 'Source', showColumn: true },
       { def: 'Amount', showColumn: true },
       { def: 'Timestamp', showColumn: true },
       { def: 'Actions', showColumn: (this.userInfo.Roles != 1 ? false : true) },
     ];
     return columnDefinitions
       .filter(cd => cd.showColumn)
       .map(cd => cd.def);
   }
  async getAllItems()
  {
    await this.invoiceService.getInvoiceItems(this.organizationData.Organization_Invoice_Id).then(async (data: any[]) => {
      this.dataSource.data = data;
      this.renderTables();
    });
    return;
  }
  renderTables() { };
  ngAfterViewInit() {
    this.dataSource.paginator = this.itemTablePaginator;
    this.dataSource.sort = this.sort;
    this.datasource.paginator = this.transactionTablePaginator;
    this.datasource.sort = this.sort;
  }
  onNoClick() {
    this.dialogReg.close();
  }
  onAddInvoice() {
    this.dialogRef = this.dialog.open(AddInvoiceComponent, { data: this.organizationData });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.invoiceService.getInvoiceItems(this.organizationData.Organization_Invoice_Id).then((data: any) => {
          this.dataSource.data = data;
          this.calculateAmountDifference();
        });
      }
    });
  }
  onUpdateInvoiceStatus() {
    status = this.addOrganizationInvoiceForm.get('Status').value;
    if (status) {
      this.invoiceService.updateInvoiceStatus(this.organizationData.Organization_Invoice_Id, parseInt(status)).subscribe((res: any) => {
        if (res > 0) {
          this.commonService.openSnackBarSuccess("Data Updated", "X");
          this.dialogReg.close();
        }
        else {
          this.commonService.openSnackBarSuccess("Update Request failed", "X");
        }
      });
    }
    else {
      this.commonService.openSnackBarSuccess("Select Invoice Status", "X");
    }
  }
  onAddTransaction() {
    this.organizationData.Amount = Number(this.calculateItemAmountTotal() - this.calculateTransactionAmountTotal());
    this.dialogRef = this.dialog.open(AddTransactionComponent, { data: this.organizationData });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.invoiceService.getAllTransactions(this.organizationData.Organization_Invoice_Id).then((data: any) => {
          this.datasource.data = data;
          this.calculateAmountDifference();
        });
      }
    });
  }
  onEditInvoiceItems(element: any) {
    var data = {
      Organization_Invoice_Id: this.organizationData.Organization_Invoice_Id,
      ItemDetails: element
    }
    this.dialogRef = this.dialog.open(EditInvoiceItemComponent, { data: data });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.invoiceService.getInvoiceItems(this.organizationData.Organization_Invoice_Id).then((data: any) => {
          this.dataSource.data = data;
          this.calculateAmountDifference();
        });
      }
    });
  }
  onEditTransactionItems(element: any) {
    var data = {
      Organization_Invoice_Id: this.organizationData.Organization_Invoice_Id,
      Amount: Number(Number(this.calculateItemAmountTotal() - this.calculateTransactionAmountTotal())),
      TransactionDetails: element
    }
    this.dialogRef = this.dialog.open(EditTransactionComponent, { data: data });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.invoiceService.getAllTransactions(this.organizationData.Organization_Invoice_Id).then((data: any) => {
          this.datasource.data = data;
        });
      }
    });
  }
  onDeleteInvoiceItem(data) {
    var message = "Are you sure you want to delete this Item ?";
    message = this.dom.sanitize(SecurityContext.HTML, message);
    this.commonService.openConfirmDialog("Are you sure you want to delete this Item ?", "Delete Item").afterClosed().subscribe((res: any) => {
      if (res) {
        this.invoiceService.deleteInvoiceItem(this.organizationData.Organization_Invoice_Id, data.Item_Mst_Id).subscribe((res: any) => {
          if (res > 0) {
            this.commonService.openSnackBarSuccess("Item Deleted from Item List", "X");
            this.invoiceService.getInvoiceItems(this.organizationData.Organization_Invoice_Id).then(async (data: any[]) => {

              this.dataSource.data = data;
              this.renderTables();
            })
          }
          else {
            this.commonService.openSnackBarSuccess("Delete request failed", "X");
          }
        })
      }
    })

  }
  onDeleteTransactionItem(data) {
    var message = "Are you sure you want to delete this Transaction ?";
    message = this.dom.sanitize(SecurityContext.HTML, message);
    this.commonService.openConfirmDialog("Are you sure you want to delete this Transaction ?", "Delete Transaction").afterClosed().subscribe((res: any) => {
      if (res) {
        this.invoiceService.deleteTransaction(data.Payment_Transaction_Dtl_Id, data.Payment_Id).subscribe((res: any) => {
          if (res > 0) {
            this.commonService.openSnackBarSuccess("Transaction Deleted from Transaction List", "X");
            this.invoiceService.getAllTransactions(this.organizationData.Organization_Invoice_Id).then(async (data: any[]) => {
              this.datasource.data = data;
              this.calculateAmountDifference();
            })
          }
          else {
            this.commonService.openSnackBarSuccess("Delete request failed", "X");
          }
        })
      }
    })

  }
  async calculateAmountDifference() {
    // this.dataSource.data.forEach(element => {
    //   this.itemTotalAmount = this.itemTotalAmount + element.Amount;
    // }); 
    // this.datasource.data.forEach(element => {
    //   this.trnsactionTotalAmount = this.trnsactionTotalAmount + element.Payment_Amount;
    // })
    var amount = Number(this.calculateItemAmountTotal() - this.calculateTransactionAmountTotal()).toFixed(2);
    this.addOrganizationInvoiceForm.controls['pendingAmount'].setValue('$ ' + Number(amount).toFixed(2) );
    return amount;
  }
  public calculateItemAmountTotal() {
    return this.dataSource.data.reduce((sum, v) => sum += v.Amount, 0);
  }
  public calculateTransactionAmountTotal() {
    return this.datasource.data.reduce((sum, v) => sum += v.Payment_Amount, 0);
  }
  public calculatePendingAmount(){
    return this.calculateAmountDifference();
  }
  applyitemFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applytransactionFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
}