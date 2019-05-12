import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'label-help',
  templateUrl: './label-help.component.html',
  styleUrls: ['./label-help.component.scss']
})
export class LabelHelpComponent {

  @Input() text: string;
  @Input() show: boolean = false;

  isActive: boolean = false;

  constructor() { }

  toggle() {
    this.isActive = !this.isActive;
  }

}
