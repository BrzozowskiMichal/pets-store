import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ViewChild,
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
import { FormsModule } from '@angular/forms';
import { Pet } from 'src/app/models/pet.model';
import { PetStoreService } from 'src/app/stores/pet-store.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PetFormComponent } from '../pet-form/pet-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from 'src/app/models/confirm-dialog-data.model';

@Component({
  selector: 'app-pet-list',
  imports: [
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
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetListComponent {
  displayedColumns: string[] = ['id', 'name', 'status', 'actions'];
  dataSource: MatTableDataSource<Pet> = new MatTableDataSource<Pet>([]);

  filterStatus: string = 'available';
  filterName: string = '';
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private petStore: PetStoreService,
    private snackBar: MatSnackBar
  ) {
    effect(() => {
      const pets = this.petStore.pets();
      this.dataSource = new MatTableDataSource(pets);
      this.setupTable();
    });
  }

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.isLoading = true;
    this.petStore.loadPets(this.filterStatus);
    this.isLoading = false;
  }

  setupTable(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    this.dataSource.filterPredicate = (data: Pet, filter: string) =>
      data.name?.trim().toLowerCase().includes(filter);
    this.applyFilter();
  }

  applyFilter(): void {
    const filterValue = this.filterName.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onStatusChange(): void {
    this.loadPets();
  }

  onDelete(pet: Pet): void {
    const dialogData: ConfirmDialogData = {
      title: 'Potwierdzenie usunięcia',
      message: 'Czy na pewno chcesz usunąć to zwierzę z listy?',
      petId: pet.id,
      petName: pet.name,
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.petStore.deletePet(pet.id).subscribe({
          next: () => {
            this.snackBar.open('Zwierzę zostało usunięte', 'Zamknij', {
              duration: 3000,
            });
            this.loadPets();
          },
          error: (err) => {
            this.snackBar.open('Błąd podczas usuwania zwierzęcia', 'Zamknij', {
              duration: 3000,
            });
            console.error(err);
          },
        });
      }
    });
  }

  openAddPet(): void {
    const dialogRef = this.dialog.open(PetFormComponent, {
      width: '600px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Zwierzę zostało dodane!', 'Zamknij', {
          duration: 3000,
        });
      }
    });
  }

  editPet(pet: Pet): void {
    const dialogRef = this.dialog.open(PetFormComponent, {
      width: '600px',
      data: { pet: pet, mode: 'edit' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Zwierzę zostało zaktualizowane!', 'Zamknij', {
          duration: 3000,
        });
      }
    });
  }

  viewDetails(pet: Pet): void {
    this.dialog.open(PetFormComponent, {
      width: '600px',
      data: { pet: pet, mode: 'details' },
    });
  }
}
