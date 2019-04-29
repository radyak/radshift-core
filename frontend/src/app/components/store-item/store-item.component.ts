import { Component, OnInit, Input } from '@angular/core';
import { Backend } from 'src/app/model/Backend';
import { Router } from '@angular/router';

@Component({
  selector: 'store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.scss']
})
export class StoreItemComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() isActive: boolean;
  @Input() backend: Backend;

  ngOnInit() {
  }

  showDetails(backend) {
    this.router.navigate(['backend', backend.name]);
  }

  getColor() {
    return this.backend.isInstalled ? 'dark' : 'green'
  }

}
