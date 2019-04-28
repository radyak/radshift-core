import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'backend-item',
  templateUrl: './backend-item.component.html',
  styleUrls: ['./backend-item.component.scss']
})
export class BackendItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  private map = {
    'green': 'rgb(8, 224, 73)',
    'red': 'rgb(224, 8, 73)',
    'default': 'rgb(224, 224, 224)'
  };

  @Input() backend: any;

  getColor() {
    return this.map[this.backend.status.indicator] || this.map['default']
  }

}
