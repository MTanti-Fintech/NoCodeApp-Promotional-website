import { HomeComponent } from "./../home/home.component";
import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ContactUsService } from "./contact-us.service";
import { ToastrService } from "ngx-toastr";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from "@angular/material/dialog";
import { ConfirmPopUpComponent } from "../confirm-pop-up/confirm-pop-up.component";
import { MatExpansionModule } from "@angular/material/expansion";

@Component({
  selector: "app-ContactUs",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactUsComponent {
  title = "officebcp_webclient";
  ContactUsForm: FormGroup;
  OnbardingForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  isShow = false;
  isNotShow = false;
  panelOpenState = false;
  constructor(
    private formBuilder: FormBuilder,
    private ContactUsService: ContactUsService,
    private toastrService: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isShow = true;
    this.isNotShow = false;
    this.ContactUsForm = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ]),
      ],
      messege: ["", Validators.required],
    });
    this.OnbardingForm = this.formBuilder.group({
      sizeOfOrganization: [""],
      lightUsage: [""],
      mediumUsage: [""],
      largeUsage: [""],
      officeOrDomain: [""],
      location: [""],
      contactNo: [""],
      time: [""],
      time1: [""],
      comments: [""],
      otherSetup: [""],
    });
  }
  /*-------------------------------------endpoint popup-------------------------------------*/
  FaqPopup(): void {
    const dialogRef = this.dialog.open(FaqPopupComponent);
  }
  openDialog(): void {}
  get f() {
    return this.ContactUsForm.controls;
  }
  onContactUsSubmit() {
    this.submitted = true;
    if (this.ContactUsForm.invalid) {
      return;
    } else {
      this.toastrService.toastrConfig.positionClass = "toast-bottom-right";
      var result = this.ContactUsService.sendContactUsGoogleForm(
        this.ContactUsForm.value
      ).subscribe(
        (res) => {
          this.toastrService.success(
            "Thank you for contacting us.",
            "Success!"
          );
        },
        (err) => {
          this.toastrService.success(
            "Thank you for contacting us.",
            "Success!"
          );
        }
      );
    }
    this.ContactUsForm.reset();
    let dialogRef = this.dialog.open(ConfirmPopUpComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.isShow = false;
        this.isNotShow = true;
      }
    });
  }
  onOnboardingSubmit() {
    if (this.OnbardingForm.invalid) {
      return;
    } else {
      this.toastrService.toastrConfig.positionClass = "toast-bottom-right";
      var result = this.ContactUsService.sendOnboardingGoogleForm(
        this.OnbardingForm.value
      ).subscribe(
        (res) => {
          this.toastrService.success(
            "Thank you for submitting the data.",
            "Success!"
          );
        },
        (err) => {
          this.toastrService.success(
            "Thank you for submitting the data.",
            "Success!"
          );
        }
      );
    }
    this.OnbardingForm.reset();
  }
}

@Component({
  selector: "faq-popup",
  templateUrl: "./faq-popup.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class FaqPopupComponent {}
