import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PetListComponent } from './pet-list.component';
import { PetFormComponent } from '../pet-form/pet-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetStoreService } from 'src/app/stores/pet-store.service';
import { of } from 'rxjs';
import { Pet } from 'src/app/models/pet.model';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material/table';
import { NO_ERRORS_SCHEMA } from '@angular/core'; // 🚀 Dodane!

describe('PetListComponent', () => {
  let component: PetListComponent;
  let fixture: ComponentFixture<PetListComponent>;
  let dialogMock: jest.Mocked<MatDialog>;
  let petStoreMock: jest.Mocked<PetStoreService>;
  let snackBarMock: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    const mockDialogRef = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
      close: jest.fn(),
    };

    dialogMock = {
      open: jest.fn().mockReturnValue(mockDialogRef),
    } as unknown as jest.Mocked<MatDialog>;

    petStoreMock = {
      pets: jest.fn(() => [
        { id: 1, name: 'Shiba', status: 'available', photoUrls: [], tags: [] },
      ]),
      loadPets: jest.fn(),
      deletePet: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<PetStoreService>;

    snackBarMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [PetListComponent, PetFormComponent, ConfirmDialogComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MatDialog, useValue: dialogMock },
        { provide: PetStoreService, useValue: petStoreMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PetListComponent);
    component = fixture.componentInstance;

    component.dataSource = new MatTableDataSource<Pet>([]);

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load pets on initialization', () => {
    jest.spyOn(component, 'loadPets');
    component.ngOnInit();
    expect(component.loadPets).toHaveBeenCalled();
  });

  it('should apply filter correctly', () => {
    component.filterName = 'shiba';
    component.applyFilter();
    expect(component.dataSource.filter).toBe('shiba');
  });

  it('should call loadPets when status changes', () => {
    jest.spyOn(component, 'loadPets');
    component.onStatusChange();
    expect(component.loadPets).toHaveBeenCalled();
  });
});
