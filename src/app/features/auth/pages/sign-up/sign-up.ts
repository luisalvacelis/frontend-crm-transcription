import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { SessionStore } from '../../state/session.store';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../shared/utils/form.utils';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
})
export class SignUp {

  private readonly _session: SessionStore = inject(SessionStore);
  private readonly _router: Router = inject(Router);
  private readonly _fb: FormBuilder = inject(FormBuilder);

  private readonly _showPassword: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _showConfirmPassword: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _loading: Signal<boolean>= this._session.loading;
  private readonly _error: Signal<string | null> = this._session.error;

  private readonly _form: FormGroup = this._fb.group({
    fullname: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(FormUtils.notOnlySpacesPattern),
      ],
    ],
    confirmPassword:[
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern(FormUtils.notOnlySpacesPattern),
      ],
    ]
  },{
    validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'confirmPassword')]
  });

  public readonly formUtils = FormUtils;

  public get form(): FormGroup{
    return this._form;
  }

  public get loading(): boolean{
    return this._loading();
  }

  public get error(): string | null{
    return this._error();
  }

  public get showPassword(): boolean{
    return this._showPassword();
  }

  public get showConfirmPassword(): boolean{
    return this._showConfirmPassword();
  }

  public togglePassword(): void {
    this._showPassword.update(v => !v);
  }

  public toggleConfirmPassword(): void {
    this._showConfirmPassword.update(v => !v);
  }

  public onSubmit(): void {

    if (this._form.invalid) {
      this._form.markAllAsTouched();
      return;
    }

    const {fullname, email, password} = this._form.value;

    this._session.singUp({fullname, email, password}).subscribe({
      next: (user) => {
        if (user) {
          this._form.reset();
          this._router.navigateByUrl('/');
        }
      },
    });
  }
}
