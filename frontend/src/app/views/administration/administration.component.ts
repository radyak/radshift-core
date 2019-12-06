import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { User } from 'src/app/model/User';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { mustMatch } from 'src/app/functions/mustMatch';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  users: User[];
  newUserForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.newUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      permissions: ['', Validators.required]
    }, {
      validator: mustMatch('password', 'passwordRepeat')
    });
  }

  ngOnInit() {
    this.adminService.getUsers().subscribe(users => {
      this.users = users;
    })
  }

  submitNewUser(): void {
    if (!this.newUserForm.valid) {
      return
    }
  }

}
