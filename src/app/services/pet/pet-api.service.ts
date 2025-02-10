import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Pet } from 'src/app/models/pet.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PetApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pet`, pet);
  }

  updatePet(pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/pet`, pet);
  }

  getPetsByStatus(status: string): Observable<Pet[]> {
    return this.http.get<Pet[]>(
      `${this.apiUrl}/pet/findByStatus?status=${status}`
    );
  }

  deletePet(petId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pet/${petId}`);
  }

  getPetById(petId: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/pet/${petId}`);
  }

  getAllPets(): Observable<Pet[]> {
    return forkJoin({
      available: this.getPetsByStatus('available'),
      pending: this.getPetsByStatus('pending'),
      sold: this.getPetsByStatus('sold'),
    }).pipe(
      map((results) => [
        ...results.available,
        ...results.pending,
        ...results.sold,
      ])
    );
  }
}
