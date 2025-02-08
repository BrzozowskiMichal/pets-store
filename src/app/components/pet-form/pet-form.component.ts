import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatChipsModule,
  MatChipInputEvent,
  MatChipEditedEvent,
} from '@angular/material/chips';
import { optionalUrlValidator } from '../../utils/url-validator';
import { Pet } from 'src/app/models/pet.model';
import { PetFormData } from 'src/app/models/pet-form-data.model';
import { PetStoreService } from 'src/app/stores/pet-store.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ConfirmDialogState } from '../confirm-dialog/confirm-dialog-states.enum';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
  ],
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PetFormComponent implements OnInit {
  confirmDialogStates = ConfirmDialogState;
  petForm!: FormGroup;
  isLoading = false;
  statusOptions: string[] = ['available', 'pending', 'sold'];
  mode = ConfirmDialogState.Edit;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly fb: FormBuilder,
    private readonly petStoreService: PetStoreService,
    private readonly snackBar: MatSnackBar,
    public readonly dialogRef: MatDialogRef<PetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PetFormData
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.mode) {
      this.mode = this.data.mode;
    }
    this.initForm();
    if (this.data && this.data.pet) {
      this.populateForm(this.data.pet);
      if (this.mode === ConfirmDialogState.Details) {
        this.petForm.disable();
      }
    }
  }

  private initForm(): void {
    this.petForm = this.fb.group({
      category: [''],
      name: ['', Validators.required],
      photoUrls: this.fb.array([this.fb.control('', optionalUrlValidator())]),
      tags: this.fb.array([]),
      status: ['available', Validators.required],
    });
  }

  get photoUrls(): FormArray {
    return this.petForm.get('photoUrls') as FormArray;
  }

  get tags(): FormArray {
    return this.petForm.get('tags') as FormArray;
  }

  addPhotoUrl(): void {
    this.photoUrls.push(this.fb.control('', optionalUrlValidator()));
  }

  removePhotoUrl(index: number): void {
    if (this.photoUrls.length > 1) {
      this.photoUrls.removeAt(index);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.tags.push(this.fb.control(value.trim()));
    }
    if (input) {
      input.value = '';
    }
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  editTag(index: number, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.removeTag(index);
    } else {
      this.tags.at(index).setValue(value);
    }
  }

  onSubmit(): void {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      return;
    }
    const formValue = this.petForm.value;

    const petPayload: Pet = {
      id: this.data && this.data.pet ? this.data.pet.id : 0,
      category: {
        id: 0,
        name: formValue.category,
      },
      name: formValue.name,
      photoUrls: formValue.photoUrls,
      tags: formValue.tags.map((tagName: string) => ({ id: 0, name: tagName })),
      status: formValue.status,
    };

    this.isLoading = true;

    if (this.data && this.data.pet && this.data.pet.id) {
      this.petStoreService.updatePet(petPayload).subscribe({
        next: (pet) => {
          this.isLoading = false;
          this.snackBar.open('Zwierzę zostało zaktualizowane!', 'Zamknij', {
            duration: 3000,
          });
          this.dialogRef.close(pet);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Błąd podczas aktualizacji zwierzęcia', 'Zamknij', {
            duration: 3000,
          });
          console.error(err);
          this.cdr.markForCheck();
        },
      });
    } else {
      this.petStoreService.createPet(petPayload).subscribe({
        next: (newPet) => {
          this.isLoading = false;
          this.snackBar.open('Zwierzę zostało dodane!', 'Zamknij', {
            duration: 3000,
          });
          this.dialogRef.close(newPet);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Błąd podczas dodawania zwierzęcia', 'Zamknij', {
            duration: 3000,
          });
          console.error(err);
          this.cdr.markForCheck();
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private populateForm(pet: Pet): void {
    this.petForm.patchValue({
      category: pet.category ? pet.category.name : '',
      name: pet.name,
      status: pet.status,
    });

    if (pet.photoUrls && pet.photoUrls.length) {
      this.photoUrls.clear();
      pet.photoUrls.forEach((url) => {
        this.photoUrls.push(this.fb.control(url, optionalUrlValidator()));
      });
    }

    if (pet.tags && pet.tags.length) {
      this.tags.clear();
      pet.tags.forEach((tag) => {
        this.tags.push(this.fb.control(tag.name));
      });
    }
  }
}
