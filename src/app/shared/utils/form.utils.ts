import { AbstractControl, FormGroup } from "@angular/forms";

type ErrorKey =
  | 'required'
  | 'minlength'
  | 'min'
  | 'duplicate'
  | 'email'
  | 'pattern'
  | 'passwordsNotEqual'
  | 'emailTaken';

export class FormUtils {

  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
  // static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static notOnlySpacesPattern = '^\\S+$';

  private static normalizePattern(pattern: string): string {
    return (pattern || '').trim();
  }

  private static patternMessage(error: any): string {
    const req = this.normalizePattern(error?.requiredPattern);

    const patterns: Array<{ pattern: string; msg: string }> = [
      { pattern: this.normalizePattern(this.emailPattern), msg: 'Error: Correo electrónico no válido.' },
      { pattern: this.normalizePattern(this.notOnlySpacesPattern), msg: 'Error: No debe tener espacios.' },
    ];

    const found = patterns.find(x => x.pattern === req);
    return found?.msg ?? 'Error: Formato inválido.';
  }

  private static readonly ERROR_MESSAGES: Record<ErrorKey, string | ((error: any) => string)> = {
    required: 'Error: Campo requerido',
    minlength: (e: any) => `Error: Debe tener al menos ${e.requiredLength} caracteres.`,
    min: (e: any) => `Error: Valor mínimo de ${e.min}`,
    duplicate: 'Error: Valor ya existente en lista.',
    email: 'Error: Valor no es un correo electrónico.',
    pattern: (e: any) => this.patternMessage(e),
    passwordsNotEqual: 'Error: Las contraseñas no coinciden.',
    emailTaken: 'Error: Correo electrónico ya está siendo usado por otro usuario.',
  };

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    const control = form.controls[fieldName];
    return control ? !!control.errors && control.touched : null;
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    const control = form.controls[fieldName];
    return control ? this.getControlError(control) : null;
  }

  static getControlError(formControl: AbstractControl): string | null {
    const errors = formControl.errors as Record<string, any> | null;
    if (!errors) return null;

    for (const key of Object.keys(errors)) {
      const handler = this.ERROR_MESSAGES[key as ErrorKey];
      if (!handler) continue;
      return typeof handler === 'function' ? handler(errors[key]) : handler;
    }

    return null;
  }

  static isFieldOneEqualFieldTwo(field1: string, field2: string){
    return (formGroup: AbstractControl) => {
      const f1 = formGroup.get(field1);
      const f2 = formGroup.get(field2);

      if (!f1 || !f2) return null;

      const v1 = f1.value;
      const v2 = f2.value;

      if (!v2) {
        if (f2.hasError('passwordsNotEqual')) {
          const { passwordsNotEqual, ...rest } = (f2.errors || {});
          f2.setErrors(Object.keys(rest).length ? rest : null);
        }
        return null;
      }
      if (v1 !== v2) {
        f2.setErrors({ ...(f2.errors || {}), passwordsNotEqual: true });
        return null;
      }
      if (f2.hasError('passwordsNotEqual')) {
        const { passwordsNotEqual, ...rest } = (f2.errors || {});
        f2.setErrors(Object.keys(rest).length ? rest : null);
      }
      return null;
    };
  }
}
