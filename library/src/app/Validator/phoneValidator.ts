import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value || value.startsWith('09')) {
      return null; // Valid case
    }
    return { phoneNumberInvalid: true }; // Invalid case
  };
}
