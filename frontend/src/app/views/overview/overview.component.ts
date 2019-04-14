import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendsService } from '../../services/backends.service';
import { Backend } from '../../model/Backend';

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  private backends: Backend[];

  constructor(private router: Router, private backendsService: BackendsService) {
  }

  ngOnInit() {
    this.update()
  }

  update() {
    this.backendsService.getBackends().subscribe((backends: Backend[]) => {
      this.backends = backends
    })
  }

  showDetails(backend) {
    this.router.navigate(['details', backend.name]);
  }

}
