import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  private config: Object = {};

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.adminService.getConfig().subscribe(config => {
      this.config = config;
    });
  }

  submit() {
    this.adminService.saveConfig(this.config).subscribe(config => {
      config ? this.config = config : '';
    });
  }

}
