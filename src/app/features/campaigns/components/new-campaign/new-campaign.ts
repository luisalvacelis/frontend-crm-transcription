import { Component, ElementRef, inject, Signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampaignsStore } from '../../state/campaigns.store';
import { FormUtils } from '../../../../shared/utils/form.utils';

@Component({
  selector: 'app-new-campaign',
  imports: [ReactiveFormsModule],
  templateUrl: './new-campaign.html',
})
export class NewCampaign {

  @ViewChild('dlg') dlg!: ElementRef<HTMLDialogElement>;

  private readonly _campaigns: CampaignsStore = inject(CampaignsStore);
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _form: FormGroup = this._fb.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  private readonly _loading: Signal<boolean>= this._campaigns.loading;
  private readonly _error: Signal<string | null> = this._campaigns.error;
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

  public open(): void{
    this.dlg.nativeElement.showModal();
  }

  public close(): void{
    this.dlg.nativeElement.close();
    this._campaigns.clearError();
    this._form.reset();
  }

  public onSubmit(): void {
    if (this._form.invalid) {
      this._form.markAllAsTouched();
      return;
    }

    const { name, description } = this._form.value;

    this._campaigns.create({
      name: name.trim(),
      description: description
    }).subscribe({
      next: () => {
        if(!this._error()){
          this.close();
        }
      },
    });
  }
}
