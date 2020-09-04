import { async } from '@angular/core/testing';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PurchasePaidPlanService } from './../purchase-paid-plan/purchase-paid-plan.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cost-explorer',
  templateUrl: './cost-explorer.component.html',
  styleUrls: ['./cost-explorer.component.scss']
})
export class CostExplorerComponent implements OnInit {

  constructor(private purchaseService: PurchasePaidPlanService, private fb: FormBuilder) {
    this.costExplorerForm = this.fb.group({
      users: [[Validators.min(10)]],
      internetUsage: [[Validators.min(3)]],
      model: []
    },{ updateOn: "blur" });
  }

  models: any = [];
  yearlyDicount = 0;
  costExplorerForm: FormGroup;
  stepForUsers = 5;
  stepForInterent = 1;
  monthlyAmount = 0;
  yearlyAmount = 0;
  itemPrices: any = [];
  perUserPrice: number = 0;
  perGBCost:number=0.01;
  organizationCost: number = 0;
  internetCharge:number=0;
  userCharge:number=0;
  async ngOnInit() {
    this.costExplorerForm.controls['users'].setValue(10);
    this.costExplorerForm.controls['internetUsage'].setValue(3);
    await this.getAllPlans();
    await this.getItemPrices();
    await this.calculateExpense();
  }
  async getAllPlans() {
    await this.purchaseService.getAllPlans().then(async (data: any) => {
      console.log(data);  
      if (data != undefined) {
        this.models = data;
        this.costExplorerForm.controls['model'].setValue(4);
        await this.getDiscountPercentage();
      }
    });
  }
  async getItemPrices() {
    await this.purchaseService.getAllItemList().then(async (data) => {
      console.log(data);
      if (data != undefined) {
        this.itemPrices = data;
        await this.getPrice();
      }
    });
  }
  async getDiscountPercentage() {
    this.models.forEach(element => {
      if (element.Plan_Type_Mst_Id == this.costExplorerForm.value.model) {
        this.yearlyDicount = element.Yearly_Discount;
      }
    });
  }
  onDecrementNumberOfUser() {
    if (this.costExplorerForm.value.users - this.stepForUsers >= 10) {
      this.costExplorerForm.controls['users'].setValue(this.costExplorerForm.value.users - this.stepForUsers);
      this.calculateExpense();
    }
  }
  onIncrementNumberOfUser() {
    this.costExplorerForm.controls['users'].setValue(this.costExplorerForm.value.users + this.stepForUsers);
    this.calculateExpense();
  }
  onDecrementInternet() {
    if (this.costExplorerForm.value.internetUsage - this.stepForInterent >= 3) {
      this.costExplorerForm.controls['internetUsage'].setValue(this.costExplorerForm.value.internetUsage - this.stepForInterent);
      this.calculateExpense();
    }
  }
  onIncrementInternet() {
    this.costExplorerForm.controls['internetUsage'].setValue(this.costExplorerForm.value.internetUsage + this.stepForInterent);
    this.calculateExpense();
  }
  onEmployeeNumberInputChange() {
    if (this.costExplorerForm.value.users < 10) {
      this.costExplorerForm.controls['users'].setValue(10);
    }
    else {
      this.costExplorerForm.controls['users'].setValue(Math.ceil(this.costExplorerForm.value.users / this.stepForUsers) * this.stepForUsers);
    }
    this.calculateExpense();
  }
  onInternetUsageChage() {
    if (this.costExplorerForm.value.internetUsage < 3) {
      this.costExplorerForm.controls['internetUsage'].setValue(3);
    }
    else {
      this.costExplorerForm.controls['internetUsage'].setValue(Math.ceil(this.costExplorerForm.value.internetUsage / this.stepForInterent) * this.stepForInterent);
    }
    this.calculateExpense();
  }
  async onPlanChange() {
    await this.getDiscountPercentage();
    await this.getPrice();
    this.calculateExpense();
  }
  async calculateExpense() {
    this.internetCharge=Number((this.perGBCost*this.costExplorerForm.value.users*this.costExplorerForm.value.internetUsage).toExponential(3));
    this.userCharge= (this.costExplorerForm.value.users * this.perUserPrice);
    this.monthlyAmount = Math.ceil(this.userCharge+ this.organizationCost+this.internetCharge);
    this.yearlyAmount = Math.ceil(Number(((this.monthlyAmount*12)-((this.monthlyAmount * 12) * this.yearlyDicount) / 100).toExponential(4)));
  }
  async getPrice() {
    this.itemPrices.forEach(element => {
      if (element.Item_Type_Mst_Id == 1) {
        if (element.Plan_Type_Mst_Id == this.costExplorerForm.value.model) {
          if (element.Item_Code.trim() == "L") {
            this.perUserPrice = element.Price;
          }
        }
      }
      else if (element.Item_Type_Mst_Id == 2 && element.Plan_Type_Mst_Id == 0) {
        this.organizationCost = element.Price;
      }
    });
  }
}
