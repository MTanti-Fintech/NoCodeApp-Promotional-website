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
import { SignUpService } from "./signup.service";
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
  SignUpPopup(): void {
    const dialogRef = this.dialog.open(SignUpPopupComponent, {
      maxHeight: "100vh",
    });
  }
  openDialog(): void {}
}

@Component({
  selector: "signup-popup",
  templateUrl: "./signup-popup.html",
  styleUrls: ["./home.component.scss"],
})
export class SignUpPopupComponent implements OnInit {
  constructor(
    private readonly signUpService: SignUpService,
    private readonly commonService: CommonService,
    private readonly router: Router,
    private matDialogref: MatDialogRef<SignUpPopupComponent>
  ) {}

  submitted = false;
  alreadyRegistered = false;
  Issues = "";

  ngOnInit(): void {
    // this.appmethod.ngOnInit();
  }

  onBlurMethod(event: any) {
    if (event.target.value != "") {
      event.target.classList.add("has-val");
    } else {
      event.target.classList.remove("has-val");
    }
  }
  resetForm(form: NgForm) {
    if (form) {
      form.resetForm();
    }
  }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const organizationDetails = new OrganizationDetails();
    organizationDetails.Firstname = form.value.firstname;
    organizationDetails.Lastname = form.value.lastname;
    organizationDetails.Fullname = form.value.fullname;
    organizationDetails.OrganizationName = form.value.Orgname;
    organizationDetails.OrganizationDomain =
      form.value.Orgdomain + ".officebcp.com";
    organizationDetails.AdminEmail = form.value.adminemail;
    organizationDetails.CommunicationEmail = form.value.commemail;
    this.signUpService
      .SignUpOrganization(organizationDetails)
      .subscribe((res: any) => {
        if (res > 0) {
          form.resetForm();
          this.matDialogref.close();
          this.commonService.openSnackBarSuccess(
            "An Email with Sign Up instruction is sent to " +
              organizationDetails.AdminEmail,
            "X"
          );
        } else if (res == -1) {
          this.alreadyRegistered = true;
          this.Issues =
            "Your admin is already registered ! Please check your inbox " +
            organizationDetails.AdminEmail +
            " for activation mail";
          this.submitted = false;
        } else {
          if (res == -2) {
            this.alreadyRegistered = true;
            this.Issues = "This admin email is already registered !";
            this.matDialogref.close();
            this.commonService.openSnackBarError(
              "This admin email is already registered ! Please login to add new organization",
              "X"
            );
            // this.router.navigate(["/login"]);
          } else if (res == -3) {
            this.alreadyRegistered = true;
            this.Issues =
              "This Organization is already registered by " +
              organizationDetails.AdminEmail +
              " ! Please Login for further details";
            this.matDialogref.close();
            this.commonService.openSnackBarError(
              "This Organization is already registered by " +
                organizationDetails.AdminEmail +
                " ! Please Login for further details",
              "X"
            );
            // this.router.navigate(["/login"]);
          } else if (res == -6) {
            this.alreadyRegistered = true;
            this.Issues =
              "This Organization is already registered by " +
              organizationDetails.AdminEmail +
              " ! Please activate your account. Activation link has been re-sent to " +
              organizationDetails.AdminEmail;
            this.matDialogref.close();
            this.commonService.openSnackBarError(
              "This Organization is already registered by " +
                organizationDetails.AdminEmail +
                " ! Please activate your account. Activation link has been re-sent to " +
                organizationDetails.AdminEmail,
              "X"
            );
            // this.router.navigate(["/login"]);
          } else if (res == -4) {
            this.alreadyRegistered = true;
            this.Issues = "This Domain is already registered";
            this.submitted = false;
          } else {
            this.Issues = "There is issue in the service !";
          }
        }
      });
  }
}
