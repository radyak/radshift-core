import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

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
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth-interceptor';

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
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ToastNoAnimationModule.forRoot(),
    ReactiveFormsModule
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
