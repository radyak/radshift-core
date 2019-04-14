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

  private confirm() {
    this.activeModal.close(true)
  }

  private cancel() {
    this.activeModal.close(false)
  }

}
