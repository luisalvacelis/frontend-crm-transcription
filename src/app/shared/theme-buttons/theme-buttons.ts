import { Component, inject, Signal } from '@angular/core';
import { ThemeService, Theme } from '../../core/theme/theme.service';

@Component({
  selector: 'app-theme-buttons',
  templateUrl: './theme-buttons.html',
})
export class ThemeButtons {

  private readonly _theme: ThemeService = inject(ThemeService);

  public setTheme(theme: Theme) {
    this._theme.setTheme(theme);
  }

  public get theme(): Theme {
    return this._theme.theme();
  }
}
