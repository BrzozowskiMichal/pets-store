import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PetFormComponent } from './pet-form.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetStoreService } from 'src/app/stores/pet-store.service';
import { of } from 'rxjs';
import { Pet } from 'src/app/models/pet.model';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('PetFormComponent', () => {
  let component: PetFormComponent;
  let fixture: ComponentFixture<PetFormComponent>;
  let petStoreServiceMock: jest.Mocked<PetStoreService>;
  let snackBarMock: jest.Mocked<MatSnackBar>;
  let dialogRefMock: jest.Mocked<MatDialogRef<PetFormComponent>>;

  beforeEach(async () => {
    petStoreServiceMock = {
      updatePet: jest.fn(),
      createPet: jest.fn(),
    } as unknown as jest.Mocked<PetStoreService>;

    snackBarMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    dialogRefMock = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<PetFormComponent>>;

    await TestBed.configureTestingModule({
      imports: [PetFormComponent],
      providers: [
        provideNoopAnimations(),
        { provide: PetStoreService, useValue: petStoreServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { pet: null, mode: 'edit' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.petForm).toBeDefined();
    expect(component.petForm.value).toEqual({
      category: '',
      name: '',
      photoUrls: [''],
      tags: [],
      status: 'available',
    });
  });

  it('should add a new photo URL field', () => {
    component.addPhotoUrl();
    fixture.detectChanges();
    expect(component.photoUrls.length).toBe(2);
  });

  it('should remove a photo URL field if more than one exists', () => {
    component.addPhotoUrl();
    fixture.detectChanges();
    component.removePhotoUrl(1);
    fixture.detectChanges();
    expect(component.photoUrls.length).toBe(1);
  });

  it('should not remove the last remaining photo URL field', () => {
    component.removePhotoUrl(0);
    fixture.detectChanges();
    expect(component.photoUrls.length).toBe(1);
  });

  it('should add a tag', () => {
    const event = { value: 'Tag1', input: { value: '' } } as any;
    component.addTag(event);
    fixture.detectChanges();
    expect(component.tags.length).toBe(1);
    expect(component.tags.at(0).value).toBe('Tag1');
  });

  it('should remove a tag', () => {
    const event = { value: 'Tag1', input: { value: '' } } as any;
    component.addTag(event);
    fixture.detectChanges();
    component.removeTag(0);
    fixture.detectChanges();
    expect(component.tags.length).toBe(0);
  });

  it('should edit a tag', () => {
    component.tags.push(component['fb'].control('Tag1'));
    fixture.detectChanges();
    component.editTag(0, { value: 'UpdatedTag' } as any);
    fixture.detectChanges();
    expect(component.tags.at(0).value).toBe('UpdatedTag');
  });

  it('should remove a tag if the edited value is empty', () => {
    component.tags.push(component['fb'].control('Tag1'));
    fixture.detectChanges();
    component.editTag(0, { value: '' } as any);
    fixture.detectChanges();
    expect(component.tags.length).toBe(0);
  });

  it('should mark the form as touched and not submit if invalid', () => {
    jest.spyOn(component.petForm, 'markAllAsTouched');
    component.onSubmit();
    fixture.detectChanges();
    expect(component.petForm.markAllAsTouched).toHaveBeenCalled();
    expect(petStoreServiceMock.createPet).not.toHaveBeenCalled();
    expect(petStoreServiceMock.updatePet).not.toHaveBeenCalled();
  });

  it('should call createPet if no existing pet and form is valid', () => {
    component.petForm.patchValue({
      category: 'Dogs',
      name: 'Shiba Inu',
      status: 'available',
    });

    component.photoUrls.clear();
    component.photoUrls.push(
      component['fb'].control('https://example.com/photo.jpg')
    );

    component.tags.clear();
    component.tags.push(component['fb'].control('cute'));

    petStoreServiceMock.createPet.mockReturnValue(of({} as Pet));

    component.onSubmit();
    fixture.detectChanges();

    expect(petStoreServiceMock.createPet).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Zwierzę zostało dodane!',
      'Zamknij',
      { duration: 3000 }
    );
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should call updatePet if existing pet and form is valid', async () => {
    component.data.pet = {
      id: 1,
      category: { id: 0, name: 'Dogs' },
      name: 'Shiba Inu',
      photoUrls: ['https://example.com/photo.jpg'],
      tags: [{ id: 0, name: 'fast' }],
      status: 'available',
    };

    component.ngOnInit();
    await fixture.whenStable();

    component.petForm.patchValue({
      category: 'Cats',
      name: 'Bengal',
      status: 'pending',
    });

    component.photoUrls.clear();
    component.photoUrls.push(
      component['fb'].control('https://example.com/photo2.jpg')
    );

    component.tags.clear();
    component.tags.push(component['fb'].control('energetic'));

    petStoreServiceMock.updatePet.mockReturnValue(of({} as Pet));

    component.onSubmit();
    fixture.detectChanges();

    expect(petStoreServiceMock.updatePet).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith(
      'Zwierzę zostało zaktualizowane!',
      'Zamknij',
      { duration: 3000 }
    );
    expect(dialogRefMock.close).toHaveBeenCalled();
  });

  it('should close the dialog when onCancel is called', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalled();
  });
});
