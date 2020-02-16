import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatChipsModule,
  MatDialogModule,
  MatSidenavModule,
  MatListModule,
  MatCheckboxModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { LogoComponent } from './components/logo/logo.component';
import { NotificationComponent } from './components/notification/notification.component';
import { AdministrationComponent } from './views/administration/administration.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { HeaderComponent } from './components/header/header.component';
import { DeleteUserDialogComponent } from './components/delete-user-dialog/delete-user-dialog.component';
import { UserSettingsComponent } from './views/user-settings/user-settings.component';
import { ErrorHintComponent } from './components/error-hint/error-hint.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { SystemstatsComponent } from './views/systemstats/systemstats.component';
import { PercentagePipe } from './pipes/percentage.pipe';
import { MemoryPipe } from './pipes/memory.pipe';
import { TimespanPipe } from './pipes/timespan.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoComponent,
    NotificationComponent,
    AdministrationComponent,
    EditUserComponent,
    HeaderComponent,
    DeleteUserDialogComponent,
    UserSettingsComponent,
    ErrorHintComponent,
    NotFoundComponent,
    SystemstatsComponent,
    PercentagePipe,
    MemoryPipe,
    TimespanPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ChartsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatChipsModule,
    MatDialogModule,
    MatSidenavModule,
    MatListModule,
    MatCheckboxModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    NotificationComponent,
    DeleteUserDialogComponent
  ]
})
export class AppModule { }
