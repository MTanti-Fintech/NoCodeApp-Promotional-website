import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Transaction } from 'src/app/shared/Dto/transaction.DTO';
import { CommonService } from 'src/app/shared/common.service';
import { InvoiceService } from '../invoice/invoice.service';

@Component({
  selector: 'app-edit-transaction',
  templateUrl: './edit-transaction.component.html',
  styleUrls: ['./edit-transaction.component.css']
})
export class EditTransactionComponent implements OnInit {

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<EditTransactionComponent>, private commonService: CommonService, private invoiceService: InvoiceService, @Inject(MAT_DIALOG_DATA) public transactionData) {
    this.editTransactionForm = this.fb.group({
      Source: ['', [Validators.required]],
      Payment_Amount: ['', [Validators.required, Validators.maxLength(this.transactionData.Amount)]],
      Payment_Notes: [''],
    });
    this.editTransactionForm.controls['Source'].setValue(this.transactionData.TransactionDetails.Source);
    this.editTransactionForm.controls['Payment_Amount'].setValue(this.transactionData.TransactionDetails.Payment_Amount);
    this.editTransactionForm.controls['Payment_Notes'].setValue(this.transactionData.TransactionDetails.Payment_Notes);
  }
  editTransactionForm: FormGroup;
  async ngOnInit() {
  }
  onNoClick() {
    this.dialogRef.close();
  }
  async onUpdateTransaction() {
    var transactionDetails = new Transaction();
    transactionDetails.Organization_Invoice_Id = Number(this.transactionData.Organization_Invoice_Id);
    transactionDetails.Payment_Amount = Number(this.editTransactionForm.get('Payment_Amount').value);
    transactionDetails.Payment_Notes = String(this.editTransactionForm.get('Payment_Notes').value);
    transactionDetails.Source = String(this.editTransactionForm.get('Source').value);
    transactionDetails.PaymentId = Number(this.transactionData.TransactionDetails.Payment_Id);
    if (transactionDetails.Payment_Amount < this.transactionData.Amount) {
      if (transactionDetails.Organization_Invoice_Id > 0 && transactionDetails.Payment_Amount > 0 && transactionDetails.PaymentId > 0 && transactionDetails.Source != '') {
        await this.invoiceService.udpateTransaction(transactionDetails).subscribe(async (data) => {
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
    else
    {
      this.commonService.openSnackBarError("Please check amount", 'X');
    }
  }
}
