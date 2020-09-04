import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-succesful-invoice-popup',
  templateUrl: './succesful-invoice-popup.component.html',
  styleUrls: ['./succesful-invoice-popup.component.css']
})
export class SuccesfulInvoicePopupComponent implements OnInit {
  // generatedInvoice="";
  constructor(private router:Router,private dialog:MatDialog,@Inject(MAT_DIALOG_DATA) public generatedInvoice,public successRef: MatDialogRef<SuccesfulInvoicePopupComponent>) { }

  ngOnInit(): void {
  }
  finalOkClick(index) {
    this.successRef.close(true);
    if (index == 1) {
      this.router.navigate(['howUseServices']);
    }

  }
  download() {
    debugger;
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = 'assets/pdf/OfficeBCPGuide.pdf';
    link.download = "OfficeBCPGuide.pdf";
    document.body.appendChild(link);
    link.click();

    // link.remove();
    //window.fetch('assets/pdf/OfficeBCPGuide.pdf');
    //window.open('assets/pdf/OfficeBCPGuide.pdf', '_blank');
  }
}
