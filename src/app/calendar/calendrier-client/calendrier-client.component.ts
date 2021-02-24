import { Calendrier } from './../../models/calendar.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { CalendrierService } from '../../services/calendrier.services';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, FormGroupName, FormControl } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView, CalendarDateFormatter, DAYS_OF_WEEK, CalendarMonthViewDay } from 'angular-calendar';
import { Subject, Observable, Subscription, BehaviorSubject } from 'rxjs';
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
import { find, tap, filter, switchMap, share, catchError } from 'rxjs/operators';
import {
	subMonths,
	addMonths,
	addWeeks,
	subDays,
	subWeeks,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	endOfDay,
} from 'date-fns';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PopUpConnectComponent } from 'src/app/users/freelancers/pop-up-connect/pop-up-connect.component';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { throwError } from 'rxjs/internal/observable/throwError';
import { of } from 'rxjs/internal/observable/of';

interface SousService {
	value: string;
	viewValue: string;
	unite: string,
	duree: string

}

interface ServiceGroup {
	disabled?: boolean;
	name: string;
	sousService: SousService[];
}

interface Services {
	value: string;
	viewValue: string;

}


export interface DialogData {
	freeUid: any,
	event: any,
	creneau: any,
	validationAuto: any,
	freeName: any,
	adresse: any
}
type CalendarPeriod = 'day' | 'week' | 'month';


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



	view: CalendarView | CalendarPeriod = CalendarView.Week;
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
	@Input() freelancer: User;
	@Input() freeUid: any;


	minDate: Date = subMonths(new Date(), 1);

	maxDate: Date = addMonths(new Date(), 1);

	prevBtnDisabled: boolean = false;

	nextBtnDisabled: boolean = false;

	servicesGroup: ServiceGroup[] = [];
	servicesControl = new FormControl();

	services: Services[] = [];
	sousServices: SousService[] = [];
	selectedValue: any;
	selectedsousSect: any;

	creneau: any;
	prestaChoisi: any;
	log: boolean = false;
	stop: boolean = true;

	valu: any;
	prestObs: Observable<any>;
	prestSub: Subject<any>;

	constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private cdr: ChangeDetectorRef,
		private afs: AngularFirestore, public auth: AngularFireAuth, private calendrierService: CalendrierService,
		private _snackBar: MatSnackBar, private userService: UserService) {
		this.auth.onAuthStateChanged(user => {
			if (user) {
				this.log = true;
			}
		})

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
			}), share()
		)

		this.initControl();

	}

	initControl() {
		this.freelancer.prestation.forEach((presta: any) => {
			let val = {
				value: presta.titre,
				viewValue: presta.titre
			}
			this.services.push(val)
		})

	}

	prest(value) {
		console.log('ici : ' + value);
		this.valu = this.sousServices.find(pre => pre.value == value);
	}

	callType(value) {
		this.stop = false;
		// this.selectedsousSect = '';
		this.sousServices = [];
		let prest: any;
		prest = this.freelancer.prestation.find((presta: any) => presta.titre == value);
		this.prestaChoisi = prest;
		console.log(prest);
		prest.sousSection.forEach(p => {
			let val = {
				value: p.nom,
				viewValue: p.nom,
				unite: p.unite,
				duree: p.valeur
			}
			this.sousServices.push(val);
		})
	}

	viewChanged() {
		this.cdr.detectChanges();
		// this.scrollToCurrentView();
	}



	ngAfterViewInit() {
		// if (this.events$) {
		// 	this.scrollToCurrentView();
		// }
	}



	// private scrollToCurrentView() {
	// 	if (this.view === CalendarView.Week || CalendarView.Day) {
	// 		// each hour is 60px high, so to get the pixels to scroll it's just the amount of minutes since midnight
	// 		const minutesSinceStartOfDay = differenceInMinutes(
	// 			startOfHour(new Date()),
	// 			startOfDay(new Date())
	// 		);
	// 		const headerHeight = this.view === CalendarView.Week ? 60 : 0;
	// 		this.scrollContainer.nativeElement.scrollTop =
	// 			minutesSinceStartOfDay + headerHeight;
	// 	}
	// }

	setView(view: CalendarView) {
		this.view = view;
	}



	data(data: any) {
		throw new Error('Method not implemented.');
	}

	opensnack(message) {
		this._snackBar.open(message, '', {
			duration: 2000,
			horizontalPosition: 'right',
			verticalPosition: 'top'
		});
	}


	openEdit(event, contact) {
		let val;
		let message = '';
		var boul: boolean = false;
		let cren;
		//aucune prestation choisis
		if (!this.selectedValue || !this.selectedsousSect) {
			message = 'Veuillez choisir une prestation'
			this.opensnack(message);
			boul = true;
		} else {
			//User Connecté
			if (!this.log) {
				boul = true;
				this.openDialog();
			}
			val = this.prestaChoisi.sousSection.find(sous => sous.nom == this.selectedsousSect);
			cren = {
				valeur: val.valeur,
				unite: val.unite
			}
			this.creneau = cren;
			const heure = new Date();
			const delai = this.freelancer.delai.unite == 'm' ? moment(event.date).subtract(this.freelancer.delai.valeur, 'm').toDate() : moment(event.date).subtract(this.freelancer.delai.valeur, 'h').toDate();
			const crenau = val.unite == 'm' ? moment(event.date).add(val.valeur, 'm').toDate() : moment(event.date).add(val.valeur, 'h').toDate();
			//date inférieure à la date du jour
			if (moment(delai).isBefore(heure)) {
				message = 'Trop tard !! Veuillez choisir une autre date'
				this.opensnack(message);
				boul = true;
			}
			this.range.forEach(rdv => {
				//Créneau déborde sur le prochain rdv
				if (moment(crenau).isAfter((rdv.event.start).toDate()) && moment(crenau).isBefore((rdv.event.end).toDate())) {
					message = 'Désolé ce créneau est en conflit avec un autre rendez-vous'
					this.opensnack(message);
					boul = true;
				}
			});
		}
		console.log(boul);
		if (boul == false) {
			const dialogRef = this.dialog.open(PopUpCalenderClientComponent, {
				width: '100%',
				height: '650px',
				maxWidth: '100%',
				data: {
					freeUid: this.freeUid,
					freeName: this.freelancer.displayName,
					event: event,
					creneau: cren,
					validationAuto: this.freelancer.validationAuto,
					adresse: this.freelancer.adresse
				}
			});
		}
		console.log('clicker');

	}

	openDialog(): void {
		const dialogRef = this.dialog.open(PopUpConnectComponent, {
			maxWidth: '90%',
			width: '90%',
			height: '200px',
			panelClass: 'custom',
		});
	}


}
