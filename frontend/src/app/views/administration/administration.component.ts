import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { User } from 'src/app/model/User';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { mustMatch } from 'src/app/functions/mustMatch';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import ValidatorPatterns from 'src/app/model/ValidatorPatterns';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  users: User[];
  newUserForm: FormGroup;
  ValidatorPatterns = ValidatorPatterns;


  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.newUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(ValidatorPatterns.USERNAME.pattern)]],
      password: ['', [Validators.required, Validators.pattern(ValidatorPatterns.PASSWORD.pattern)]],
      passwordRepeat: ['', Validators.required]
    }, {
      validator: mustMatch('password', 'passwordRepeat')
    });

    this.adminService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  submitNewUser(): void {
    if (!this.newUserForm.valid) {
      return
    }
    this.adminService.createNewUser({
      username: this.newUserForm.controls.username.value,
      password: this.newUserForm.controls.password.value
    }).subscribe(user => {
      this.newUserForm.controls.username.patchValue('');
      this.newUserForm.controls.password.patchValue('');
      this.newUserForm.controls.passwordRepeat.patchValue('');
      this.notificationService.info('User created');

      this.users.push(user);
    }, (err) => {
      console.log(err)
      this.notificationService.error('Could not create user' + (err.error ? `: ${err.error}` : '.'));
    })
  }

  deleteUser(user: User): void {
    this.adminService.deleteUser(user).subscribe(() => {
      const index = this.users.indexOf(user);
      if (index >= 0) {
        this.users.splice(index, 1);
      }
      this.notificationService.info(`User ${user.username} deleted`);
    })
  }

}
