import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/components/notification.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  private config: Object = {};
  private errors: Object = {};
  
  private users: User[] = [];
  private permissions: Object[] = [];
  private currentUser: User;
  private newUser: Object;

  constructor(
    private adminService: AdminService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.adminService.getConfig().subscribe(config => {
      this.config = config;
    });
    this.adminService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  editUser(user: User) {
    this.currentUser = user;
    this.permissions = user.permissions.map(permission => {
      return {
        id: 'perm_id-' + Math.random(),
        name: permission
      }
    })
    this.newUser = null;
  }

  showNewUserForm() {
    this.currentUser = null;
    this.newUser = {
      username: '',
      password: ''
    };
  }

  updateUser(user: User) {
    console.log(user);
  }

  addNewPermission(permission: string) {
    this.permissions.push({
      id: 'perm_id-' + Math.random(),
      name: permission
    });
  }

  removePermission(permission: string, user: User) {
    let index = user.permissions.indexOf(permission)
    user.permissions.splice(index, 1);
  }

  submitConfig() {
    console.log('Saving:', this.config)
    this.adminService.saveConfig(this.config).subscribe(config => {
      this.config = config;
      this.notification.success('Configuration was updated')
      this.errors = {}
    }, errorResponse => {
      let errors = errorResponse.error.errors
      for (let i in errors) {
        let error = errors[i]
        this.errors[error.property] = error.message
      }
      this.notification.error('Please check your inputs', 'Could not update configuration')
    });
  }

  addNewUser() {
    this.newUser = null;
  }

}
