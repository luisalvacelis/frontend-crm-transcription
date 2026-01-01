import { Component, computed, inject, input, InputSignal, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { User } from '../../domain/models/user.model';

type MenuItem = {
  label: string;
  route: string;
  icon: 'dashboard' | 'campaigns' | 'transcriptions' | 'analysis';
  required?: string[];
};
type MenuGroup = { title: string; items: MenuItem[] };

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {

  public readonly me: InputSignal<User | null> = input<User | null>(null);
  private readonly _collapsed: WritableSignal<boolean> = signal(false);
  private readonly _menu: WritableSignal<MenuGroup[]> = signal([
    {
      title: 'PRINCIPAL',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: 'dashboard'},
      ],
    },
    {
      title: 'GESTIÓN',
      items: [
        { label: 'Campañas', route: '/campaigns', icon: 'campaigns'},
        { label: 'Transcripciones', route: '/transcriptions', icon: 'transcriptions'},
        { label: 'Análisis', route: '/analysis', icon: 'analysis'},
      ],
    },
  ]);

  public readonly visibleMenu = computed(() => {
    return this._menu();
  });

  public toggleCollapsed(): void {
    this._collapsed.update(v => !v);
  }

  public getCollapsed(): boolean {
    return this._collapsed();
  }

  public getMenu(): MenuGroup[] {
    return this.visibleMenu();
  }
}
