import { Component, ElementRef, inject, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { CampaignsStore } from '../../state/campaigns.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../shared/utils/form.utils';
import { Campaign } from '../../../../domain/models/campaign.model';

@Component({
  selector: 'app-edit-campaign',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-campaign.html',
})
export class EditCampaign {

  @ViewChild('dlg') dlg!: ElementRef<HTMLDialogElement>;

  private readonly _campaigns: CampaignsStore = inject(CampaignsStore);
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _form: FormGroup = this._fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  private readonly _currentCampaign: WritableSignal<Campaign | null> = signal<Campaign | null>(null);

  private readonly _loading: Signal<boolean> = this._campaigns.loading;
  private readonly _error: Signal<string | null> = this._campaigns.error;

  public readonly formUtils = FormUtils;

  public get form(): FormGroup {
    return this._form;
  }

  public get loading(): boolean{
    return this._loading();
  }

  public get error(): string | null{
    return this._error();
  }

  public get currentCampaign(): Campaign | null {
    return this._currentCampaign();
  }

  public open(campaign: Campaign): void {
    this._currentCampaign.set(campaign);
    this._form.patchValue({
      name: campaign.name,
      description: campaign.description
    });
    this.dlg.nativeElement.showModal();
  }

  public close(): void {
    this._form.reset();
    this._currentCampaign.set(null);
    this._campaigns.clearError();
    this.dlg.nativeElement.close();
  }

  public onSubmit(): void {
    if (this._form.invalid) {
      this._form.markAllAsTouched();
      return;
    }

    const current = this._currentCampaign();
    if (!current) return;

    const { name, description } = this._form.value;

    this._campaigns.update(current.id, {
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
