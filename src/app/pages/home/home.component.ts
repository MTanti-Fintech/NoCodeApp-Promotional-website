import { InvoiceItemRequest } from "src/app/shared/Dto/invoice-item.DTO";
import {
  Renderer2,
  Inject,
  Component,
  OnInit,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import * as $ from "jquery";
import { AppComponent } from "src/app/app.component";
import { CommonService } from "src/app/shared/common.service";
import { NgForm, FormGroup } from "@angular/forms";
import { OrganizationDetails } from "src/app/models/OrganizationDetails";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { OwlOptions } from "ngx-owl-carousel-o";
// import { NgxFreshChatService } from "ngx-freshchat";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  selectedMenu: string = "home";
  currency_symbol = "$";
  constructor(private component: AppComponent, public dialog: MatDialog) {
    $.get(
      "https://api.ipdata.co?api-key=test",
      function (response) {
        console.log(response.currency.symbol);
        this.currency_symbol = response.currency.symbol;
        if (response.country_code === "IN") {
        }
      },
      "jsonp"
    );
  }

  highlightMenuOnScroll(ele) {
    this.selectedMenu = ele;
  }

  ngOnInit(): void {}

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 300,
    navText: ["Previous", "Next"],
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: true,
  };

  login() {
    this.component.accespagelogin = true;
    this.component.callingmethod();
  }
  /*-------------------------------------signup popup-------------------------------------*/
  
  openDialog(): void {}
}

