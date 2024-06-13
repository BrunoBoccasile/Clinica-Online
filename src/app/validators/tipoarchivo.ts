import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function tipoArchivoValidator(tiposPermitidos: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const archivo = control.value;
    if (archivo) {
      const fileExtension = archivo.split('.').pop().toLowerCase();
      if (tiposPermitidos.includes(fileExtension)) {
        return null;
      } else {
        return { tipoArchivo: true };
      }
    }
    return null;
  };
}