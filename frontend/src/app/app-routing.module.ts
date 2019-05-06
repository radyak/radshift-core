import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { StoreComponent } from './views/store/store.component';
import { BackendDetailsComponent } from './views/backend-details/backend-details.component';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'store',
    component: StoreComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { 
      requiredRole: 'admin'
    }
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
