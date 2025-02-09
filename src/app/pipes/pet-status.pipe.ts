import { Pipe, PipeTransform } from '@angular/core';
import { PET_STATUS_MAP } from '../misc/status-labels-map';

@Pipe({
  name: 'petStatus',
})
export class PetStatusPipe implements PipeTransform {
  transform(value: string): string {
    return PET_STATUS_MAP[value] || 'Nieznany';
  }
}
