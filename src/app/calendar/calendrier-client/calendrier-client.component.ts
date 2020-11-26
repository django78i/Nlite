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

export interface DialogData {
	freeUid : any,
	event: any
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
export class CalendrierClientComponent implements OnInit, AfterViewInit, OnDestroy {

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

	@Input() freelancer : User; 
	@Input() freeUid : any; 


	constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private cdr: ChangeDetectorRef,
		private afs: AngularFirestore, public auth: AngularFireAuth, private calendrierService: CalendrierService) { 
			
		}
		
		ngOnInit(): void {
			console.log(this.freelancer);
			this.subscription = this.calendrierService.getRdv(this.freelancer).subscribe((rdv) => {
				console.log(rdv);
				this.rdv = rdv;
				this.events = [];
				console.log(this.events);
				this.rdv.forEach((rdv) => {
					var newDate: CalendarEvent = {
						...rdv.event,
						start: rdv.event.start.toDate(),
						end: rdv.event.end.toDate(),
					}
					console.log(newDate);
					this.events.push(newDate);
				})
			});
	}

	viewChanged() {
		this.cdr.detectChanges();
		this.scrollToCurrentView();
	}



	ngAfterViewInit() {
		this.scrollToCurrentView();
	}


	ngOnDestroy() {
		this.subscription.unsubscribe();
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
		console.log('clicker');
		const dialogRef = this.dialog.open(PopUpCalenderClientComponent, {
			width: '700px',
			// height: '600px',
			data: {
				freeUid: this.freeUid,
				event: event
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});

	}


}
