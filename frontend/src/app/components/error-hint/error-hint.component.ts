import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import ValidatorPatterns from 'src/app/model/ValidatorPatterns';

@Component({
  selector: 'error-hint',
  templateUrl: './error-hint.component.html',
  styleUrls: ['./error-hint.component.scss']
})
export class ErrorHintComponent implements OnInit {

  @Input()
  control: FormControl;

  @Input()
  message: string;

  @Input()
  validatorRule: string;

  errorMessage(): string {
    console.log(this.validatorRule, ':', ValidatorPatterns[this.validatorRule])
    if (this.validatorRule && ValidatorPatterns[this.validatorRule]) {
      return ValidatorPatterns[this.validatorRule].errorMessage;
    }
    return this.message
  }

  constructor() { }

  ngOnInit() {
  }

}
