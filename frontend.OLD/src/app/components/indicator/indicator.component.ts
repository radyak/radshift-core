import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() state: string = "unknown";

}
