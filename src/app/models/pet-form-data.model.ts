import { Pet } from "./pet.model";

export interface PetFormData {
    pet?: Pet;            // Opcjonalny obiekt Pet – jeśli jest przekazany, oznacza tryb edycji lub wyświetlania szczegółów.
    mode?: 'edit' | 'details';  // Opcjonalny tryb działania formularza, który określa, czy formularz ma działać w trybie edycji ("edit") czy tylko do odczytu ("details").
  }