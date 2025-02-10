import { Pipe, PipeTransform } from '@angular/core';
import { PET_STATUS_MAP } from '../misc/status-labels-map';
import { PET_STATUS_COLORS_MAP } from '../misc/status-colors-map';

@Pipe({
  name: 'petStatus',
  pure: true,
})
export class PetStatusPipe implements PipeTransform {
  transform(value: string): { label: string; color: string } {
    return {
      label: PET_STATUS_MAP[value] || 'Nieznany',
      color: PET_STATUS_COLORS_MAP[value] || 'grey',
    };
  }
}
