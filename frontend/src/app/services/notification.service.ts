import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
// import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  error(text: string) {
    // this.snackBar.openFromComponent(NotificationComponent, {
    //   duration: 5 * 1000,
    // });
    this.snackBar.open('Error Message', 'Error label', {
      // duration: 5 * 1000,
      panelClass: "error"
    });

  }

}
