import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PetListComponent } from './pet-list.component';
import { PetStoreService } from 'src/app/stores/pet-store.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('PetListComponent', () => {
  let component: PetListComponent;
  let fixture: ComponentFixture<PetListComponent>;
  let petStoreMock: jest.Mocked<PetStoreService>;
  let dialogMock: jest.Mocked<MatDialog>;
  let snackBarMock: jest.Mocked<MatSnackBar>;

  beforeEach(async () => {
    petStoreMock = {
      isLoading: signal(false),
      loadPets: jest
        .fn()
        .mockReturnValue(of([{ id: 1, name: 'Rex', status: 'available' }])),
      deletePet: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<PetStoreService>;

    dialogMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    snackBarMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [PetListComponent],
      providers: [
        provideNoopAnimations(),
        { provide: PetStoreService, useValue: petStoreMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load pets on init', () => {
    jest.spyOn(component, 'ngAfterViewInit');
    component.ngAfterViewInit();
    expect(component.ngAfterViewInit).toHaveBeenCalled();
    expect(petStoreMock.loadPets).toHaveBeenCalled();
  });

  it('should set dataSource with pets from store', fakeAsync(() => {
    component.ngAfterViewInit();
    tick();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Rex');
  }));

  it('should apply filter correctly', () => {
    component.filterName.set('rex');
    component.applyFilter();
    expect(component.dataSource.filter).toBe('rex');
  });

  it('should reload pets when status changes', () => {
    jest.spyOn(component, 'onStatusChange');
    component.onStatusChange();
    expect(component.onStatusChange).toHaveBeenCalled();
    expect(petStoreMock.loadPets).toHaveBeenCalled();
  });
});
