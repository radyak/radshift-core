import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  error(message: string) {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: 5 * 1000,
      data: {
        message: message,
        type: 'error'
      },
      panelClass: 'error'
    });
  }

  warning(message: string) {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: 8 * 1000,
      data: {
        message: message,
        type: 'warning'
      },
      panelClass: 'warning'
    });
  }

  info(message: string) {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: 8 * 1000,
      data: {
        message: message,
        type: 'info'
      },
      panelClass: 'info'
    });
  }

}
