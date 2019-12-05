import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendsService } from '../../services/backends.service';
import { Backend } from '../../model/Backend';
import { ModalService } from '../../components/modal.service';
import { ModalOptions } from 'src/app/components/modal-options';
import { Metrics } from 'src/app/model/Metrics';


const indicatorMap = {
  'running': 'green',
  'exited': 'default',
  'error': 'red'
};

@Component({
  selector: 'backend-details',
  templateUrl: './backend-details.component.html',
  styleUrls: ['./backend-details.component.scss']
})
export class BackendDetailsComponent implements OnInit {

  // TODO: Remove default
  public backend: Backend = {
    status: "running",
    name: "test-app",
    description: "Some sample app",
    label: "Test-App",
    image: "testapp",
    isInstalled: true
  }
  public metrics: Metrics;

  public isLoading: boolean = false;

  constructor(
    private location: Location,
    private backendsService: BackendsService,
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService) { }

  ngOnInit() {
    this.update()
  }

  update(): void {
    this.isLoading = true;
    let name: string = this.route.snapshot.params['name']
    
    this.backendsService.getBackend(name).subscribe((backend: Backend) => {
      this.backend = backend;
      this.isLoading = false;
    })
    
    this.backendsService.getBackendMetrics(name).subscribe((metrics: Metrics) => {
      this.metrics = metrics;
    })
  }

  getDisabled() {
    return this.isLoading ? 'disabled' : null;
  }

  stop(): void {
    this.isLoading = true;
    let name: string = this.route.snapshot.params['name']
    this.backendsService.stopBackend(name).subscribe((backend: Backend) => {
      this.backend = backend
      this.isLoading = false;
      this.metrics = null;
    })
  }

  start(): void {
    this.isLoading = true;
    let name: string = this.route.snapshot.params['name']
    this.backendsService.startBackend(name).subscribe((backend: Backend) => {
      this.backend = backend
      this.isLoading = false;
      this.update();
    })
  }

  removeDialog() {
    const modalOptions: ModalOptions = {
      title: `Remove ${this.backend.label}`,
      message: `Do you really want to remove the backend ${this.backend.label}?`
    }

    this.modal.open(modalOptions).then((result) => {
      if (result) {
        this.onConfirmRemove()
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  onConfirmRemove() {
    this.isLoading = true;
    let name: string = this.route.snapshot.params['name']
    this.backendsService.removeBackend(name).subscribe((backend: Backend) => {
      this.isLoading = false;
      this.router.navigate(['dashboard']);
    })
  }

  isRunning(): boolean {
    return this.backend.status === 'running';
  }

  goBack(): void {
    this.location.back();
  }

  open(): void {
    window.open(this.backend.entry, "_blank");
  }

  public indicator(state: string) {
    return indicatorMap[state] || 'default'
  }

}