import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'label-error',
  templateUrl: './label-error.component.html',
  styleUrls: ['./label-error.component.scss']
})
export class LabelErrorComponent implements OnInit {

  @Input() message: string;

  constructor() { }

  ngOnInit() {
  }

}
