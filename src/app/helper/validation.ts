import { Injectable } from '@angular/core';

@Injectable()
export class CustomValidation {
    constructor() { }

    /* check whether it's valid date or not */
    public checkFutureDate(fromDate: Date, toDate: Date) {
        const selected = new Date(fromDate).setHours(0, 0, 0, 0);
        const current = new Date(toDate).setHours(0, 0, 0, 0);
        if (selected > current) {
            return true;
        }
    }

    /* calculate age */
    public calculateAge(dateString: Date) {
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    /* Convert Date into json date response format(dd-mm-yy) */
    public convertDate(dateVal: Date) {
        const date = new Date(dateVal);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return [date.getFullYear().toString(), month, day].join('-');
    }

}
