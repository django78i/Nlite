import { CalendrierService } from './../../services/calendrier.services';
import { CalendarEvent } from 'angular-calendar';
import { CalendarComponent, DialogData } from './../calendar.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';
import { colors } from '../demo-utils/colors';

interface Type {
	value: string;
	viewValue: string;
}

@Component({
	selector: 'app-pop-up-calendar',
	templateUrl: './pop-up-calendar.component.html',
	styleUrls: ['./pop-up-calendar.component.scss']
})
export class PopUpCalendarComponent implements OnInit {
	dateForm: FormGroup;
	types: Type[] = [
		{ value: 'attente', viewValue: 'Attente' },
		{ value: 'valide', viewValue: 'Validé' },
		{ value: 'indisponible', viewValue: 'Indisponible' }
	];


	jourDebut: any;
	jourFin: any;
	heureDebut: any;
	heureFin: any;

	constructor(public dialogRef: MatDialogRef<CalendarComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogData, private formBuilder: FormBuilder,
		private calendrierService: CalendrierService, private afs: AngularFirestore,
	) { }

	ngOnInit(): void {
		console.log(this.data);
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
			type: [''],
		})
		this.initValue();

	}

	initValue() {
		const newValue = {
			jourDebut: this.data.event.start,
			jourFin: this.data.event.end,
			heureDebut: moment(this.data.event.start).format('LT'),
			heureFin: moment(this.data.event.end).format('LT'),
			adresse: this.data.adresse,
			ville: this.data.ville,
			codePostal: this.data.codePostal,
			nomClient: this.data.nomClient,
			type: this.data.type
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
		const newDate: CalendarEvent = {
			id: this.data.event.id,
			title: formValue['nomClient'],
			color: colors.red,
			start: dateDebut.toDate(),
			end: dateFin.toDate(),
		}
		console.log(formValue['type']);
		switch (formValue['type']) {
			case 'valide':
				newDate.color = colors.blue
				break;
			case 'indisponible':
				newDate.color = colors.red
				break;
			case 'attente':
				newDate.color = colors.yellow
				break;

			default:
				break;
		}
		let contact;
		const userEvent = {
			contact: contact = {
				userUid: this.data.userUid,
				uid: this.data.uid,
				adresse: formValue['adresse'],
				ville: formValue['ville'],
				codePostal: formValue['codePostal'],
				nomClient: formValue['nomClient'],
				type: formValue['type']
			},
			event: newDate
		}
		this.calendrierService.editRdv(userEvent);
		this.dialogRef.close();
	}

	onNoClick(): void {
		this.dialogRef.close();
	}


}
