import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PetApiService } from './pet-api.service';
import { Pet } from 'src/app/models/pet.model';

describe('PetApiService', () => {
  let service: PetApiService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://petstore.swagger.io/v2';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PetApiService,
      ],
    });

    service = TestBed.inject(PetApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a pet via POST', () => {
    const newPet: Pet = { id: 1, name: 'Burek', status: 'available' };

    service.addPet(newPet).subscribe((pet) => {
      expect(pet).toEqual(newPet);
    });

    const req = httpMock.expectOne(`${apiUrl}/pet`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPet);
    req.flush(newPet);
  });

  it('should update a pet via PUT', () => {
    const updatedPet: Pet = { id: 1, name: 'Reksio', status: 'sold' };

    service.updatePet(updatedPet).subscribe((pet) => {
      expect(pet).toEqual(updatedPet);
    });

    const req = httpMock.expectOne(`${apiUrl}/pet`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPet);
    req.flush(updatedPet);
  });

  it('should delete a pet via DELETE', () => {
    const petId = 1;

    service.deletePet(petId).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/pet/${petId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should fetch pets by status via GET', () => {
    const pets: Pet[] = [
      { id: 1, name: 'Luna', status: 'available' },
      { id: 2, name: 'Milo', status: 'available' },
    ];

    service.getPetsByStatus('available').subscribe((response) => {
      expect(response.length).toBe(2);
      expect(response).toEqual(pets);
    });

    const req = httpMock.expectOne(`${apiUrl}/pet/findByStatus?status=available`);
    expect(req.request.method).toBe('GET');
    req.flush(pets);
  });

  it('should fetch a pet by ID via GET', () => {
    const pet: Pet = { id: 1, name: 'Luna', status: 'available' };

    service.getPetById(1).subscribe((response) => {
      expect(response).toEqual(pet);
    });

    const req = httpMock.expectOne(`${apiUrl}/pet/1`);
    expect(req.request.method).toBe('GET');
    req.flush(pet);
  });

  it('should fetch all pets via GET (forkJoin)', () => {
    const availablePets: Pet[] = [{ id: 1, name: 'Luna', status: 'available' }];
    const pendingPets: Pet[] = [{ id: 2, name: 'Milo', status: 'pending' }];
    const soldPets: Pet[] = [{ id: 3, name: 'Bella', status: 'sold' }];

    service.getAllPets().subscribe((response) => {
      expect(response.length).toBe(3);
      expect(response).toEqual([...availablePets, ...pendingPets, ...soldPets]);
    });

    const req1 = httpMock.expectOne(`${apiUrl}/pet/findByStatus?status=available`);
    const req2 = httpMock.expectOne(`${apiUrl}/pet/findByStatus?status=pending`);
    const req3 = httpMock.expectOne(`${apiUrl}/pet/findByStatus?status=sold`);

    expect(req1.request.method).toBe('GET');
    expect(req2.request.method).toBe('GET');
    expect(req3.request.method).toBe('GET');

    req1.flush(availablePets);
    req2.flush(pendingPets);
    req3.flush(soldPets);
  });
});
