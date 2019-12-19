import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilder, Validators } from '@angular/forms';
import { ListComponent } from './list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
import { of } from 'rxjs';
import { Favorite } from 'src/app/model/model';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let api: Service;
  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();

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
    postCall(url: string, data: any, type: string) {
      return of({});
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
          message: 'String',
          statusCode: 200
        }
      });
    },
    deleteData() {
      return of({});
    }
  };

  const selectedRow: Favorite = {
    payeeId: 12345,
    accountNumber: 1234567,
    favoriteName: 'Raj',
    bankName: 'ICIC'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [SharedModuleModule, RouterTestingModule, HttpClientTestingModule],
      providers: [UrlConfig,
        { provide: Service, useValue: MockUserService },
        { provide: FormBuilder, useValue: formBuilder }
      ],
    })
      .compileComponents();
    api = TestBed.get(Service);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check ngOnInit form creation', () => {
    component.ngOnInit();
    component.favaritePayee = formBuilder.group({
      accountNumber: ['', Validators.required],
      favoriteName: ['', Validators.required],
      ifscCode: ['', Validators.required],
    });
    expect(component.favaritePayee.valid).toBeFalsy();
  });

  it('should validate checkValidAccount', () => {
    const favorite = {
      bankName: 'ICICI',
      branchName: 'Bangalore',
      message: 'String',
      statusCode: 200
    };
    component.favaritePayee.controls.accountNumber.setValue('Mani');
    component.favaritePayee.controls.favoriteName.setValue('Mani');
    component.favaritePayee.controls.ifscCode.setValue('IFSC0001');
    component.invalidBank = false;
    component.showBankDetail = false;
    component.checkValidAccount();
    expect(component.favaritePayee.valid).toBeTruthy();
    MockUserService.getList('url').subscribe(bank => {
      component.bankDetail = bank.bank;
      expect(component.bankDetail).toEqual(favorite);
    });
  });

  it('should validate addPayee', () => {
    const favorite = [
      {
        payeeId: 12345,
        accountNumber: 1234567,
        favoriteName: 'Raj',
        bankName: 'ICIC'
      }
    ];
    component.invalidBank = false;
    component.submitted = true;
    component.favoriteList = favorite;
    component.addFavorite =  true;
    component.favaritePayee.controls.accountNumber.setValue('Mani');
    component.favaritePayee.controls.favoriteName.setValue('Mani');
    component.favaritePayee.controls.ifscCode.setValue('IFSC0001');
    component.addEditdPayee();
    expect(component.spinner).toBeFalsy();
  });

  it('should validate reset', () => {
    component.invalidBank = false;
    component.showBankDetail = false;
    component.submitted = false;
    component.createFavoriteFlag = false;
    expect(component.addFavorite).toEqual(false);
    component.reset();
  });

  it('should validate getAction while edit', () => {
    component.createFavoriteFlag = false;
    const event = {
      gridAction: {
        buttonName: 'Edit',
      },
      gridValue: selectedRow
    };
    component.getAction(event);
    component.favaritePayee.controls.accountNumber.setValue('Mani');
    component.favaritePayee.controls.favoriteName.setValue('Mani');
    component.favaritePayee.controls.ifscCode.setValue('IFSC0001');
    component.selectedRow = event.gridValue;
    expect(component.selectedRow).toEqual(event.gridValue);
  });

  it('should validate getAction while delete', () => {
    component.createFavoriteFlag = false;
    const event = {
      gridAction: {
        buttonName: 'Delete',
      },
      gridValue: selectedRow
    };
    component.getAction(event);
    api.alertConfig = api.modalConfig('Confirm', 'Are you sure want to remove this benefactor', true, ['Yes', 'No']);
    expect(component.selectedRow).toEqual(event.gridValue);
  });

  it('should validate addPayee while add', () => {
    component.createFavoriteFlag = true;
    component.addFavorite = true;
    component.addPayee();
    expect(component.addFavorite).toEqual(true);
  });

  it('Should check modalAction Ok', () => {
    const action = 'Ok';
    component.modalAction(action);
    api.alertConfigDefaultValue();
    expect(action).toEqual(action);
  });

  it('Should check modalAction Close', () => {
    const action = 'Close';
    component.modalAction(action);
    component.createFavoriteFlag = false;
    component.addFavorite = false;
  });

  it('Should check modalAction Yes', () => {
    const event = {
      gridAction: {
        buttonName: 'Edit',
      },
      gridValue: selectedRow
    };
    component.selectedRow = event.gridValue;
    const action = 'Yes';
    component.modalAction(action);
    component.deleteFavorite();
    expect(action).toEqual(action);
  });

  it('Should check modalAction No', () => {
    const action = 'No';
    component.modalAction(action);
    api.alertConfigDefaultValue();
    expect(action).toEqual(action);
  });

});
