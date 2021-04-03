import { UserService } from './../services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { CalendrierService } from './../services/calendrier.services';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewEncapsulation, Inject } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView, CalendarDateFormatter, DAYS_OF_WEEK, } from 'angular-calendar';
import { Subject, Observable, Subscription } from 'rxjs';
import { colors } from './demo-utils/colors';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { addDays, format } from 'date-fns';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { PopUpCalendarComponent } from './pop-up-calendar/pop-up-calendar.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { differenceInMinutes, startOfDay, startOfHour } from 'date-fns';
import { ReadVarExpr } from '@angular/compiler';
import { map, switchMap, tap } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';


export interface DialogData {
	userUid: string,
	uid: string,
	adresse: string,
	ville: string,
	codePostal: number,
	nomClient: string,
	type: string,
	event: CalendarEvent
}

type CalendarPeriod = 'day' | 'week' | 'month';


@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./calendar.component.scss'],
	encapsulation: ViewEncapsulation.None,
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
export class CalendarComponent implements OnInit {
	@ViewChild('scrollContainer') scrollContainer: ElementRef<HTMLElement>;
	//traduction
	locale: string = 'fr';
	weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
	weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
	CalendarView = CalendarView;



	// view: CalendarView = CalendarView.Month;
	// viewDate: Date = new Date();

	view: CalendarView | CalendarPeriod = CalendarView.Week;
	viewDate: Date = new Date();

	//Clicable
	clickedDate: Date;
	clickedColumn: number;

	events: CalendarEvent[] = [];
	events$: Observable<any[]>;
	contactEvent: any;


	// refresh: Subject<any> = new Subject();
	dateForm: any;
	freelancer: Observable<any>;


	excludeDays: number[] = [];
	//user
	user$: Observable<User>;
	user: any;
	jourDebut: any;
	jourFin: any;
	heureDebut: any;
	heureFin: any;
	rdv: any[] = [];
	subscription: Subscription

	//responsive
	private destroy$ = new Subject();
	daysInWeek = 7;

	private readonly darkThemeClass = 'dark-theme';

	constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder, public dialog: MatDialog, private cdr: ChangeDetectorRef,
		private afs: AngularFirestore, public auth: AngularFireAuth, private calendrierService: CalendrierService, private cd: ChangeDetectorRef, private userService: UserService,
		@Inject(DOCUMENT) private document) {

		this.auth.onAuthStateChanged(user => {
			this.user = user;
			this.events$ = this.calendrierService.getRdv(user).pipe(
				map(event => {
					return event.map(events => {
						this.contactEvent = events;
						return {
							// title: events.event.title,
							start: events.event.start.toDate(),
							end: events.event.end.toDate(),
							id: events.event.id,
							color: events.event.color,
						}
					}
					)
				})
			)
		})
	}

	ngOnInit(): void {
		this.freelancer = this.userService.getCurrentUSer(this.user);
		this.freelancer.pipe(
			tap(freelancer => {
				freelancer.jourRepos.forEach(jour => {
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
				// this.excludeDays = freelancer.jourRepos)
			})).subscribe();

		//responsive
		const CALENDAR_RESPONSIVE = {
			small: {
				breakpoint: '(max-width: 576px)',
				daysInWeek: 5,
			},
			medium: {
				breakpoint: '(max-width: 768px)',
				daysInWeek: 3,
			},
			large: {
				breakpoint: '(max-width: 960px)',
				daysInWeek: 5,
			},
		};

		this.breakpointObserver
			.observe(
				Object.values(CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe((state: BreakpointState) => {
				const foundBreakpoint = Object.values(CALENDAR_RESPONSIVE).find(
					({ breakpoint }) => !!state.breakpoints[breakpoint]
				);
				if (foundBreakpoint) {
					this.daysInWeek = foundBreakpoint.daysInWeek;
				} else {
					this.daysInWeek = 7;
				}
				this.cd.markForCheck();
			});
		this.document.body.classList.add(this.darkThemeClass);
		this.initForm();
	}


	changeDay(date: Date) {
		this.viewDate = date;
		this.view = CalendarView.Week;
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

	initForm() {

		this.dateForm = this.formBuilder.group({
			jourDebut: [''],
			jourFin: [''],
			heureDebut: [''],
			heureFin: [''],
		})
	}

	deleteRdv(event) {
		this.calendrierService.deleteRdv(this.user, event);
	}

	eventClicked({ event }: { event: CalendarEvent }): void {
		this.openEdit(event, this.contactEvent);
	}


	sendMofication() {
		const formValue = this.dateForm.value;
		//Decomposition heures
		var heureDebut = formValue['heureDebut'].split(':');
		var heureFin = formValue['heureFin'].split(':');
		//Decomposition date
		var dateFin = moment(formValue['jourFin'], 'ddd MMM D YYYY HH:mm:ss ZZ');
		var dateDebut = moment(formValue['jourDebut'], 'ddd MMM D YYYY HH:mm:ss ZZ');
		//Redéfinition date
		dateFin = dateFin.set({ h: heureFin[0], m: heureFin[1] });
		dateDebut = dateDebut.set({ h: heureDebut[0], m: heureDebut[1] });
		moment().format
		//Création évènement
		const id = this.afs.createId();
		const newDate: CalendarEvent = {
			id: id,
			title: 'indisponible',
			color: colors.red,
			start: dateDebut.toDate(),
			end: dateFin.toDate(),
		}
		let contact;
		const userEvent = {
			// contact: contact = {
			userUid: this.user.uid,
			uid: id,
			adresse: '',
			ville: '',
			codePostal: '',
			nomClient: '',
			type: 'Indisponible',
			// },
			event: newDate
		}
		this.calendrierService.createRdv(userEvent);
	}


	data(data: any) {
		throw new Error('Method not implemented.');
	}

	dateCreate(event, hours: CalendarEventTimesChangedEvent) {
		moment.locale('fr');
		var heures = moment(event.date).format('LT');
		this.jourDebut = event.date;
		this.jourFin = moment(event.date).add(30, 'm').toDate();
		var fin = moment(this.jourFin).format('LT');
		this.heureDebut = heures;
		this.heureFin = fin;
		const nvForm = {
			jourDebut: this.jourDebut,
			jourFin: this.jourFin,
			heureDebut: this.heureDebut,
			heureFin: this.heureFin
		}
		this.dateForm.patchValue(nvForm);
	}

	openEdit(event, contact) {
		const dialogRef = this.dialog.open(PopUpCalendarComponent, {
			width: '700px',
			// height: '600px',
			data: {
				userUid: this.user.uid,
				uid: event.id,
				adresse: contact.adresse,
				ville: contact.ville,
				codePostal: contact.codePostal,
				nomClient: contact.nomClient,
				type: contact.type,
				event: event
			}
		});

		dialogRef.afterClosed().subscribe(result => {

		});

	}

}
