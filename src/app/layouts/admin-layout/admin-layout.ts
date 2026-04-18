import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router'; // 1. Importación necesaria

import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    MatSidenavModule,
    Navbar,
    Sidebar,
    RouterOutlet // 2. Agrégalo aquí
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  sidebarOpened = true;

  toggleSidebar(): void {
    this.sidebarOpened = !this.sidebarOpened;
  }
}