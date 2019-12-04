import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component'
import { ModalOptions } from './modal-options';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: NgbModal) { }

  public open(modalOptions: ModalOptions) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.options = modalOptions;
    return modalRef.result;
  }
}
