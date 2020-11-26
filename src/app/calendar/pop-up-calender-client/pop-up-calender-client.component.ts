import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './../../services/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { CalendrierService } from 'src/app/services/calendrier.services';
import { CalendarComponent } from '../calendar.component';
import { DialogData } from '../calendrier-client/calendrier-client.component';
import { colors } from '../demo-utils/colors';
import { CalendarEvent } from 'angular-calendar';


@Component({
	selector: 'app-pop-up-calender-client',
	templateUrl: './pop-up-calender-client.component.html',
	styleUrls: ['./pop-up-calender-client.component.scss']
})
export class PopUpCalenderClientComponent implements OnInit {
	dateForm: FormGroup;
	user : any;

	constructor(public dialogRef: MatDialogRef<CalendarComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder,
		private calendrierService: CalendrierService, private afs: AngularFirestore, private userService : UserService) { }

	ngOnInit(): void {
		this.userService.user.subscribe((user)=>{
			this.user = user;
		})
		console.log(this.data.event);
		this.initForm();
	}

	initForm() {
		this.dateForm = this.formBuilder.group({
			jourDebut: [''],
			jourFin: [''],
			heureDebut: [''],
			heureFin: [''],
			adresse: [''],
			ville: [''],
			codePostal: [''],
			nomClient: [''],
			prenomClient: [''],
		})
		this.initValue();
	}

	initValue() {
		console.log(this.data.event);
		var jourFin = moment(this.data.event.date).add(30, 'm').toDate();
		var heureFin = moment(jourFin).format('LT');
		const newValue = {
			jourDebut: this.data.event.date,
			jourFin: jourFin,
			heureDebut: moment(this.data.event.date).format('LT'),
			heureFin: heureFin,
			adresse: '',
			ville: '',
			codePostal: '',
			nomClient: '',
			prenomClient: '',
		}
		this.dateForm.patchValue(newValue);
	}


	sendMofication() {
		const formValue = this.dateForm.value;
		console.log(formValue);
		//Decomposition heures
		var heureDebut = formValue['heureDebut'].split(':');
		var heureFin = formValue['heureFin'].split(':');
		//Decomposition date
		var dateFin = moment(formValue['jourFin'], 'ddd MMM D YYYY HH:mm:ss ZZ');
		var dateDebut = moment(formValue['jourDebut'], 'ddd MMM D YYYY HH:mm:ss ZZ');
		//Redéfinition date
		dateFin = dateFin.set({ h: heureFin[0], m: heureFin[1] });
		dateDebut = dateDebut.set({ h: heureDebut[0], m: heureDebut[1] });
		//Couleur Rdv
		moment().format
		//Création évènement
		const id = this.afs.createId();
		const newDate: CalendarEvent = {
			id: id,
			title: formValue['nomClient'],
			color: colors.yellow,
			start: dateDebut.toDate(),
			end: dateFin.toDate(),
		}
		console.log(formValue['type']);
		let contact;
		const userEvent = {
			contact: contact = {
				userUid: this.user.uid,
				freeUid : this.data.freeUid,
				uid: id,
				adresse: formValue['adresse'],
				ville: formValue['ville'],
				codePostal: formValue['codePostal'],
				nomClient: formValue['nomClient'],
				prenomClient: formValue['prenomClient'],
				type: 'attente'
			},
			event: newDate
		}
		console.log(userEvent);
		this.calendrierService.createRdvClient(userEvent);
		// this.calendrierService.editRdv(userEvent);
		// this.dialogRef.close();
	}

	onNoClick(): void {
		this.dialogRef.close();
	}



}
