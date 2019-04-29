import { Component, OnInit } from '@angular/core';
import { BackendsService } from 'src/app/services/backends.service';
import { Backend } from 'src/app/model/Backend';

@Component({
  selector: 'store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  constructor(private backendsService: BackendsService) { }

  public availableBackends: Backend[];
  public activeBackend: Backend;

  ngOnInit() {
    this.update();
  }

  update() {
    this.backendsService.getAvailableBackends().subscribe((backends: Backend[]) => {
      this.availableBackends = backends
    })
  }

}
