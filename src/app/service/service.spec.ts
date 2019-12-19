import { TestBed, inject } from '@angular/core/testing';


import { HttpClientModule } from '@angular/common/http';
import { Service } from './service';

describe('Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [Service]
        });
    });

    it('should be created', () => {
        const service: Service = TestBed.get(Service);
        expect(service).toBeTruthy();
    });
});
