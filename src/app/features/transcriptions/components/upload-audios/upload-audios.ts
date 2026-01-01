import { Component, ElementRef, inject, Signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampaignsStore } from '../../../campaigns/state/campaigns.store';
import { FormUtils } from '../../../../shared/utils/form.utils';
import { AudiosStore } from '../../../audios/state/audios.store';

@Component({
  selector: 'app-upload-audios',
  imports: [ReactiveFormsModule],
  templateUrl: './upload-audios.html',
})
export class UploadAudios {

  @ViewChild('dlg') dlg!: ElementRef<HTMLDialogElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private readonly _campaigns: CampaignsStore = inject(CampaignsStore);
  private readonly _audios: AudiosStore = inject(AudiosStore);
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _form: FormGroup = this._fb.group({
    campaign_id: ['', [Validators.required]],
    files: [null, [Validators.required]]
  });

  private readonly _loading: Signal<boolean>= this._audios.uploading;
  private readonly _error: Signal<string | null> = this._audios.error;
  private readonly _campaigns_list: Signal<any[]> = this._campaigns.campaigns;

  public readonly formUtils = FormUtils;
  public selectedFiles: File[] = [];
  public isDragging = false;

  public get form(): FormGroup {
    return this._form;
  }

  public get loading(): boolean {
    return this._loading();
  }

  public get error(): string | null {
    return this._error();
  }

  public open(): void {
    this._campaigns.loadAll();
    this.dlg.nativeElement.showModal();
  }

  public close(): void {
    this.dlg.nativeElement.close();
    this._audios.clearError();
    this._form.reset();
    this.selectedFiles = [];
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  public get campaigns(): any[] {
    return this._campaigns_list();
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  public onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  private handleFiles(files: File[]): void {
    const validFiles = files.filter(file =>
      file.type.startsWith('audio/') || file.type === 'video/mp4'
    );

    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    this._form.patchValue({ files: this.selectedFiles });
    this._form.get('files')?.markAsTouched();
  }

  public removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    if (this.selectedFiles.length === 0) {
      this._form.patchValue({ files: null });
    }
  }

  public onSubmit(): void {
    if (this._form.invalid) {
      this._form.markAllAsTouched();
      return;
    }

    const { campaign_id } = this._form.value;

    if (this.selectedFiles.length === 1) {
      this._audios.uploadSingle(this.selectedFiles[0], campaign_id).subscribe({
        next: () => {
          if (!this._error()) {
            this.close();
          }
        },
      });
    } else {
      this._audios.uploadMultiple(this.selectedFiles, campaign_id).subscribe({
        next: () => {
          if (!this._error()) {
            this.close();
          }
        },
      });
    }
  }
}
