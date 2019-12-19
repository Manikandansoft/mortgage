import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
import { MustMatch } from 'src/app/helper/must-match';
import { CustomValidation } from 'src/app/helper/validation';
import { Option } from 'src/app/model/model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  spinner = false;
  documentTypes: Option[];
  dobErrorFlag: string;

  constructor(
    private fb: FormBuilder,
    public api: Service,
    private url: UrlConfig,
    private router: Router,
    private validate: CustomValidation
  ) { }

  /* Form creation */
  private createForm() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      gender: ['male', Validators.required],
      typeOfId: ['', Validators.required],
      idProofNumber: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required],
      salary: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  /*  Access to form fields */
  get register() {
    return this.registerForm.controls;
  }

  /* To check admission date valid*/
  public dobValid(event: Date) {
    this.dobErrorFlag = '';
    if (this.validate.checkFutureDate(event, new Date())) {
      this.dobErrorFlag = 'DOB date should not be in the future date';
    } else if (this.validate.calculateAge(this.registerForm.value.dob) < 18) {
      this.dobErrorFlag = 'Customer age should be above 18';
    }
  }
  /* Sign up action */
  public signUp() {
    this.submitted = true;
    if (this.registerForm.valid && !this.dobErrorFlag) {
      /* Age calculation */
      const gettingAge = this.validate.calculateAge(this.registerForm.value.dob);
      /* Preparing the post data */
      const postObject = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        age: gettingAge,
        gender: this.registerForm.value.gender,
        typeOfId: this.registerForm.value.typeOfId.value,
        idProofNumber: this.registerForm.value.idProofNumber,
        mobileNumber: this.registerForm.value.mobileNumber,
        address: this.registerForm.value.address,
        dob: this.validate.convertDate(this.registerForm.value.dob),
        password: this.registerForm.value.password,
        salary: this.registerForm.value.salary,
      };
      this.spinner = true;
      /* Api call*/
      this.api.postCall(this.url.urlConfig().userRegister, JSON.stringify(postObject), 'post').subscribe(user => {
        this.spinner = false;
        if (user) {
          user.message = user.message + ' Do you want to login?';
          this.api.alertConfig = this.api.modalConfig('Success', user, true, ['Yes', 'No']);
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
    } else if (action === 'Yes') {
      this.router.navigate(['/login']);
      this.api.alertConfigDefaultValue();
    } else {
      this.api.alertConfigDefaultValue();
      this.reset();
    }
  }
  /* form reset */
  public reset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  ngOnInit() {
    /* Check whether login/not */
    if (!this.api.loggedUser()) {
      this.router.navigate(['/register']);
    } else {
      if (this.api.loggedUser().role === 'ADMIN') {
        this.router.navigate(['/create-mortgage']);
      } else {
        this.router.navigate(['/account-summary']);
      }
    }
    /* Call the form creation while on component initiation */
    this.createForm();
    /*preparing document Type */
    this.documentTypes = [
      { name: 'Adhaar Card', value: 'adhaar' },
      { name: 'Voter ID', value: 'voterID' },
      { name: 'Pan Card', value: 'pan' }
    ];
  }

}
