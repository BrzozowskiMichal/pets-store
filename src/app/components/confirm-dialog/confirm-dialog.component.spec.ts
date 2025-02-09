import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefMock: jest.Mocked<MatDialogRef<ConfirmDialogComponent>>;
  const dialogDataMock = {
    title: 'Are you sure?',
    message: 'This action cannot be undone.',
  };

  beforeEach(async () => {
    dialogRefMock = {
      close: jest.fn(),
      disableClose: false,
    } as unknown as jest.Mocked<MatDialogRef<ConfirmDialogComponent>>;

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: dialogDataMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive the correct dialog data', () => {
    expect(component.data).toEqual(dialogDataMock);
  });

  it('should emit confirmDelete when onConfirm is called and show spinner', () => {
    jest.spyOn(component.confirmDelete, 'emit');

    component.onConfirm();

    expect(component.isLoading).toBeTruthy();
    expect(component.confirmDelete.emit).toHaveBeenCalled();
    expect(dialogRefMock.close).not.toHaveBeenCalled();
  });

  it('should close the dialog with "false" when onCancel is called', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith();
  });

  it('should close the dialog on success', () => {
    component.onDeleteSuccess();
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should reset isLoading on delete error', () => {
    component.isLoading = true;
    component.onDeleteError();
    expect(component.isLoading).toBeFalsy();
  });
});
