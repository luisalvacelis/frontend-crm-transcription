import { NgClass } from '@angular/common';
import { Component, ElementRef, viewChild, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './confirm-modal.html',
})
export class ConfirmModal {

  public readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  public readonly confirmed = output<void>();
  public readonly cancelled = output<void>();

  public title: string = 'Confirmar acción';
  public message: string = '¿Estás seguro de realizar esta acción?';
  public confirmText: string = 'Confirmar';
  public cancelText: string = 'Cancelar';
  public confirmButtonClass: string = 'btn-error';
  public details: string[] = [];

  public open(config: {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
    details?: string[];
  }): void {
    this.title = config.title ?? 'Confirmar acción';
    this.message = config.message ?? '¿Estás seguro de realizar esta acción?';
    this.confirmText = config.confirmText ?? 'Confirmar';
    this.cancelText = config.cancelText ?? 'Cancelar';
    this.confirmButtonClass = config.confirmButtonClass ?? 'btn-error';
    this.details = config.details ?? [];

    this.dlg().nativeElement.showModal();
  }

  public close(): void {
    this.dlg().nativeElement.close();
  }

  public onConfirm(): void {
    this.confirmed.emit();
    this.close();
  }

  public onCancel(): void {
    this.cancelled.emit();
    this.close();
  }
}
