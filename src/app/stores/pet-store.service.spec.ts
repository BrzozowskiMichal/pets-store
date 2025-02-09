import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PetStoreService } from './pet-store.service';
import { PetApiService } from '../services/pet/pet-api.service';
import { of } from 'rxjs';

describe('PetStoreService', () => {
  let service: PetStoreService;
  let petApiMock: jest.Mocked<PetApiService>;

  beforeEach(() => {
    petApiMock = {
      getAllPets: jest.fn().mockReturnValue(of([{ id: 1, name: 'Luna', status: 'available' }])),
      getPetsByStatus: jest.fn().mockReturnValue(of([{ id: 1, name: 'Luna', status: 'available' }])),
      addPet: jest.fn().mockReturnValue(of({ id: 2, name: 'Burek', status: 'available' })),
      updatePet: jest.fn().mockReturnValue(of({ id: 1, name: 'Reksio', status: 'sold' })),
      deletePet: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<PetApiService>;

    TestBed.configureTestingModule({
      providers: [
        PetStoreService,
        { provide: PetApiService, useValue: petApiMock },
      ],
    });

    service = TestBed.inject(PetStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isLoading to true during loadPets and false after', fakeAsync(() => {
    expect(service.isLoading()).toBe(false);
    service.loadPets('all').subscribe();

    tick();
    expect(service.isLoading()).toBe(false);
  }));

  it('should load all pets', fakeAsync(() => {
    service.loadPets('all').subscribe();
    tick();
    expect(service.pets()).toEqual([{ id: 1, name: 'Luna', status: 'available' }]);
    expect(petApiMock.getAllPets).toHaveBeenCalled();
  }));

  it('should load pets by status', fakeAsync(() => {
    service.loadPets('available').subscribe();
    tick();
    expect(service.pets()).toEqual([{ id: 1, name: 'Luna', status: 'available' }]);
    expect(petApiMock.getPetsByStatus).toHaveBeenCalledWith('available');
  }));

  it('should add a pet', fakeAsync(() => {
    service.loadPets('all').subscribe();
    tick();

    service.createPet({ id: 2, name: 'Burek', status: 'available' }).subscribe();
    tick();

    expect(service.pets()).toEqual([
      { id: 1, name: 'Luna', status: 'available' },
      { id: 2, name: 'Burek', status: 'available' }
    ]);
    
    expect(petApiMock.addPet).toHaveBeenCalledWith({ id: 2, name: 'Burek', status: 'available' });
}));

  it('should update a pet', fakeAsync(() => {
    service.loadPets('all').subscribe();
    tick();
    service.updatePet({ id: 1, name: 'Reksio', status: 'sold' }).subscribe();
    tick();
    expect(service.pets()).toEqual([{ id: 1, name: 'Reksio', status: 'sold' }]);
    expect(petApiMock.updatePet).toHaveBeenCalledWith({ id: 1, name: 'Reksio', status: 'sold' });
  }));

  it('should delete a pet', fakeAsync(() => {
    service.loadPets('all').subscribe();
    tick();
    service.deletePet(1).subscribe();
    tick();
    expect(service.pets()).toEqual([]);
    expect(petApiMock.deletePet).toHaveBeenCalledWith(1);
  }));
});
