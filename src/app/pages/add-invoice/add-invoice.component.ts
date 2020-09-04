import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddRemoteUserComponent } from '../add-remote-user/add-remote-user.component';
import { InvoiceService } from '../invoice/invoice.service';
import { ItemDetails } from 'src/app/shared/Dto/item_mst.DTO';
import { InvoiceItemRequest } from 'src/app/shared/Dto/invoice-item.DTO';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent implements OnInit {
  @Input() editable: boolean = false;
  totalDays: any;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddInvoiceComponent>, private commonService: CommonService, private invoiceService: InvoiceService,@Inject(MAT_DIALOG_DATA) public itemData, @Inject(MAT_DIALOG_DATA) public organizationData) {
    this.addInvoiceItemForm = this.fb.group({
      ItemName: ['', [Validators.required]],
      Quantity: ['', [Validators.required]],
      Price: ['', [Validators.required]],
      Total: ['', [Validators.required]]
    });
  }
  addInvoiceItemForm: FormGroup;
  items: Array<ItemDetails> = [];
  async ngOnInit() {
    await this.invoiceService.getAllItemList().subscribe(async (result: any) => {
      console.log(result);
      debugger;
      this.items = result;
    });
    await this.invoiceService.getInvoiceItems(this.organizationData.Organization_Invoice_Id).then(async (data: any[]) => {
      this.totalDays = data[0].TotalDays;
    })
  }
  onNoClick() {
    this.dialogRef.close();
  }
  async onAddInvoiceItem() {
    var itemDetails = new InvoiceItemRequest();
    itemDetails.OrganizationInvoiceId = Number(this.organizationData.Organization_Invoice_Id);
    itemDetails.ItemId = Number(this.addInvoiceItemForm.get('ItemName').value);
    itemDetails.Amount = Number(this.addInvoiceItemForm.get('Total').value);
    itemDetails.Quantity = Number(this.addInvoiceItemForm.get('Quantity').value);
    if (itemDetails.OrganizationInvoiceId > 0 && itemDetails.ItemId > 0 && itemDetails.Amount > 0 && itemDetails.Quantity > 0) {
      await this.invoiceService.addInvoiceItem(itemDetails).subscribe(async (data) => {
        if (data > 0) {
          this.commonService.openSnackBarSuccess("Item Successfully Added", 'X');
          this.dialogRef.close(true);
          // this.invoiceService.getInvoiceItems(this.organizationData.Organization_Invoice_Id).subscribe(async (data: any[]) => {
          // })
        }
        else {
          this.commonService.openSnackBarError("Something went wrong,Please Try again.", 'X');
        }
      });
    };
  }

onItemChange(ele) {
  console.log
  this.addInvoiceItemForm.controls['Price'].setValue(this.items.find(id => id.Item_Mst_Id === ele.value).Price);
  this.addInvoiceItemForm.controls['Quantity'].setValue(this.items.find(id => id.Item_Mst_Id === ele.value).Quantity);

}
onQuantityValue(element) {
  if (this.addInvoiceItemForm.get('ItemName').value > 0) {
    var qty = Number(this.addInvoiceItemForm.get('Quantity').value);
    if (qty > 0) {
      var price = Number(this.addInvoiceItemForm.get('Price').value);
      if (price > 0 && qty > 0) {
        this.addInvoiceItemForm.controls['Total'].setValue(this.calculateTotal(qty, price));
      }
    }
    else {
      this.addInvoiceItemForm.controls['Total'].setValue('');
    }
  }
}
calculateTotal(qty, price) {
  if(this.totalDays == 365)
  return qty * price * 12;
  else
    return qty * price;

}

}
