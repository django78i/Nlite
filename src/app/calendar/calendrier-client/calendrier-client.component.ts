import { Calendrier } from './../../models/calendar.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { CalendrierService } from '../../services/calendrier.services';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView, CalendarDateFormatter, DAYS_OF_WEEK, } from 'angular-calendar';
import { Subject, Observable, Subscription } from 'rxjs';
import { colors } from '../demo-utils/colors';
import { CustomDateFormatter } from '../custom-date-formatter.provider';
import { addDays, format } from 'date-fns';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../../models/user.model';
import { differenceInMinutes, startOfDay, startOfHour } from 'date-fns';
import { PopUpCalenderClientComponent } from '../pop-up-calender-client/pop-up-calender-client.component';
import { map } from 'rxjs/internal/operators/map';
import * as _ from 'lodash';
import { find, tap, filter, switchMap } from 'rxjs/operators';



export interface DialogData {
	freeUid: any,
	event: any,
	creneau: any,
	validationAuto: any,
}

@Component({
	selector: 'app-calendrier-client',
	templateUrl: './calendrier-client.component.html',
	styleUrls: ['./calendrier-client.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: CalendarDateFormatter,
			useClass: CustomDateFormatter,
		},
	],
	styles: [
		`
		  .scroll-container {
			height: calc(100vh - 320px);
			overflow-y: auto;
		  }
		`,
	],
})
export class CalendrierClientComponent implements OnInit, AfterViewInit {

	@ViewChild('scrollContainer') scrollContainer: ElementRef<HTMLElement>;
	//traduction
	locale: string = 'fr';
	weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
	weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
	CalendarView = CalendarView;



	view: CalendarView = CalendarView.Week;
	viewDate: Date = new Date();

	//Clicable
	clickedDate: Date;
	clickedColumn: number;

	events: CalendarEvent[] = [];
	events$: Observable<any[]>;

	contactEvent: any;

	excludeDays: number[] = [];

	refresh: Subject<any> = new Subject();
	dateForm: any;


	eventTimesChanged({
		event,
		newStart,
		newEnd,
	}: CalendarEventTimesChangedEvent): void {
		event.start = newStart;
		event.end = newEnd;
		this.refresh.next();
		console.log(this.events);
	}

	//user
	user$: Observable<User>;
	user: any;
	jourDebut: any;
	jourFin: any;
	heureDebut: any;
	heureFin: any;
	rdv: any[] = [];
	subscription: Subscription

	range: any;
	eventSort: Observable<any[]>;

	@Input() freelancer: User;
	@Input() freeUid: any;


	constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private cdr: ChangeDetectorRef,
		private afs: AngularFirestore, public auth: AngularFireAuth, private calendrierService: CalendrierService) {

	}

	ngOnInit(): void {
		console.log(this.freelancer);
		this.freelancer.jourRepos.forEach(jour => {
			switch (jour) {
				case 'Lundi':
					this.excludeDays.push(1)
					break;
				case 'Mardi':
					this.excludeDays.push(2)
					break;
				case 'Mercredi':
					this.excludeDays.push(3)
					break;
				case 'Jeudi':
					this.excludeDays.push(4)
					break;
				case 'Vendredi':
					this.excludeDays.push(5)
					break;
				case 'Samedi':
					this.excludeDays.push(6)
					break;
				case 'Dimanche':
					this.excludeDays.push(0)
					break;
			}
		})

		this.events$ = this.calendrierService.getRdv(this.freelancer).pipe(
			map(event => {
				console.log(event);
				this.range = _.sortBy(event, 'event.start');
				console.log(this.range);
				return event.map(event => {
					return {
						start: event.event.start.toDate(),
						end: event.event.end.toDate(),
						id: event.event.id,
						color: event.event.color
					}
				})
			})
		)
		const nvelDate = new Date();
		this.eventSort = this.events$.pipe(
			map(even => even.filter(ev => moment(ev.start).isAfter(nvelDate))),
			map(event => _.sortBy(event, 'start')),
			tap(ev => console.log(ev))
		)
	}

	viewChanged() {
		this.cdr.detectChanges();
		this.scrollToCurrentView();
	}



	ngAfterViewInit() {
		if (this.events$) {
			this.scrollToCurrentView();
		}
	}



	private scrollToCurrentView() {
		if (this.view === CalendarView.Week || CalendarView.Day) {
			// each hour is 60px high, so to get the pixels to scroll it's just the amount of minutes since midnight
			const minutesSinceStartOfDay = differenceInMinutes(
				startOfHour(new Date()),
				startOfDay(new Date())
			);
			const headerHeight = this.view === CalendarView.Week ? 60 : 0;
			this.scrollContainer.nativeElement.scrollTop =
				minutesSinceStartOfDay + headerHeight;
		}
	}

	setView(view: CalendarView) {
		this.view = view;
	}



	data(data: any) {
		throw new Error('Method not implemented.');
	}


	openEdit(event, contact) {
		const heure = new Date;
		const delai = this.freelancer.delai.unite == 'minute' ? moment(event.date).subtract(this.freelancer.delai.valeur, 'm').toDate() : moment(event.date).subtract(this.freelancer.delai.valeur, 'h').toDate();
		const crenau = this.freelancer.creneau.unite == 'minute' ? moment(event.date).add(this.freelancer.creneau.valeur, 'm').toDate() : moment(event.date).add(this.freelancer.creneau.valeur, 'h').toDate();
		var boul: boolean = false;
		if (moment(delai).isBefore(heure)) {
			console.log('trop tard', delai);
			boul = true;
		}
		const ranger = this.eventSort.pipe(
			map(eventz => eventz.filter(ev => moment(ev.start).isAfter(event.date))),
			map(rdv => rdv.find(evdv => moment(evdv.start).isBefore(crenau))),
			tap(ev => {
				boul = ev != undefined ? true : false;
				console.log(boul);
			})
		);
		ranger.subscribe(rdv => {
			if (boul == false) {
				const dialogRef = this.dialog.open(PopUpCalenderClientComponent, {
					width: '100%',
					height: '650px',
					maxWidth: '100%',
					data: {
						freeUid: this.freeUid,
						event: event,
						creneau: this.freelancer.creneau,
						validationAuto: this.freelancer.validationAuto
					}
				});

				dialogRef.afterClosed().subscribe(result => {
					console.log('The dialog was closed');
				});
			}
		});
		console.log('clicker');

	}


}
