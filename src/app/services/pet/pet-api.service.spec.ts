import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PetApiService } from './pet-api.service';
import { PetStoreService } from 'src/app/stores/pet-store.service';
import { Pet } from 'src/app/models/pet.model';

describe('PetStoreService', () => {
  let service: PetStoreService;
  let petApiServiceMock: jest.Mocked<PetApiService>;

  beforeEach(() => {
    petApiServiceMock = {
      getAllPets: jest.fn(),
      getPetsByStatus: jest.fn(),
      addPet: jest.fn(),
      updatePet: jest.fn(),
      deletePet: jest.fn(),
    } as unknown as jest.Mocked<PetApiService>;

    TestBed.configureTestingModule({
      providers: [
        PetStoreService,
        { provide: PetApiService, useValue: petApiServiceMock },
      ],
    });

    service = TestBed.inject(PetStoreService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should load all pets when status is "all"', () => {
    const mockPets: Pet[] = [
      { id: 1, name: 'Shiba', status: 'available', photoUrls: [], tags: [] },
    ];
    petApiServiceMock.getAllPets.mockReturnValue(of(mockPets));

    service.loadPets('all');

    expect(petApiServiceMock.getAllPets).toHaveBeenCalled();
    expect(service.pets()).toEqual(mockPets);
  });

  it('should load pets by status', () => {
    const mockPets: Pet[] = [
      { id: 2, name: 'Husky', status: 'pending', photoUrls: [], tags: [] },
    ];
    petApiServiceMock.getPetsByStatus.mockReturnValue(of(mockPets));

    service.loadPets('pending');

    expect(petApiServiceMock.getPetsByStatus).toHaveBeenCalledWith('pending');
    expect(service.pets()).toEqual(mockPets);
  });

  it('should handle error when loading pets', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    petApiServiceMock.getAllPets.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    service.loadPets('all');

    expect(petApiServiceMock.getAllPets).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error loading pets:',
      expect.any(Error)
    );
  });

  it('should add a new pet', () => {
    const newPet: Pet = {
      id: 3,
      name: 'Bulldog',
      status: 'available',
      photoUrls: [],
      tags: [],
    };
    petApiServiceMock.addPet.mockReturnValue(of(newPet));

    service.createPet(newPet).subscribe((pet) => {
      expect(pet).toEqual(newPet);
      expect(service.pets()).toContain(newPet);
    });

    expect(petApiServiceMock.addPet).toHaveBeenCalledWith(newPet);
  });

  it('should update an existing pet', () => {
    const existingPets: Pet[] = [
      { id: 1, name: 'Shiba', status: 'available', photoUrls: [], tags: [] },
      { id: 2, name: 'Husky', status: 'pending', photoUrls: [], tags: [] },
    ];
    service.pets.set(existingPets);

    const updatedPet: Pet = {
      id: 1,
      name: 'Shiba Inu',
      status: 'available',
      photoUrls: [],
      tags: [],
    };
    petApiServiceMock.updatePet.mockReturnValue(of(updatedPet));

    service.updatePet(updatedPet).subscribe((pet) => {
      expect(pet).toEqual(updatedPet);
      expect(service.pets()).toContainEqual(updatedPet);
      expect(service.pets()).not.toContainEqual(existingPets[0]);
    });

    expect(petApiServiceMock.updatePet).toHaveBeenCalledWith(updatedPet);
  });

  it('should delete a pet', () => {
    const existingPets: Pet[] = [
      { id: 1, name: 'Shiba', status: 'available', photoUrls: [], tags: [] },
      { id: 2, name: 'Husky', status: 'pending', photoUrls: [], tags: [] },
    ];
    service.pets.set(existingPets);

    petApiServiceMock.deletePet.mockReturnValue(of({}));

    service.deletePet(1).subscribe(() => {
      expect(service.pets()).toEqual([
        { id: 2, name: 'Husky', status: 'pending', photoUrls: [], tags: [] },
      ]);
    });

    expect(petApiServiceMock.deletePet).toHaveBeenCalledWith(1);
  });

  it('should handle error when deleting a pet', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    petApiServiceMock.deletePet.mockReturnValue(
      throwError(() => new Error('Delete Error'))
    );

    service.deletePet(1).subscribe({
      error: (err) => {
        expect(console.error).toHaveBeenCalledWith(
          'Error deleting pet:',
          expect.any(Error)
        );
      },
    });

    expect(petApiServiceMock.deletePet).toHaveBeenCalledWith(1);
  });
});
