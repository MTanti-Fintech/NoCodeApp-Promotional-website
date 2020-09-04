import { Component, OnInit, Inject, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceItemRequest } from 'src/app/shared/Dto/invoice-item.DTO';
import { InvoiceService } from '../invoice/invoice.service';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-edit-invoice-item',
  templateUrl: './edit-invoice-item.component.html',
  styleUrls: ['./edit-invoice-item.component.css']
})
export class EditInvoiceItemComponent implements OnInit {
  @Input() editable: boolean = false;
  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<EditInvoiceItemComponent>, private commonService: CommonService,private invoiceService: InvoiceService,@Inject(MAT_DIALOG_DATA) public itemData,@Inject(MAT_DIALOG_DATA) public organizationData) {
    this.editInvoiceItemForm = this.fb.group({
      ItemName: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      Total :['',[Validators.required]]
    });
    this.editInvoiceItemForm.controls['ItemName'].setValue(this.itemData.ItemDetails.Item_Name);
    this.editInvoiceItemForm.controls['Quantity'].setValue(this.itemData.ItemDetails.Quantity);
    this.editInvoiceItemForm.controls['Price'].setValue(this.itemData.ItemDetails.Price);
    if((this.itemData.ItemDetails.TotalDays) == 365)
      this.editInvoiceItemForm.controls['Total'].setValue(parseInt(this.itemData.ItemDetails.Price) * parseInt(this.itemData.ItemDetails.Quantity) * 12);
    else
      this.editInvoiceItemForm.controls['Total'].setValue(parseInt(this.itemData.ItemDetails.Price) * parseInt(this.itemData.ItemDetails.Quantity));
  }
  editInvoiceItemForm: FormGroup;
  async ngOnInit(){

  }
  onNoClick() {
    this.dialogRef.close();
  }
  async oneditInvoiceItem() {

    var item = new InvoiceItemRequest();
    item.OrganizationInvoiceId = this.itemData.Organization_Invoice_Id;
    item.ItemId = Number(this.itemData.ItemDetails.Item_Mst_Id);
    item.Amount = Number(this.editInvoiceItemForm.get('Total').value);
    item.Quantity = Number(this.editInvoiceItemForm.get('Quantity').value);
    if(item.Quantity > 0 && item.OrganizationInvoiceId >0 && item.Amount > 0 && item.ItemId)
    {
      await this.invoiceService.editInvoiceItem(item).subscribe(async (data) => {
        if (data > 0) {
          this.commonService.openSnackBarSuccess("Item Edited Successfully", 'X');
          this.dialogRef.close(true);
        }
        else {
          this.commonService.openSnackBarError("Something went wrong,Please Try again.", 'X');
        }
      });
    }
  }
  calculateTotal(qty, price) {
    if(this.itemData.ItemDetails.TotalDays == 365) 
       return qty * price * 12 ;
    else
    return qty * price;
  }
  onQuantityValue(element) {
    if (this.editInvoiceItemForm.get('ItemName').value !="") {
      var qty = Number(this.editInvoiceItemForm.get('Quantity').value);
      if (qty > 0) {
        var price = Number(this.editInvoiceItemForm.get('Price').value);
        if (price > 0 && qty > 0) {
          this.editInvoiceItemForm.controls['Total'].setValue(this.calculateTotal(qty, price));
        }
      }
      else {
        this.editInvoiceItemForm.controls['Total'].setValue('');
      }
    }
  }

}
