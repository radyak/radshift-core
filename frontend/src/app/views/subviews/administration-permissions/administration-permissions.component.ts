import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Permission } from 'src/app/model/Permission';
import { NotificationService } from 'src/app/components/notification.service';

@Component({
  selector: 'administration-permissions',
  templateUrl: './administration-permissions.component.html',
  styleUrls: ['./administration-permissions.component.scss']
})
export class AdministrationPermissionsComponent implements OnInit {

  @ViewChild('newPermissionName')
  permissionNameInput: ElementRef;

  permissions: Permission[] = [];
  newPermission: Permission;
  errors: Object = {};

  constructor(
    private adminService: AdminService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.adminService.getPermissions().subscribe(
      permissions => {
        this.permissions = permissions;
      }
    )
  }

  showAddNewPermissionForm() {
    this.newPermission = {
      name: ''
    };
  }

  addNewPermission() {
    this.permissions.push(this.newPermission);
    this.newPermission = null;
  }

  deletePermission(permission: Permission) {
    let index = this.permissions.indexOf(permission);
    this.permissions.splice(index, 1);
  }

  updatePermissions() {
    this.addNewPermission()
    this.adminService.savePermissions(this.permissions).subscribe(
      permissions => {
        this.permissions = permissions;
        this.notification.success('Updated permissions')
      },
      err => {
        this.notification.error('Error while updating permissions')
      });
  }

}
