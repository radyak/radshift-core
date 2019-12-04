import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component'
import { ModalOptions } from './modal-options';
import { ToastrService } from 'ngx-toastr';


const defaultConfig = {
  positionClass: 'toast-bottom-full-width',
  disableTimeOut: true,
  tapToDismiss: false,
  closeButton: true
};


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  public success(text: string, title: string = 'Success') {
    return this.toastr.success(text, title, {
      positionClass: 'toast-bottom-full-width',
      disableTimeOut: false,
      tapToDismiss: true,
      closeButton: false,
      enableHtml: true
    });
  }

  public info(text: string, title: string = 'Info') {
    return this.toastr.info(text, title, {
      positionClass: 'toast-bottom-full-width',
      disableTimeOut: true,
      tapToDismiss: true,
      closeButton: false,
      enableHtml: true
    });
  }

  public warn(text: string, title: string = 'Warning') {
    return this.toastr.warning(text, title, {
      positionClass: 'toast-bottom-full-width',
      disableTimeOut: true,
      tapToDismiss: true,
      closeButton: false,
      enableHtml: true
    });
  }

  public error(text: string, title: string = 'Error') {
    return this.toastr.error(text, title, {
      positionClass: 'toast-bottom-full-width',
      disableTimeOut: true,
      tapToDismiss: true,
      closeButton: false,
      enableHtml: true
    });
  }

}
