import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/User';
import { Permission } from 'src/app/model/Permission';
import { Registration } from 'src/app/model/Registration';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/components/notification.service';
import { ModalService } from 'src/app/components/modal.service';
import { ModalOptions } from 'src/app/components/modal-options';

@Component({
  selector: 'administration-users',
  templateUrl: './administration-users.component.html',
  styleUrls: ['./administration-users.component.scss']
})
export class AdministrationUsersComponent implements OnInit {

  errors: Object = {};
  
  users: User[] = [];
  permissions: Permission[] = [];

  currentUser: User;
  newUserRegistration: Registration;

  constructor(
    private adminService: AdminService,
    private notification: NotificationService,
    private modal: ModalService
  ) { }

  ngOnInit() {
    this.update();
  }

  update() {
    this.newUserRegistration = {
      username: '',
      password: '',
      passwordRepeat: ''
    };
    this.currentUser = null;
    this.adminService.getUsers().subscribe(users => {
      this.users = users;
    });
    this.adminService.getPermissions().subscribe(permissions => {
      this.permissions = permissions;
    });
  }

  showEditUserForm(user: User) {
    this.errors = {};
    if (this.currentUser == user) {
      this.currentUser = null;
    } else {
      this.currentUser = user;
    }
  }

  updateUserPermissions(user: User) {
    this.adminService.updateUserPermissions(user).subscribe(
      () => {
        this.notification.success('User permissions updated')
      },
      err => {
        this.notification.error('Could not update user permissions')
      }
    );
  }

  updateUserPassword(user: User) {
    this.adminService.updateUserPassword(user).subscribe(
      () => {
        this.notification.success('User password updated')
      },
      err => {
        let errors = err.error.errors;
        for (let i in errors) {
          let error = errors[i];
          this.errors[error.property] = error.message;
        }
        this.notification.error('Could not update user password')
      }
    );
    user.password = null;
    user.passwordRepeat = null;
  }

  addNewUser() {
    this.adminService.createNewUser(this.newUserRegistration).subscribe(
      () => {
        this.notification.success(`Created new user '${this.newUserRegistration.username}'`, `User created`);
        this.update();
      },
      err => {
        this.errors = {}
        this.notification.error(`Could not creat new user '${this.newUserRegistration.username}'`, `An error occurred`);
        let errors = err.error.errors;
        for (let i in errors) {
          let error = errors[i];
          this.errors[error.property] = error.message;
        }
      }
    )
  }

  showDeleteUserDialog(user: User) {
    const modalOptions: ModalOptions = {
      title: `Delete user`,
      message: `Do you really want to delete the user '${user.username}'?`
    };

    this.modal.open(modalOptions).then((result) => {
      if (result) {
        this.deleteUser(user);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteUser(user: User) {
    this.adminService.deleteUser(user).subscribe(
      () => {
        this.notification.success(`Deleted user '${user.username}'`);
        this.update();
      },
      err => {
        this.notification.error(`Could not delete user '${user.username}'`);
      }
    )
  }

  hasPermission(user: User, permission: Permission) {
    return user.permissions && (user.permissions.indexOf(permission.name) !== -1);
  }

  toggleUserPermission(user: User, permission: Permission) {
    if (this.hasPermission(user, permission)) {
      let index = user.permissions.indexOf(permission.name);
      user.permissions.splice(index, 1);
    } else {
      user.permissions.push(permission.name);
    }
  }

}
