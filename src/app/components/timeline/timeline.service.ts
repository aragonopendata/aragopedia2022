import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class YearsPeriod {
    date!: string;
    dataQuantity!: string;
}

const periods: YearsPeriod[] = [
];

let currentYears: YearsPeriod[] = [];

@Injectable({
    providedIn: 'root',
})

export class TimeLineSvc {
    queryUrlYears!: string;
    constructor(private http: HttpClient) { };

    getAllYears(query: string): Observable<any> {
        return this.http.get(query);
    }

    getPeriods(): YearsPeriod[] {
        return periods;
    }

    getData(value: YearsPeriod[]): YearsPeriod[] {
        return value;
    }

    setCurrentYears(newRange: YearsPeriod[]): void {
        currentYears = newRange;
    }

    getCurrentYears(): YearsPeriod[] {
        return currentYears;
    }

}
