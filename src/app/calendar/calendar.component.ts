import { AngularFirestore } from '@angular/fire/firestore';
import { CalendrierService } from './../services/calendrier.services';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
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


@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./calendar.component.scss'],
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
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('scrollContainer') scrollContainer: ElementRef<HTMLElement>;
	//traduction
	locale: string = 'fr';
	weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
	weekendDays: number[] = [DAYS_OF_WEEK.FRIDAY, DAYS_OF_WEEK.SATURDAY];
	CalendarView = CalendarView;



	view: CalendarView = CalendarView.Month;
	viewDate: Date = new Date();

	//Clicable
	clickedDate: Date;
	clickedColumn: number;

	events: CalendarEvent[] = [];


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

	constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private cdr: ChangeDetectorRef,
		private afs: AngularFirestore, public auth: AngularFireAuth, private calendrierService: CalendrierService) {

		this.auth.onAuthStateChanged(user => {
			this.user = user;
			this.subscription = this.calendrierService.getRdv(user).subscribe((rdv) => {
				console.log(rdv);
				this.rdv = rdv;
				this.events = [];
				console.log(this.events);
				this.rdv.forEach((rdv) => {
					var newDate: CalendarEvent = {
						...rdv.event,
						start: rdv.event.start.toDate(),
						end: rdv.event.end.toDate(),
						actions: [
							{
								label: '<span class="material-icons">delete</span>',
								onClick: ({ event }: { event: CalendarEvent }): void => {
									// this.events = this.events.filter((iEvent) => iEvent !== event);
									this.deleteRdv(event, );
									console.log('Event deleted', event);
								},
							},
							{
								label: '<span class="material-icons">create</span>',
								onClick: ({ event }: { event: CalendarEvent }): void => {
									this.openEdit(event, rdv.contact);
									console.log('Edit event', event);
								},
							},
						],

					}
					console.log(newDate);
					this.events.push(newDate);
				})
			});
		})
	}

	ngOnInit(): void {
		this.initForm();
	}


	ngAfterViewInit() {
		this.scrollToCurrentView();
	}

	viewChanged() {
		this.cdr.detectChanges();
		this.scrollToCurrentView();
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
		console.log(this.user);
	}

	sendMofication() {
		console.log(this.user);
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
			contact: contact = {
				userUid: this.user.uid,
				uid: id,
				adresse: '',
				ville: '',
				codePostal: '',
				nomClient: '',
				type: 'Indisponible',
			},
			event: newDate
		}
		console.log(userEvent);
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
			console.log('The dialog was closed');
			//   this.animal = result;

			console.log(result)
		});

	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}
