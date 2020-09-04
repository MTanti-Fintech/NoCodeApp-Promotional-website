import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { JWTToken } from 'src/app/shared/JWTToken';
import { CookieService } from 'src/app/shared/cookie.service';
import { BillingService } from './billing.service';
import { InvoiceComponent } from './../invoice/invoice.component';
import { DepartmentDetailsRequest } from 'src/app/shared/Dto/department.DTO';
import { OrganizationInvoice } from 'src/app/shared/Dto/organization-invoice';
import { CommonService } from 'src/app/shared/common.service';
import { isNumber } from 'util';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Color } from 'ng2-charts';
import { DomSanitizer } from '@angular/platform-browser';
import { InvoiceService } from '../invoice/invoice.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  @ViewChild('billingTable', { static: true }) billingTable: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['id', 'Organization Name', 'Invoice No', 'Invoice CreatedDate', 'Amount', 'Month', 'Status', 'Action'];

  Month: { [key: number]: string } = { 0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December" };
  // status: { [key: number]: string } = { 0: "Pending", 1: "Healthy", 2: "Healthy" };
  dataSource = new MatTableDataSource<OrganizationInvoice>();
  userInfo: any;
  dialogRef: any = null;
  fileUrl;
  invoiceData: any[];
  status: any[] = [{ status: 0, value: "Invoice Generation Pending" }, { status: 1, value: "Payment Pending" }, { status: 2, value: "Setup Pending" }, { status: 3, value: "Active" }];
  OrganizationInvoice = new OrganizationInvoice();
  editStatusForm: any;
  constructor(
    public dialog: MatDialog,
    private jwtToken: JWTToken,
    private billingService: BillingService,
    private Cookie: CookieService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private invoiceService: InvoiceService,
  ) {
    this.searchInvoiceForm = this.fb.group({
      FromDate: [Date],
      ToDate: [Date]
    });
    this.editStatusForm = this.fb.group({
      status: ['', [Validators.required]],
      invoiceId: [''],
    })

  }

  applyFilter(event: Event) {
    this.allSearch = true;
    const tableFilters = [];
    const filterValue = (event.target as HTMLInputElement).value;
    tableFilters.push({ id: 'OrganizationName', value: filterValue });
    this.dataSource.filter = JSON.stringify(tableFilters);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = [];
  public barChartType = 'line';
  public barChartLegend = true;
  public barChartColors: Color[] = [
    { backgroundColor: '#EE7B11', borderColor: 'black', pointBackgroundColor: '#5A6881' },
  ]
  public barChartData = [
    {
      data: [1000, 0, 1000, 199740, 0],
      label: 'Cost per month($)'
    }
  ];
  searchInvoiceForm: FormGroup;
  organizationId: number = 0;
  async ngOnInit() {
    let temp = new Date();
    console.log(temp.toLocaleTimeString());
    this.userInfo = await this.jwtToken.parseJWTToken(this.Cookie.getCookie('usertoken'));
    this.searchByDate();
    this.commonService.OrganizationId.subscribe(async (id: any) => {
      if (id != null && id != undefined && isNumber(id)) {
        this.organizationId = id;
        this.billingService.getInvoicesMonthwise(this.organizationId).subscribe((res:any[])=>{
          console.log(res);
          let data = [];

          
          this.barChartData = [];
          this.barChartLabels = [];
          res.forEach(element => {
            this.barChartLabels.push(this.Month[element.month-1]);
            data.push(element.Net_Amount);
          });
          this.barChartData = [
            {
              data : data,
              label: 'Cost per month($)'
            }
          ];
        })
        var fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 5);
        var toDate = new Date();
        toDate.setDate(toDate.getDate() + 1);
        await this.billingService.getTranctionsByDate(this.organizationId, fromDate, toDate)
          .then((data: any) => {
            this.dataSource.data = data;
            console.log(data);
            this.renderTables();
          });

        this.searchInvoiceForm.controls['FromDate'].setValue(fromDate);
        this.searchInvoiceForm.controls['ToDate'].setValue(toDate);

      }
    })
    this.showClear = true;
    const data = 'some text';
    const blob = new Blob([data], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

  }
  allSearch: boolean = true;
  searchByDate() {
    var temp = "may";
    this.dataSource.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);
      if (this.allSearch) {
        matchFilter.push(data['Invoice_Number'].toString().trim().toLowerCase().includes((filters[0].value).toString().trim().toLowerCase()) ||
          data['OrganizationName'].toString().trim().toLowerCase().includes((filters[0].value).toString().trim().toLowerCase()) ||
          data['Total_Amount'].toString().trim().toLowerCase().includes((filters[0].value).toString().trim().toLowerCase()));
      }
      else {
        filters.forEach(filter => {
          const val = data[filter.id] === null ? '' : data[filter.id];
          var searchDate = new Date(val);
          matchFilter.push(searchDate >= this.searchInvoiceForm.value.FromDate && searchDate <= this.searchInvoiceForm.value.ToDate);
        });
      }
      return matchFilter.every(Boolean);
    };

  }
  async searchInvoiceByDate() {

    this.searchInvoiceForm.value.ToDate.setHours(23, 59, 59);
    
    await this.billingService.getTranctionsByDate(this.organizationId, this.searchInvoiceForm.value.FromDate, this.searchInvoiceForm.value.ToDate)
      .then((data: any) => {
        console.log(data);
        this.dataSource.data = data;
      });
    this.showClear = true;
  }
  renderTables() {
    this.billingTable.renderRows();
  }
  onChangeExpiryDate(ref) {
    this.dialogRef = this.dialog.open(ref);
  }
  onEditInvoice(data: any) {
    this.dialogRef = this.dialog.open(InvoiceComponent, {
      data: data,
      panelClass: 'addEditInvoice-main'
    });
  }
  showClear: boolean = false;
  clearFilter() {
    this.searchInvoiceForm.reset();
    this.dataSource.filter = '';
    this.showClear = false;
    this.billingService.getAllInvoices(this.organizationId).subscribe((data: any) => {
      this.dataSource.data = data;
    });
  }
  openDialogAddEditInvoice() {
    const dialogRef = this.dialog.open(AddEditInvoicePopup, {
      panelClass: "invoicePopup-main"
    });
  }
  onEditInvoiceStatus(ref, element) {
    console.log(element)
    this.dialogRef = this.dialog.open(ref);
    this.editStatusForm.controls['status'].setValue(element.Status);
    this.editStatusForm.controls['invoiceId'].setValue(element.Organization_Invoice_Id);

  }
  EditStatus() {
    this.invoiceService.updateInvoiceStatus(this.editStatusForm.controls['invoiceId'].value, this.editStatusForm.controls['status'].value).subscribe((res) => {
      if (res > 0) {
        this.dialog.closeAll();
        this.commonService.openSnackBarSuccess('Status changed successfully', 'X');
        this.ngOnInit();
      }
      else {
        this.commonService.openSnackBarError('Error in changing status !', 'X');
      }
    })
  }
  onNoClick() {
    this.dialogRef.close();
  }

}



