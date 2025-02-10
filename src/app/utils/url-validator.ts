import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function optionalUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || control.value.trim() === '') {
      return null;
    }
    const urlPattern =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    const valid = urlPattern.test(control.value);
    return valid ? null : { invalidUrl: true };
  };
}
