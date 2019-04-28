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

  @Input() backend: any;

}
