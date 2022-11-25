import { HttpClient } from '@angular/common/http';
import { Injectable, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

export class YearsPeriod {
    date!: string;
    dataQuantity!: string;
}

const periods: YearsPeriod[] = [
];


@Injectable({
    providedIn: 'root',
})

export class TimeLineSvc implements OnInit {

    currentYears: YearsPeriod[] = [];
    queryUrlYears!: string;
    constructor(private http: HttpClient) { };

    ngOnInit(): void {
    }
    getAllYears(query: string): Observable<any> {
        return this.http.get(query);
    }

    getPeriods(): YearsPeriod[] {
        return periods;
    }

    getSelectedYears(value: YearsPeriod[]) {
        return value;
    }

    setCurrentYears(newRange: YearsPeriod[]): void {
        this.currentYears = newRange;
    }

    getCurrentYears(): YearsPeriod[] {
        return this.currentYears;
    }

}
