import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/model/User';
import { AdminService } from 'src/app/services/admin.service';
import { mustMatch } from 'src/app/functions/mustMatch';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  @Input('user')
  user: User;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  userDetailsForm: FormGroup;
  userPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.userDetailsForm = this.fb.group({
      username: [this.user.username, Validators.required],
      permissions: [this.user.permissions]
    });
    this.userPasswordForm = this.fb.group({
      newPassword: ['', Validators.required],
      newPasswordRepeat: ['']
    }, {
      validator: mustMatch('newPassword', 'newPasswordRepeat')
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.user.permissions.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(permission: string): void {
    const index = this.user.permissions.indexOf(permission);
    if (index >= 0) {
      this.user.permissions.splice(index, 1);
    }
  }

  submitUserDetails(): void {
    if (!this.userDetailsForm.valid) {
      return
    }
    this.adminService.updateUserPermissions({
      username: this.userDetailsForm.controls.username.value,
      permissions: this.userDetailsForm.controls.permissions.value
    }).subscribe(user => {
      this.user = user || this.user;
      this.notificationService.info('User updated');
    }, (err) => {
      this.notificationService.error('Could not update user');
    })
  }

  submitUserPassword(): void {
    if (!this.userPasswordForm.valid) {
      return
    }
    this.adminService.updateUserPassword(this.user, this.userPasswordForm.controls.newPassword.value).subscribe(user => {
      this.userPasswordForm.controls.newPassword.patchValue('')
      this.userPasswordForm.controls.newPasswordRepeat.patchValue('')
      this.notificationService.info('Password updated');
    }, (err) => {
      this.notificationService.error('Could not update password');
    })
  }

}
