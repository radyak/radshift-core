import { Component, OnInit, Input } from '@angular/core';
import { Backend } from 'src/app/model/Backend';
import { Router } from '@angular/router';
import { BackendsService } from 'src/app/services/backends.service';
import { ModalService } from '../modal.service';
import { ModalOptions } from '../modal-options';

@Component({
  selector: 'store-item',
  templateUrl: './store-item.component.html',
  styleUrls: ['./store-item.component.scss']
})
export class StoreItemComponent implements OnInit {

  constructor(
    private router: Router,
    private backendsService: BackendsService,
    private modal: ModalService) { }

  @Input() isActive: boolean;
  @Input() isLoading: boolean;
  @Input() backend: Backend;

  ngOnInit() {
  }

  showDetails(backend: Backend) {
    this.router.navigate(['backend', backend.name]);
  }


  installDialog(backend: Backend) {
    const modalOptions: ModalOptions = {
      title: `Install ${this.backend.label}`,
      message: `Do you really want to install the backend ${this.backend.label}?`
    }

    this.modal.open(modalOptions).then((result) => {
      if (result) {
        this.onConfirmInstall(backend)
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  onConfirmInstall(backend: Backend) {
    this.isLoading = true;
    
    this.backendsService.installBackend(backend.name).subscribe(result => {
      this.isLoading = false;
      this.showDetails(backend);
    })
  }

  getColor() {
    return this.backend.isInstalled ? 'dark' : 'green'
  }

}
