import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.scss']
})
export class StoreItemComponent implements OnInit {

  constructor() { }

  @Input() isActive: boolean;
  @Input() isInstalled: boolean;

  ngOnInit() {
  }

  getColor() {
    // return this.isInstalled ? 'rgb(8, 224, 73)' : '#fff'
    return this.isInstalled ? '#343a40' : '#fff'
  }

}
