import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Transaction } from 'src/app/shared/Dto/transaction.DTO';
import { CommonService } from 'src/app/shared/common.service';
import { InvoiceService } from '../invoice/invoice.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent implements OnInit {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddTransactionComponent>, private commonService: CommonService, private invoiceService: InvoiceService, @Inject(MAT_DIALOG_DATA) public organizationData) {
  }
  addTransactionForm: FormGroup;
  async ngOnInit() {
    this.addTransactionForm = this.fb.group({
      Source: ['', [Validators.required]],
      Amount: ['', [Validators.required, Validators.max(this.organizationData.Amount)]],
      PaymentNote: [''],
    },
    { updateOn: "blur" });
    this.addTransactionForm.controls['Amount'].setValue(this.organizationData.Amount);

  }
  onNoClick() {
    this.dialogRef.close();
  }
  async onAddTransaction() {
    var transactionDetails = new Transaction();
    transactionDetails.Organization_Invoice_Id = Number(this.organizationData.Organization_Invoice_Id);
    transactionDetails.Payment_Amount = Number(this.addTransactionForm.get('Amount').value);
    transactionDetails.Payment_Notes = String(this.addTransactionForm.get('PaymentNote').value);
    transactionDetails.Source = String(this.addTransactionForm.get('Source').value);
    if (transactionDetails.Payment_Amount < this.organizationData.Amount) {
      if (transactionDetails.Organization_Invoice_Id > 0 && transactionDetails.Payment_Amount > 0 && transactionDetails.Source != '') {
        await this.invoiceService.addTransaction(transactionDetails).subscribe(async (data) => {
          if (data > 0) {
            this.commonService.openSnackBarSuccess("Item Successfully Added", 'X');
            this.dialogRef.close(true);
          }
          else {
            this.commonService.openSnackBarError("Something went wrong,Please Try again.", 'X');
          }
        });
      };
    }
    else{
      this.commonService.openSnackBarError("Please check the amount !",'X');
    }
  }
}
