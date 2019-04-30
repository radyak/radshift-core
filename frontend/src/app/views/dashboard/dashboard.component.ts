import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendsService } from '../../services/backends.service';
import { Backend } from '../../model/Backend';
import { NotificationService } from 'src/app/components/notification.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public backends: Backend[];

  constructor(private router: Router, private backendsService: BackendsService, private notification: NotificationService) {
  }

  ngOnInit() {
    this.notification.info('Hello world!', 'Toastr fun!');
    this.update()
  }

  update() {
    this.backendsService.getBackends().subscribe((backends: Backend[]) => {
      this.backends = backends
    })
  }

  showDetails(backend) {
    this.router.navigate(['backend', backend.name]);
  }

}
