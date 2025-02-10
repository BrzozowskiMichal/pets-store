import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmDialogData } from 'src/app/models/confirm-dialog-data.model';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  isLoading = false;

  @Output() confirmDelete = new EventEmitter<void>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.isLoading = true;
    this.confirmDelete.emit();
    this.cdr.markForCheck();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDeleteSuccess(): void {
    this.dialogRef.close(true);
  }

  onDeleteError(): void {
    this.isLoading = false;
    this.cdr.markForCheck();
  }
}
