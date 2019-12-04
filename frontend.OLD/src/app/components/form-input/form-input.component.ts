import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { text } from '@angular/core/src/render3';

@Component({
  selector: 'form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements OnInit {

  @Input() value: any;
  @Output() valueChange = new EventEmitter();

  @Input() property: string;
  @Input() type: string;
  @Input() label: string;
  @Input() help: string;
  @Input() error: string;

  showHelp: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onChange() {
    if (this.type === 'number') {
      this.value = parseInt(this.value)
    }
    this.valueChange.emit(this.value)
  }

  toggleHelp() {
    this.showHelp = !this.showHelp;
  }

}
