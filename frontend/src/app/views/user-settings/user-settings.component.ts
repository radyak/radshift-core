import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { mustMatch } from 'src/app/functions/mustMatch';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  userPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.userPasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordRepeat: ['']
    }, {
      validator: mustMatch('newPassword', 'newPasswordRepeat')
    });
  }


  submitUserPassword(): void {
    if (!this.userPasswordForm.valid) {
      return
    }
    this.authService.updateUserPassword(
      this.userPasswordForm.controls.oldPassword.value,
      this.userPasswordForm.controls.newPassword.value
    ).subscribe(user => {
      this.userPasswordForm.controls.oldPassword.patchValue('')
      this.userPasswordForm.controls.newPassword.patchValue('')
      this.userPasswordForm.controls.newPasswordRepeat.patchValue('')
      this.notificationService.info('Password updated');
    }, (err) => {
      this.notificationService.error('Could not update password');
    })
  }

}
