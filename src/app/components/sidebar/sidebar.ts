import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ADMIN_MENU_ITEMS } from '../../common/menu-items';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      <div class="menu-group">
        <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>
        <a mat-list-item routerLink="/admin/orders" routerLinkActive="active">
          <mat-icon matListItemIcon>shopping_basket</mat-icon>
          <span matListItemTitle>Gestión Pedidos</span>
        </a>
        <a mat-list-item routerLink="/admin/employees" routerLinkActive="active">
          <mat-icon matListItemIcon>badge</mat-icon>
          <span matListItemTitle>Trabajadores</span>
        </a>
        <a mat-list-item routerLink="/admin/areas" routerLinkActive="active">
          <mat-icon matListItemIcon>map</mat-icon>
          <span matListItemTitle>Áreas de Trabajo</span>
        </a>        
        <a mat-list-item routerLink="/admin/categories" routerLinkActive="active">
          <mat-icon matListItemIcon>category</mat-icon>
          <span matListItemTitle>Categorias</span>
        </a>
        <a mat-list-item routerLink="/admin/customers" routerLinkActive="active">
          <mat-icon matListItemIcon>customers</mat-icon>
          <span matListItemTitle>Clientes</span>
        </a>
        <a mat-list-item routerLink="/admin/flows" routerLinkActive="active">
          <mat-icon matListItemIcon>flows</mat-icon>
          <span matListItemTitle>Flujo</span>
        </a>     
        <a mat-list-item routerLink="/admin/roles" routerLinkActive="active">
          <mat-icon matListItemIcon>rol</mat-icon>
          <span matListItemTitle>Roles</span>
        </a>  
         
      </div>

      <hr> <div class="menu-group">
        <a mat-list-item routerLink="/employee/profile" routerLinkActive="active">
          <mat-icon matListItemIcon>person</mat-icon>
          <span matListItemTitle>Mi Perfil</span>
        </a>
        <a mat-list-item routerLink="/employee/tasks" routerLinkActive="active">
          <mat-icon matListItemIcon>assignment_turned_in</mat-icon>
          <span matListItemTitle>Mis Tareas</span>
        </a>
      </div>
    </mat-nav-list>
  `,
  styles: [`
    mat-nav-list { padding-top: 10px; }
    hr { margin: 10px 0; border: 0; border-top: 1px solid #eee; }
    .active { background: rgba(0,0,0,0.05); color: #3f51b5; }
  `]
})
export class SidebarComponent implements OnInit {
  // Mantenemos el inject y ngOnInit vacíos para que no den error de compilación
  private authService = inject(AuthService);

  public menuItems: any[] = ADMIN_MENU_ITEMS;

  ngOnInit() {
    console.log('Sidebar Maestro cargado con éxito');
  }
}