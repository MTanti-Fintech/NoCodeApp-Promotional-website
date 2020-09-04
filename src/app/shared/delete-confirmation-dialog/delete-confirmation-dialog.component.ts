import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent implements OnInit {
  entity: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>
  ) { }

  ngOnInit(): void {
    this.entity = this.data.entity;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onReject(): void {
    this.dialogRef.close(false);
  }

}
