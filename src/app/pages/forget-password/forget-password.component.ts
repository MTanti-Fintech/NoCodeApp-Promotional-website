import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ForgotpasswordService } from './forget-password.service';
@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetpasswordComponent implements OnInit {

  forgotpasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: ForgotpasswordService,       
) {
}

  ngOnInit(): void {
    this.forgotpasswordForm = this.formBuilder.group({
      username: ['', Validators.required],   
      updateOn: 'blur'
      
  });
  }

      get f() { return this.forgotpasswordForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.forgotpasswordForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.forgotpassword(this.f.username.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.loading = false;
                });
    }
}
