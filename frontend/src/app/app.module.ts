import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { StoreComponent } from './views/store/store.component';
import { BackendDetailsComponent } from './views/backend-details/backend-details.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LogoComponent } from './components/logo/logo.component';
import { BackendItemComponent } from './components/backend-item/backend-item.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { BackendsService } from './services/backends.service';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from './components/modal/modal.component';
import { StoreItemComponent } from './components/store-item/store-item.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {
  ToastrModule,
  ToastNoAnimation,
  ToastNoAnimationModule
} from 'ngx-toastr';
import { IndicatorComponent } from './components/indicator/indicator.component';

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
    IndicatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ToastNoAnimationModule.forRoot(),
  ],
  providers: [
    BackendsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalComponent
  ]
})
export class AppModule { }
