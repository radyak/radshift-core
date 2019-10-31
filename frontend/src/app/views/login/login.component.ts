import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  form: FormGroup;
  private formSubmitAttempt: boolean;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }
  
  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value, this.route.snapshot.queryParamMap.get('origin'));
    }
    this.formSubmitAttempt = true;
  }

}
