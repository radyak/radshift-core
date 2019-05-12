import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/components/notification.service';

@Component({
  selector: 'administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  private config: Object = {};
  private errors: Object = {};

  constructor(
    private adminService: AdminService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.adminService.getConfig().subscribe(config => {
      this.config = config;
    });
  }

  submit() {
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

}
