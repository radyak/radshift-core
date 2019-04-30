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

  public success(text: string, title: string = 'Error') {
    return this.toastr.success(text, title, {...defaultConfig, tapToDismiss: true});
  }

  public info(text: string, title: string = 'Error') {
    return this.toastr.info(text, title, defaultConfig);
  }

  public warn(text: string, title: string = 'Error') {
    return this.toastr.warning(text, title, defaultConfig);
  }

  public error(text: string, title: string = 'Error') {
    return this.toastr.error(text, title, defaultConfig);
  }

}
