import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  spinner = false;
  constructor(
    private fb: FormBuilder,
    public api: Service,
    private url: UrlConfig,
    private router: Router
  ) { }

  /*  Create form fields */
  private createForm() {
    this.loginForm = this.fb.group({
      mobileNumber: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /*  Access to form fields */
  get login() { return this.loginForm.controls; }

  /* Get logged user */
  public routingBasedOnType(type: string) {
    if (type === 'ADMIN') {
      this.router.navigate(['/create-mortgage']);
    } else {
      this.router.navigate(['/account-summary']);
    }
  }
  /* Login */
  public onClickSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.spinner = true;
      const postObject = {
        mobileNumber: this.loginForm.value.mobileNumber,
        password: this.loginForm.value.password
      };
      /* Api call*/
      this.api.postCall(this.url.urlConfig().userLogin, postObject, 'post').subscribe(user => {
        if (user.userId) {
          const userDetails = {
            userId: user.userId,
            role: user.role,
            firstName: user.userName
          };
          /* Stored the user details in session storage */
          sessionStorage.setItem('currentUser', JSON.stringify(userDetails));
          this.routingBasedOnType(userDetails.role);
          this.spinner = false;
        } else {
          this.api.alertConfig = this.api.modalConfig('Error', 'Username/Password is not valid', true, ['Ok']);
          this.spinner = false;
        }
      },
        error => {
          this.spinner = false;
        });
    }
  }

  /* Modal Action */
  public modalAction(action: string): void {
    if (action === 'Ok') {
      this.api.alertConfigDefaultValue();
    }
  }

  /* Oninit call */
  ngOnInit() {
    /* Check whether login/not */
    if (!this.api.validUser()) {
      this.router.navigate(['/login']);
    } else {
      if (this.api.loggedUser() && this.api.loggedUser().role === 'ADMIN') {
        this.router.navigate(['/create-mortgage']);
      } else {
        this.router.navigate(['/account-summary']);
      }
    }
    /* Call the form creation while on component initiation */
    this.createForm();
  }

}
