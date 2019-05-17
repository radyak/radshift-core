import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NotificationService } from 'src/app/components/notification.service';
import { ModalService } from 'src/app/components/modal.service';

@Component({
  selector: 'administration-config',
  templateUrl: './administration-config.component.html',
  styleUrls: ['./administration-config.component.scss']
})
export class AdministrationConfigComponent implements OnInit {

  private config: Object = {};
  private errors: Object = {};

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
  }
  
  updateConfig() {
    this.adminService.saveConfig(this.config).subscribe(
      config => {
        this.config = config;
        this.notification.success('Configuration was updated');
        this.errors = {};
      },
      errorResponse => {
        console.log(errorResponse);
        let errors = errorResponse.error.errors;
        for (let i in errors) {
          let error = errors[i];
          this.errors[error.property] = error.message;
        }
        this.notification.error('Please check your inputs', 'Could not update configuration')
      }
    );
  }

}
