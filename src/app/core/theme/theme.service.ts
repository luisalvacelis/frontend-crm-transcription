import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

export type Theme = 'light' | 'dracula';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly _theme: WritableSignal<Theme> = signal<Theme>('light');
  public readonly theme: Signal<Theme> = this._theme.asReadonly();

  public init(): void {
    const saved = localStorage.getItem('theme') as Theme | null;
    const fallback: Theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dracula';
    this.setTheme(saved ?? fallback);
  }

  public setTheme(theme: Theme): void {
    this._theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
}
