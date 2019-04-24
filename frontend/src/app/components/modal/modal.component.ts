import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from '../modal-options';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() options: ModalOptions;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  public confirm() {
    this.activeModal.close(true)
  }

  public cancel() {
    this.activeModal.close(false)
  }

}
