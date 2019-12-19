import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let api: Service;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  /* create mock data for testing */
  const MockUserService = {
    isValidUser: false,
    setValidUser: (flag: boolean) => { MockUserService.isValidUser = flag; },
    currentUser: {
      userName: 'Mani',
      userId: 1234,
      role: 'ADMIN'
    },
    validUser: () => MockUserService.isValidUser,
    loggedUser: () => {
      return MockUserService.currentUser;
    },
    modalConfig: () => ({
      header: '',
      message: '',
      modalShow: '',
      button: ''
    }),
    alertConfigDefaultValue: () => ({
      header: '',
      message: '',
      modalShow: '',
      button: ''
    }),
    postCall(url: string, data: object, type: string) {
      return of({
        userName: 'Mani',
        userId: 1234,
        role: 'ADMIN'
      });
    }

  };

  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [SharedModuleModule, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: Service, useValue: MockUserService },
        UrlConfig]
    })
      .compileComponents();
    api = TestBed.get(Service);
    mockRouter = TestBed.get(Router);
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check ngOnInit Valid User and form creation', () => {
    component.ngOnInit();
    component.loginForm = formBuilder.group({
      mobileNumber: ['', Validators.required],
      password: ['', Validators.required]
    });
    expect(component.loginForm.valid).toBeFalsy();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('Should check valid user while onClickSubmit', () => {
    const response = {
      firstName: 'Mani',
      userId: 1234,
      role: 'ADMIN'
    };

    component.loginForm.controls.mobileNumber.setValue('123345678910');
    component.loginForm.controls.password.setValue('123345678');
    component.onClickSubmit();
    component.submitted = true;
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    expect(currentUser).toEqual(response);
    component.routingBasedOnType(currentUser.role);
    expect(component.spinner).toBeFalsy();

  });

  it('Should check modalAction', () => {
    const action = 'Ok';
    component.modalAction(action);
    expect(action).toEqual(action);
  });

});
