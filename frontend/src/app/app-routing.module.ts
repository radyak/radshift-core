import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { AdministrationComponent } from './views/administration/administration.component';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { UserSettingsComponent } from './views/user-settings/user-settings.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { SystemstatsComponent } from './views/systemstats/systemstats.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/settings',
    pathMatch: 'full'
  },
  
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'administration',
    component: AdministrationComponent,
    canActivate: [
      AuthGuard,
      PermissionGuard
    ],
    data: {
      requiredRole: 'admin',
      label: 'Administration',
      icon: 'group'
    }
  },

  {
    path: 'settings',
    component: UserSettingsComponent,
    canActivate: [
      AuthGuard
    ],
    data: {
      label: 'Settings',
      icon: 'settings_applications'
    }
  },

  {
    path: 'system',
    component: SystemstatsComponent,
    canActivate: [
      AuthGuard,
      PermissionGuard
    ],
    data: {
      label: 'System',
      icon: 'storage'
    }
  },

  {
    path: 'notfound',
    component: NotFoundComponent
  },

  { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
