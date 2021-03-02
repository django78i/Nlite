import { CalendrierService } from 'src/app/services/calendrier.services';
import { User } from 'src/app/models/user.model';
import { Component, Input, OnInit } from '@angular/core';

interface SousService {
	value: string;
	viewValue: string;
}

interface Services {
	value: string;
	viewValue: string;

}



@Component({
	selector: 'app-devis',
	templateUrl: './devis.component.html',
	styleUrls: ['./devis.component.scss']
})
export class DevisComponent implements OnInit {

	stop: boolean = true;
	selectedsousSect: any;
	commentaire: any;
	sousServices: SousService[] = [];
	@Input() freelancer: User;
	@Input() user: any;
	prestaChoisi: any;
	services: Services[] = [];
	selectedValue: any;
	disable: boolean = true;


	constructor(public calendrierService: CalendrierService) { }

	ngOnInit(): void {
		this.initControl()
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



	callType(value) {
		this.stop = false;
		this.selectedsousSect = '';
		this.sousServices = [];
		let prest: any;
		prest = this.freelancer.prestation.find((presta: any) => presta.titre == value);
		this.prestaChoisi = prest;
		prest.sousSection.forEach(p => {
			let val = {
				value: p.nom,
				viewValue: p.nom
			}
			this.sousServices.push(val);
		})
	}

	validDevis() {
		this.disable = false;
	}

	send() {
		const devis = {
			service: this.selectedValue,
			sousSect: this.selectedsousSect,
			commentaire: this.commentaire,
			userUid: this.user.uid,
			userName: this.user.displayName,
			userMail: this.user.email,
			freeUid: this.freelancer.uid,
			freeName: this.freelancer.displayName,
			freeMail: this.freelancer.email
		}
		console.log(devis);
		this.selectedValue = '';
		this.selectedsousSect = '';
		this.commentaire = '';
		this.calendrierService.createdevis(devis);
	}


}
