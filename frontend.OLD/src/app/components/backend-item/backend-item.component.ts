import { Component, OnInit, Input } from '@angular/core';


const indicatorMap = {
  'running': 'green',
  'exited': 'default',
  'error': 'red'
};


@Component({
  selector: 'backend-item',
  templateUrl: './backend-item.component.html',
  styleUrls: ['./backend-item.component.scss']
})
export class BackendItemComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() backend: any;

  public indicator(state: string) {
    return indicatorMap[state] || 'default'
  }

}
