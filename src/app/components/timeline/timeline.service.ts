import { Injectable } from '@angular/core';

export class MonthPeriod {
    date!: string;

    dayT!: number;
}

const periods: MonthPeriod[] = [
    { date: '2000', dayT: 7 },
    { date: '2001', dayT: 4 },
    { date: '2002', dayT: 4 },
    { date: '2003', dayT: 6 },
    { date: '2004', dayT: 9 },
    { date: '2005', dayT: 6 },
    { date: '2006', dayT: 3 },
    { date: '2007', dayT: 6 },
    { date: '2008', dayT: 13 },
    { date: '2009', dayT: 10 },
    { date: '2010', dayT: 12 },
    { date: '2011', dayT: 14 },
    { date: '2012', dayT: 11 },
    { date: '2013', dayT: 5 },
    { date: '2014', dayT: 8 },
    { date: '2015', dayT: 5 },
    { date: '2016', dayT: 3 },
    { date: '2017', dayT: 2 },
    { date: '2018', dayT: 6 },
    { date: '2019', dayT: 7 },
    { date: '2020', dayT: 4 },
    { date: '2021', dayT: 5 },
    { date: '2022', dayT: 8 },
];

@Injectable()
export class TimeLineSvc {
    getPeriods(): MonthPeriod[] {
        return periods;
    }

    getData(value: MonthPeriod[]): MonthPeriod[] {
        console.log(value);
        return value;
    }

    currentYears: any;

}
