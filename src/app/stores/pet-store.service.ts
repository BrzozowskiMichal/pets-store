import { Injectable, signal } from '@angular/core';
import { Pet } from '../models/pet.model';
import { PetApiService } from '../services/pet/pet-api.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetStoreService {
  pets = signal<Pet[]>([]);

  constructor(private petApiService: PetApiService) {}

  loadPets(status: string): void {
    if (status.toLowerCase() === 'all') {
      this.petApiService.getAllPets().subscribe({
        next: (pets) => this.pets.set(pets),
        error: (err) => console.error('Error loading pets:', err),
      });
    } else {
      this.petApiService.getPetsByStatus(status).subscribe({
        next: (pets) => this.pets.set(pets),
        error: (err) => console.error('Error loading pets:', err),
      });
    }
  }

  createPet(newPet: Pet): Observable<Pet> {
    return this.petApiService.addPet(newPet).pipe(
      tap((createdPet) => {
        const current = this.pets();
        this.pets.set([...current, createdPet]);
      })
    );
  }

  updatePet(updatedPet: Pet): Observable<Pet> {
    return this.petApiService.updatePet(updatedPet).pipe(
      tap((pet) => {
        const current = this.pets();
        this.pets.set(
          current.map((p) => (p.id.toString() === pet.id.toString() ? pet : p))
        );
      })
    );
  }

  deletePet(petId: number): Observable<any> {
    return this.petApiService.deletePet(petId).pipe(
      tap(() => {
        const current = this.pets();
        this.pets.set(current.filter((p) => p.id !== petId));
      })
    );
  }
}
