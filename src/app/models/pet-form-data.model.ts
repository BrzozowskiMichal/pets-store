import { ConfirmDialogState } from "../components/confirm-dialog/confirm-dialog-states.enum";
import { Pet } from "./pet.model";

export interface PetFormData {
    pet?: Pet;
    mode?: ConfirmDialogState;
  }