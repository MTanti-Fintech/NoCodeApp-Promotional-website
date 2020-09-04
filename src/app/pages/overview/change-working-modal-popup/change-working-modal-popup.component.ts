import { SuccesfulInvoicePopupComponent } from './../../../shared/succesful-invoice-popup/succesful-invoice-popup.component';
import { Router } from '@angular/router';
import { planDetails } from 'src/app/shared/Dto/planDetails.DTO';
import { Organization_Invoice_Details } from './../../../shared/Dto/invoiceDetails.DTO';
import { CommonService } from './../../../shared/common.service';
import { OverviewService } from './../overview.service';
import { async } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PurchasePaidPlanService } from './../../purchase-paid-plan/purchase-paid-plan.service';
import { Time, KeyValuePipe, KeyValue } from '@angular/common';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { Key } from 'readline';
import { invoiceDate } from 'src/app/shared/Dto/invoiceDate.DTO';

@Component({
  selector: 'app-change-working-modal-popup',
  templateUrl: './change-working-modal-popup.component.html',
  styleUrls: ['./change-working-modal-popup.component.scss']
})
export class ChangeWorkingModalPopupComponent implements OnInit {

  @ViewChild('successInvoice') successRef: TemplateRef<any>;
  constructor(private dialog: MatDialog, private router: Router, private commonService: CommonService, private changeModelRef: MatDialogRef<ChangeWorkingModalPopupComponent>, private overviewService: OverviewService, private fb: FormBuilder, private purchaseService: PurchasePaidPlanService, @Inject(MAT_DIALOG_DATA) public data) {
    this.changeModelForm = this.fb.group({
      models: this.fb.array([])
    });
    this.modelList = [];
  }
  days: { [key: number]: string } = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };
  changeModelForm: FormGroup;
  modelList: any[];
  selectedDays: any[];
  priceList: any[];
  async ngOnInit() {
    var i = 0;
    try {
      this.selectedDays = this.data.Days.toString().split(',');
      await this.purchaseService.getAllItemList().then(async (data: any) => {
        this.priceList = data;
        // console.log(this.priceList);
      });
      await this.purchaseService.getAllPlans().then(async (data: any) => {
        this.modelList = data;
        var allowedDays = 0;
        var StartHour = "00"
        var StartMinute = "00"
        this.modelList.forEach(async (element) => {
          if (element.Plan_Type_Mst_Id == 2) {
            allowedDays = 5;
          }
          if (element.Plan_Type_Mst_Id == 3) {
            allowedDays = 6;
          }
          if (element.Plan_Type_Mst_Id == 4) {
            allowedDays = 7;

          }
          if (element.Plan_Type_Mst_Id != 1) {
            if (element.Plan_Type_Mst_Id == this.data.PlanId) {
              if (this.data.Start_Time.Hours == 0) {
                StartHour = "00"
              }
              if (this.data.Start_Time.Minutes == 0) {
                StartMinute = "00";
              }
              // StartTime=this.data.Start_Time.Hours+":"+this.data.Start_Time.Minutes;
              (<FormArray>this.changeModelForm.get('models')).push(this.addModelToFormArray(element.Plan_Name, element.Plan_Type_Mst_Id, allowedDays, StartHour + ":" + StartMinute));
              this.setDays(i, element);
            }
            else {
              StartHour = "08";
              StartMinute = "00";
              (<FormArray>this.changeModelForm.get('models')).push(this.addModelToFormArray(element.Plan_Name, element.Plan_Type_Mst_Id, allowedDays, StartHour + ":" + StartMinute));
            }
            if (element.Plan_Type_Mst_Id == 4 && element.Plan_Type_Mst_Id != this.data.PlanId) {
              console.log("called");
              (<FormArray>this.changeModelForm.get('models')).controls[i].get("StartTime").setValue("00:00");
              this.setDays(i, element);
            }
            this.setPrice(i);
            this.setEndTime(i);
            i++;
          }
        });
      });
      // console.log(this.changeModelForm);
      await this.setPayableAmount();
      console.log(this.changeModelForm);
    }
    catch (er) {
      console.log(er);
    }
  }
  currentPlanPerUserPrice = 0;
  currentPlanTotalCost = 0;
  currentDate;
  async setPayableAmount() {
    try {

      this.currentDate = new Date();
      var oneDay = 24 * 60 * 60 * 1000;
      var expiry: any = new Date(this.data.Expires_At);
      expiry.setHours(11, 59, 59);
      var numberOfDaysLeft = Math.round(Math.abs((expiry - this.currentDate) / oneDay));
      // this.currentPlanTotalCost = this.data.No_of_Users * this.currentPlanPerUserPrice;
      this.currentPlanTotalCost = Math.ceil((numberOfDaysLeft * this.data.No_of_Users * this.currentPlanPerUserPrice) / 30);
      console.log(this.currentPlanTotalCost);
      console.log("Number of days left :"+numberOfDaysLeft);
      for (let control of (<FormArray>this.changeModelForm.get('models')).controls) {
        var totalAmount = Math.ceil((control.get('pricePerUser').value * this.data.No_of_Users * numberOfDaysLeft) / 30);
        console.log("total :"+totalAmount);
        control.get('payableAmount').setValue(Math.abs(totalAmount - this.currentPlanTotalCost));
        console.log("Payable amount: "+control.get('payableAmount').value);
      }
    }
    catch (Er) {
      console.log(Er);
    }
  }
  async setPrice(index) {
    this.priceList.forEach(element => {
      if (element.Plan_Type_Mst_Id == (<FormArray>this.changeModelForm.get('models')).controls[index].get("Plan_Type_Mst_Id").value) {
        if (element.Item_Code.trim() == "L") {
          (<FormArray>this.changeModelForm.get('models')).controls[index].get("pricePerUser").setValue(element.Price);
          if (this.data.PlanId == (<FormArray>this.changeModelForm.get('models')).controls[index].get("Plan_Type_Mst_Id").value) {
            this.currentPlanPerUserPrice = element.Price;
          }
        }
      }
    });
  }
  selectedDaysCount = 0;
  async setDays(index, item) {
    for (let [key, value] of Object.entries(this.days)) {
      if (item.Plan_Type_Mst_Id == 4) {
        // console.log("inside if");
        (<FormGroup>(<FormArray>this.changeModelForm.get('models')).controls[index].get("Days")).controls[value].setValue(true);
        (<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").setValue(((<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").value) + 1);
      }
      else {
        if (this.selectedDays.includes(key)) {
          this.selectedDaysCount++;
          (<FormGroup>(<FormArray>this.changeModelForm.get('models')).controls[index].get("Days")).controls[value].setValue(true);
          (<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").setValue(((<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").value) + 1);
        }
      }
    }
    this.selectedDays = [];
    if ((<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").value >= (<FormArray>this.changeModelForm.get('models')).controls[index].get("allowedNumberOfDays").value) {
      (<FormArray>this.changeModelForm.get('models')).controls[index].get("disableSelection").setValue(true);
    }
    console.log((<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").value);
  }
  addModelToFormArray(name, id, allowedDays, startTime): FormGroup {
    return this.fb.group({
      Plan_Type_Mst_Id: this.fb.control(id),
      planName: this.fb.control(name),
      StartTime: [startTime + "", [Validators.required]],
      EndTime: [startTime + "", [Validators.required]],
      UTCStartTime: [startTime + "", [Validators.required]],
      UTCEndTime: [startTime + "", [Validators.required]],
      disableSelection: this.fb.control(false),
      allowedNumberOfDays: this.fb.control(allowedDays),
      selectedNumberOfDays: this.fb.control(0),
      pricePerUser: this.fb.control(0),
      payableAmount: this.fb.control(0),
      //  Days: this.fb.group({Sunday:[],Monday:[],Tuesday:[],Wednesday:[],Thursday:[],Friday:[],Saturday:[]})
      Days: this.fb.group({ Sunday: this.fb.control(false), Monday: this.fb.control(false), Tuesday: this.fb.control(false), Wednesday: this.fb.control(false), Thursday: this.fb.control(false), Friday: this.fb.control(false), Saturday: this.fb.control(false) })
    });
  }
  daysCheckChange(element, index) {
    if (element.checked == true) {
      (<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").setValue(((<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").value) + 1);
    }
    else {
      (<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").setValue(((<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").value) - 1);
    }
    if ((<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").value >= (<FormArray>this.changeModelForm.get('models')).controls[index].get("allowedNumberOfDays").value) {
      (<FormArray>this.changeModelForm.get('models')).controls[index].get("disableSelection").setValue(true);
    }
  }
  clearSelection(index) {
    (<FormArray>this.changeModelForm.get('models')).controls[index].get("disableSelection").setValue(false);
    (<FormArray>this.changeModelForm.get('models')).controls[index].get("selectedNumberOfDays").setValue(0);
    (<FormGroup>(<FormArray>this.changeModelForm.get('models')).controls[index].get("Days")).reset();
  }
  async convertDaysToString(Days) {
    for (let [key, value] of Object.entries(this.days)) {
      if (Days[value] == true) {
        this.selectedDays.push(key);
      }
    }
    return this.selectedDays.sort().toString();
  }
  endTime: any;
  UTCStartTime: any;
  UTCEndTime: any;
  async setEndTime(index) {
    var startTime = (<FormArray>this.changeModelForm.get('models')).controls[index].get("StartTime").value;
    console.log(startTime);
    var startHour = startTime.split(":");
    var remainingHour, endHour, finalvalue;
    if ((<FormArray>this.changeModelForm.get('models')).controls[index].get("Plan_Type_Mst_Id").value != 4) {
      if (Number(startHour[0]) >= 12) {
        remainingHour = 24 - Number(startHour[0]);
        endHour = 12 - remainingHour;
        finalvalue = String(endHour) + ":" + startHour[1];
        this.endTime = finalvalue;
      }
      else {
        endHour = Number(startHour[0]) + 12;
        finalvalue = String(endHour) + ":" + startHour[1];
        this.endTime = finalvalue;
      }
    }
    else {
      startTime = "00:00";
      this.endTime = "23:59";
    }
    const utcStartTime = new Date('01-01-2020 ' + startTime + ':00');
    const utcEndTime = new Date("1/1/2020 " + this.endTime + ":00");
    this.UTCStartTime = utcStartTime.getUTCHours() + ":" + utcStartTime.getUTCMinutes();
    this.UTCEndTime = utcEndTime.getUTCHours() + ":" + utcEndTime.getUTCMinutes();
    (<FormArray>this.changeModelForm.get('models')).controls[index].get("EndTime").setValue(this.endTime);
    (<FormArray>this.changeModelForm.get('models')).controls[index].get("UTCStartTime").setValue(this.UTCStartTime);
    (<FormArray>this.changeModelForm.get('models')).controls[index].get("UTCEndTime").setValue(this.UTCEndTime);

  }
  async setInvoiceItems(item) {
    var invoiceItem :any;
    this.priceList.forEach(element => {
      if (element.Plan_Type_Mst_Id == item.value.Plan_Type_Mst_Id && element.Item_Code.trim() == "X") {
        invoiceItem = new Organization_Invoice_Details();
        invoiceItem.Quantity = 1;
        invoiceItem.Item_Mst_Id = element.Item_Mst_Id;
        this.invoiceItemList.push(invoiceItem);
      }
    });
  }
  invoiceItemList: Array<Organization_Invoice_Details> = [];
  generatedInvoice = "";
  async submitPlan(item) {
    var expiry: any = new Date(this.data.Expires_At);
    var InvoiceDate = new invoiceDate();
    var planDetail = new planDetails();

    console.log(item.value);
    let stringDays = await this.convertDaysToString(item.value.Days);
    this.selectedDays = [];
    //await this.setEndTime(item.value.StartTime, item.value.Plan_Type_Mst_Id);
    console.log(this.endTime);

    await this.setInvoiceItems(item);
    InvoiceDate.FromDate = new Date();
    InvoiceDate.ToDate = expiry;
    
    planDetail.Organisation_Mst_Id = this.data.OrganizationId;
    planDetail.Plan_Type_Mst_Id = item.value.Plan_Type_Mst_Id;
    planDetail.No_of_Users = this.data.No_of_Users;
    planDetail.Start_Time = item.value.UTCStartTime;
    planDetail.End_Time = item.value.UTCEndTime;
    planDetail.Days = stringDays;
    await this.overviewService.changeWorkingModel(planDetail, this.invoiceItemList, InvoiceDate).then((data: any) => {
      if (data) {
        this.generatedInvoice = data;
        this.commonService.openSnackBarSuccess("Working Model Updated Successfully.", "X");
        this.dialogRef = this.dialog.open(SuccesfulInvoicePopupComponent, { data: data });
        this.dialogRef.afterClosed().subscribe(result => {
          if (result == true) {
            this.changeModelRef.close(true);
          }
        });
      }
      else {
        this.commonService.openSnackBarError("Something went wrong,Please try again.", "X");
      }
    });
  }
  dialogRef;
  // download() {
    //   let link = document.createElement('a');
    //   link.setAttribute('type', 'hidden');
    //   link.href = 'assets/pdf/OfficeBCPGuide.pdf';
    //   link.download = "OfficeBCPGuide.pdf";
    //   document.body.appendChild(link);
    //   link.click();
    //   // link.remove();
    //   //window.fetch('assets/pdf/OfficeBCPGuide.pdf');
    //   //window.open('assets/pdf/OfficeBCPGuide.pdf', '_blank');
    // }
    async updatePlan(item) {
      console.log(item.value);
      let stringDays = await this.convertDaysToString(item.value.Days);
      this.selectedDays = [];
      this.overviewService.updateWorkingModel(item.value.Plan_Type_Mst_Id,this.data.OrganizationId, item.value.UTCStartTime, item.value.UTCEndTime, stringDays).then((response: any) => {
        console.log(response);
        if (response != undefined && response>0) {
          this.commonService.openSnackBarSuccess("Working Model Updated Successfully.", "X");
          this.changeModelRef.close(true);
      }
      else {
        this.commonService.openSnackBarError("Something went wrong,Please try again.", "X");
      }
    })
  }
  // finalOkClick(index) {
  //   this.changeModelRef.close();
  //   this.dialogRef.close();
  //   if (index == 1) {
  //     this.router.navigate(['howUseServices']);
  //   }
  // }
}
