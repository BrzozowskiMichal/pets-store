import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Pet } from 'src/app/models/pet.model';
import { PetStoreService } from 'src/app/stores/pet-store.service';
import { PetFormComponent } from '../pet-form/pet-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetListComponent {
  displayedColumns = ['id', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<Pet>();

  filterStatus = signal<string>('available');
  filterName = signal<string>('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    public petStore: PetStoreService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadPets();
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterName().trim().toLowerCase();
  }

  onStatusChange(): void {
    this.loadPets();
  }

  openAddPet(): void {
    this.dialog
      .open(PetFormComponent, { width: '600px' })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadPets();
      });
  }

  editPet(pet: Pet): void {
    this.dialog
      .open(PetFormComponent, {
        width: '600px',
        data: { pet, mode: 'edit' },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadPets();
      });
  }

  viewDetails(pet: Pet): void {
    this.dialog.open(PetFormComponent, {
      width: '600px',
      data: { pet, mode: 'details' },
    });
  }

  onDelete(pet: Pet): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      title: 'Potwierdzenie usunięcia',
      message: 'Czy na pewno chcesz usunąć to zwierzę?',
      petId: pet.id,
      petName: pet.name,
    },
    disableClose: true,
  });

  dialogRef.componentInstance.confirmDelete.subscribe(() => {
    this.petStore.deletePet(pet.id).subscribe({
      next: () => {
        this.snackBar.open('Zwierzę usunięte!', 'Zamknij', { duration: 3000 });
        dialogRef.componentInstance.onDeleteSuccess();
        this.loadPets();
      },
      error: () => {
        this.snackBar.open('Błąd usuwania!', 'Zamknij', { duration: 3000 });
        dialogRef.componentInstance.onDeleteError();
      },
    });
  });
}


  private loadPets(): void {
    this.petStore.loadPets(this.filterStatus()).subscribe((pets) => {
      this.dataSource.data = pets;
    });
  }
}
