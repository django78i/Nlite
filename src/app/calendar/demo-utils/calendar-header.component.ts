import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';
import {
	subMonths,
	addMonths,
	addDays,
	addWeeks,
	subDays,
	subWeeks,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	startOfDay,
	endOfDay,
} from 'date-fns';

type CalendarPeriod = 'day' | 'week' | 'month';

function addPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
	return {
		day: addDays,
		week: addWeeks,
		month: addMonths,
	}[period](date, amount);
}

function subPeriod(period: CalendarPeriod, date: Date, amount: number): Date {
	return {
		day: subDays,
		week: subWeeks,
		month: subMonths,
	}[period](date, amount);
}

function startOfPeriod(period: CalendarPeriod, date: Date): Date {
	return {
		day: startOfDay,
		week: startOfWeek,
		month: startOfMonth,
	}[period](date);
}

function endOfPeriod(period: CalendarPeriod, date: Date): Date {
	return {
		day: endOfDay,
		week: endOfWeek,
		month: endOfMonth,
	}[period](date);
}

@Component({
	selector: 'mwl-demo-utils-calendar-header',
	templateUrl: './calendar-header.component.html',
	styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent {
	@Input() view: CalendarView | CalendarPeriod = CalendarView.Month;

	@Input() viewDate: Date;

	@Input() locale: string = 'fr';

	@Output() viewChange = new EventEmitter<CalendarView>();

	@Output() viewDateChange = new EventEmitter<Date>();

	CalendarView = CalendarView;
	minDate: Date = new Date();

	maxDate: Date = addMonths(new Date(), 1);

	prevBtnDisabled: boolean = false;

	nextBtnDisabled: boolean = false;

	constructor() {
		this.dateOrViewChanged();
	}

	increment(): void {
		this.viewDateChange.next(this.viewDate);
		this.changeDate(addPeriod(this.view, this.viewDate, 1));
	}

	decrement(): void {
		this.viewDate < this.minDate ? this.viewDateChange.next(this.minDate) : this.viewDateChange.next(this.viewDate);
		this.changeDate(subPeriod(this.view, this.viewDate, 1));
	}

	today(): void {
		this.changeDate(new Date());
	}

	dateIsValid(date: Date): boolean {
		return date >= this.minDate;
	}

	changeDate(date: Date): void {
		this.viewDate = date;
		this.dateOrViewChanged();
	}

	changeView(view: CalendarPeriod): void {
		this.view = view;
		this.dateOrViewChanged();
	}

	dateOrViewChanged(): void {
		this.prevBtnDisabled = !this.dateIsValid(
			endOfPeriod(this.view, subPeriod(this.view, this.viewDate, 1))
		);
		this.nextBtnDisabled = !this.dateIsValid(
			startOfPeriod(this.view, addPeriod(this.view, this.viewDate, 1))
		);
		if (this.viewDate < this.minDate) {
			this.changeDate(this.minDate);
		}
		
	}
}
