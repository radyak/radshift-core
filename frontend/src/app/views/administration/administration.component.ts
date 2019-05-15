import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/components/notification.service';
import { User } from 'src/app/model/User';
import { Permission } from 'src/app/model/Permission';
import { Login } from 'src/app/model/Login';
import { Registration } from 'src/app/model/Registration';
import { ModalService } from 'src/app/components/modal.service';
import { ModalOptions } from 'src/app/components/modal-options';

@Component({
  selector: 'administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  private config: Object = {};
  private errors: Object = {};
  
  private users: User[] = [];
  private currentPermissions: Permission[] = [];
  private currentUser: User;
  private newUserRegistration: Registration = {
    username: '',
    password: '',
    passwordRepeat: ''
  };

  constructor(
    private adminService: AdminService,
    private notification: NotificationService,
    private modal: ModalService
  ) { }

  ngOnInit() {
    this.update();
  }

  update() {
    this.adminService.getConfig().subscribe(config => {
      this.config = config;
    });
    this.adminService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  updateConfig() {
    this.adminService.saveConfig(this.config).subscribe(
      config => {
        this.config = config;
        this.notification.success('Configuration was updated')
        this.errors = {}
      },
      errorResponse => {
        let errors = errorResponse.error.errors
        for (let i in errors) {
          let error = errors[i]
          this.errors[error.property] = error.message
        }
        this.notification.error('Please check your inputs', 'Could not update configuration')
      }
    );
  }

  showEditUserForm(user: User) {
    this.errors = {};
    this.assignCurrentPermissionsToCurrentUser()
    this.currentUser = user;
    if (!user.permissions) {
      return;
    }
    this.currentPermissions = user.permissions.map((permission, index) => {
      return {
        index: index,
        name: permission
      }
    })
  }

  showNewUserForm() {
    this.errors = {};
    this.assignCurrentPermissionsToCurrentUser()
    this.currentUser = null;
    this.newUserRegistration = {
      username: '',
      password: '',
      passwordRepeat: ''
    };
  }

  assignCurrentPermissionsToCurrentUser() {
    if (this.currentUser) {
      this.currentUser.permissions = this.currentPermissions
          .filter((permission => !!permission))
          .map((permission: Permission) => permission.name);
    }
  }

  updateUser(user: User) {
    this.assignCurrentPermissionsToCurrentUser();
    this.adminService.updateUser(user).subscribe(
      () => {
        this.notification.success('User updated')
      },
      err => {
        this.notification.error('Could not update user')
      }
    );
  }

  addPermission(permission: string) {
    this.currentPermissions.push({
      index: Math.random(),
      name: permission
    });
  }

  removePermission(permission: Permission) {
    let index = this.currentPermissions.indexOf(permission);
    this.currentPermissions.splice(index, 1);
  }

  addNewUser() {
    console.log('addNewUser', JSON.stringify(this.newUserRegistration));
    this.adminService.createNewUser(this.newUserRegistration).subscribe(
      () => {
        this.notification.success(`Created new user '${this.newUserRegistration.username}'`, `User created`);
        this.update();
        this.showNewUserForm();
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

}
