import { Injectable, signal, computed } from '@angular/core';
import { Pet } from '../models/pet.model';
import { PetApiService } from '../services/pet/pet-api.service';
import { Observable, finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PetStoreService {
  private petsSignal = signal<Pet[]>([]);
  isLoading = signal<boolean>(false);

  pets = computed(() => this.petsSignal());

  constructor(private petApiService: PetApiService) {}

  loadPets(status: string): Observable<Pet[]> {
    this.isLoading.set(true);

    return (
      status.toLowerCase() === 'all'
        ? this.petApiService.getAllPets()
        : this.petApiService.getPetsByStatus(status)
    ).pipe(
      tap((pets) => {
        this.petsSignal.set(pets);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  createPet(newPet: Pet): Observable<Pet> {
    return this.petApiService.addPet(newPet).pipe(
      tap((createdPet) => {
        this.petsSignal.set([...this.petsSignal(), createdPet]);
      })
    );
  }

  updatePet(updatedPet: Pet): Observable<Pet> {
    return this.petApiService.updatePet(updatedPet).pipe(
      tap((pet: Pet) => {
        this.petsSignal.update((pets) => {
          const index = pets.findIndex((p) => p.id === pet.id);
          if (index !== -1) {
            pets[index] = pet;
          }
          return pets;
        });
      })
    );
  }

  deletePet(petId: number): Observable<Pet> {
    return this.petApiService.deletePet(petId).pipe(
      tap(() => {
        this.petsSignal.set(this.petsSignal().filter((p) => p.id !== petId));
      })
    );
  }
}
