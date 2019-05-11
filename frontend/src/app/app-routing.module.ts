import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { StoreComponent } from './views/store/store.component';
import { BackendDetailsComponent } from './views/backend-details/backend-details.component';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { AdministrationComponent } from './views/administration/administration.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administration',
    component: AdministrationComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      requiredRole: 'admin'
    }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'store',
    component: StoreComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'backend/:name',
    component: BackendDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
export { routes };

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
