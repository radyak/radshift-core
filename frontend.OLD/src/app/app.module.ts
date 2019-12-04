import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DashboardComponent } from './views/dashboard/dashboard.component';
import { StoreComponent } from './views/store/store.component';
import { BackendDetailsComponent } from './views/backend-details/backend-details.component';
import { LoginComponent } from './views/login/login.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { LogoComponent } from './components/logo/logo.component';
import { BackendItemComponent } from './components/backend-item/backend-item.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { ModalComponent } from './components/modal/modal.component';
import { StoreItemComponent } from './components/store-item/store-item.component';
import { IndicatorComponent } from './components/indicator/indicator.component';

import { BackendsService } from './services/backends.service';

import { environment } from '../environments/environment';

import {
  ToastrModule,
  ToastNoAnimation,
  ToastNoAnimationModule
} from 'ngx-toastr';
// TODO: Remove, only used in login
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { AdministrationComponent } from './views/administration/administration.component';
import { FormsModule } from '@angular/forms';
import { LabelHelpComponent } from './components/label-help/label-help.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { LabelErrorComponent } from './components/label-error/label-error.component';
import { AdministrationConfigComponent } from './views/subviews/administration-config/administration-config.component';
import { AdministrationUsersComponent } from './views/subviews/administration-users/administration-users.component';
import { AdministrationPermissionsComponent } from './views/subviews/administration-permissions/administration-permissions.component';

import { library } from '@fortawesome/fontawesome-svg-core';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    StoreComponent,
    NavbarComponent,
    LogoComponent,
    BackendItemComponent,
    BackendDetailsComponent,
    LoadingBarComponent,
    ModalComponent,
    StoreItemComponent,
    IndicatorComponent,
    LoginComponent,
    AdministrationComponent,
    LabelHelpComponent,
    FormInputComponent,
    LabelErrorComponent,
    AdministrationConfigComponent,
    AdministrationUsersComponent,
    AdministrationPermissionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ToastNoAnimationModule.forRoot({
      maxOpened: 1,
      autoDismiss: true
    }),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    BackendsService,
    {
      multi: true,
      useClass: AuthInterceptor,
      provide: HTTP_INTERCEPTORS
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalComponent
  ]
})
export class AppModule { }