export interface invoiceItemsCol {
  itemName: string;
  quantity: string;
  price: string;
  totalPrice: string;
  action: string;
}

const invoiceItemsColData: invoiceItemsCol[] = [
  { itemName: "Organization cost per month", quantity: '1', price: "200", totalPrice: "200", action: "" },
  { itemName: "12/5 user cost", quantity: '30', price: "7", totalPrice: "210", action: "" },
  { itemName: "Organization cost per month", quantity: '1', price: "200", totalPrice: "200", action: "" },
  { itemName: "12/5 user cost", quantity: '30', price: "7", totalPrice: "210", action: "" },
  { itemName: "Organization cost per month", quantity: '1', price: "200", totalPrice: "200", action: "" }
];

export interface tranDetailsCol {
  source: string;
  amount: string;
  timestamp: string;
  action: string;
}

const tranDetailsColData: tranDetailsCol[] = [
  { source: "Paypal", amount: '410', timestamp: "2:24:00 PM", action: "" },
  { source: "Paypal", amount: '410', timestamp: "2:24:00 PM", action: "" },
  { source: "Paypal", amount: '410', timestamp: "2:24:00 PM", action: "" },
  { source: "Paypal", amount: '410', timestamp: "2:24:00 PM", action: "" },
  { source: "Paypal", amount: '410', timestamp: "2:24:00 PM", action: "" },
];

@Component({
  selector: 'addEditInvoice-popup',
  templateUrl: 'addEditInvoice-popup.html',
  styleUrls: ['./billing.component.scss']
})

export class AddEditInvoicePopup {
  displayedColumnsInvoiceItems: string[] = ['itemName', 'quantity', 'price', 'totalPrice', 'action'];
  dataSourceInvoiceItems = new MatTableDataSource(invoiceItemsColData);

  displayedColumnsTranDetails: string[] = ['source', 'amount', 'timestamp', 'action'];
  dataSourceTranDetails = new MatTableDataSource(tranDetailsColData);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
}

