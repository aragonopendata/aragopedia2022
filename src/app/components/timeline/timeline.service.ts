import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class YearsPeriod {
    date!: string;
    dataQuantity!: string;
}

const periods: YearsPeriod[] = [
    { date: '2000', dataQuantity: '7' },
    { date: '2001', dataQuantity: '4' },
    { date: '2002', dataQuantity: '4' },
    { date: '2003', dataQuantity: '6' },
    { date: '2004', dataQuantity: '9' },
    { date: '2005', dataQuantity: '6' },
    { date: '2006', dataQuantity: '3' },
    { date: '2007', dataQuantity: '6' },
    { date: '2008', dataQuantity: '13' },
    { date: '2009', dataQuantity: '10' },
    { date: '2010', dataQuantity: '12' },
    { date: '2011', dataQuantity: '14' },
    { date: '2012', dataQuantity: '11' },
    { date: '2013', dataQuantity: '5' },
    { date: '2014', dataQuantity: '8' },
    { date: '2015', dataQuantity: '5' },
    { date: '2016', dataQuantity: '3' },
    { date: '2017', dataQuantity: '2' },
    { date: '2018', dataQuantity: '6' },
    { date: '2019', dataQuantity: '7' },
    { date: '2020', dataQuantity: '4' },
    { date: '2021', dataQuantity: '5' },
    { date: '2022', dataQuantity: '8' },
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
