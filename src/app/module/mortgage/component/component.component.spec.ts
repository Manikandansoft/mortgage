import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { MortgageComponent } from './component.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
import { of } from 'rxjs';

describe('MortgageComponent', () => {
  let component: MortgageComponent;
  let fixture: ComponentFixture<MortgageComponent>;
  let api: Service;

  /* create mock data for testing */
  const MockUserService = {
    isValidUser: false,
    setValidUser: (flag: boolean) => { MockUserService.isValidUser = flag; },
    currentUser: {
      userName: 'Mani',
      userId: 1,
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
    postCall(url: string, data: any, type: string) {
      return of({
        transactions: [
          {
            fromAccount: '1224234',
            toAccount: '24234234',
            amount: '34534545',
            status: 'Active',
            transactionDate: '20/04/99',
            benefactorName: 'Mani'
          }
        ]
      });
    },
    getList(url: string) {
      return of({
        favoritePayees: [
          {
            payeeId: 12345,
            accountNumber: 1234567,
            favoriteName: 'Raj',
            bankName: 'ICIC'
          }
        ],
        bank: {
          bankName: 'ICICI',
          branchName: 'Bangalore',
          message: 'test',
          statusCode: 200
        }
      });
    }
  };

  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();

  const selectedRow = {
    userId: 1,
    customerName: 'Mani',
    age: 26,
    salary: 10000,
    balance: 10000,
    gender: 'male',
    accountType: 'SAVINGD'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MortgageComponent],
      imports: [SharedModuleModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: Service, useValue: MockUserService },
        { provide: FormBuilder, useValue: formBuilder },
        UrlConfig],
    })
      .compileComponents();
    api = TestBed.get(Service);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check form creation while ngOnInit', () => {
    component.ngOnInit();
    component.mortgageForm = formBuilder.group({
      mortgegeType: ['', Validators.required],
      amount: ['', Validators.required],
      tenure: ['', Validators.required],
    });
    expect(component.mortgageForm.valid).toBeFalsy();
  });

  it('should validate Create Mortgage', () => {
    const response = {
      firstName: 'Mani',
      userId: 1,
      role: 'ADMIN'
    };
    component.mortgageForm.controls.mortgegeType.setValue('House Loan');
    component.mortgageForm.controls.amount.setValue('1000');
    component.mortgageForm.controls.tenure.setValue(1);
    component.submitted = true;
    component.interestFlag = false;
    // component.createMortgage();
    expect(component.mortgageForm.valid).toBeTruthy();
    // expect(component.spinner).toBeFalsy();

  });
  it('should validate reset', () => {
    component.reset();
    expect(component.createMortgageFlag).toBe(false);
    expect(component.submitted).toBe(false);
    expect(component.interestRate).toBe(8);
  });

  describe('should validate modal action', () => {
    it('Should validate modal action as Ok', () => {
      const action = 'ok';
      component.modalAction(action);
      api.alertConfigDefaultValue();
    });
    it('Should validate modal action as Close', () => {
      const action = 'Close';
      component.modalAction(action);
      api.alertConfigDefaultValue();
      expect(action).toEqual(action);
    });
    it('Should validate modal action as No', () => {
      const action = 'No';
      component.modalAction(action);
      api.alertConfigDefaultValue();
      expect(action).toEqual(action);
    });
  });

  it('Should check component Interest', () => {
    component.submitted = false;
    component.compoundInterest(1000, 8, 1, 1);
  });
  it('Should validate calculate ', () => {
    component.warningMessage = '';
    component.selectedRow = selectedRow;
    component.mortgageForm.controls.tenure.setValue(1);
    component.mortgageForm.controls.amount.setValue('1000');
    component.calculateEMI();
  });

  it('Should validate Close view ', () => {
    component.viewMortgageFlag = false;
    expect(component.viewMortgageFlag).toEqual(false);
  });

  describe('should validate getAction form grid', () => {
    it('Should validate Close Create ', () => {
      component.createMortgageFlag = false;
      const event = {
        gridAction: {
          buttonName: 'Create',
        },
        gridValue: selectedRow
      };
      component.getAction(event);
      expect(component.interestRate).toEqual(8);
      expect(component.createMortgageFlag).toEqual(true);
    });
    it('Should validate Close view ', () => {
      component.createMortgageFlag = false;
      const event = {
        gridAction: {
          buttonName: 'View',
        },
        gridValue: selectedRow
      };
      component.getAction(event);
      expect(component.viewMortgageFlag).toEqual(true);
    });
  });

});
