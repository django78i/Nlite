import { UserService } from './../../../services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { stringify } from '@angular/compiler/src/util';

interface Unite {
	value: string;
	viewValue: string;
}
interface Mode {
	value: string;
	viewValue: string;
}

@Component({
	selector: 'app-edit-rdv',
	templateUrl: './edit-rdv.component.html',
	styleUrls: ['./edit-rdv.component.scss']
})

export class EditRdvComponent implements OnInit {

	@Input() freelancer: any;
	dateForm: FormGroup;
	unite: Unite[] = [
		{ value: 'm', viewValue: 'minutes' },
		{ value: 'h', viewValue: 'heures' },
	];
	mode: Mode[] = [
		{ value: 'domicile uniquement', viewValue: 'domicile uniquement' },
		{ value: 'sur devis', viewValue: 'sur devis' },
	];

	jourFerie: string[] = ['lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];


	constructor(private formBuilder: FormBuilder, private userService: UserService) { }

	ngOnInit(): void {
		this.initForm();
	}

	initForm() {
		this.dateForm = this.formBuilder.group({
			jourFerie: '',
			valDelai: '',
			uniteDelai: '',
			validationAuto: '',
			mode: ''
		})
		this.initValue();
	}

	initValue() {
		this.dateForm.patchValue({
			valDelai: this.freelancer.delai ? this.freelancer.delai.valeur : [],
			uniteDelai: this.freelancer.delai ? this.freelancer.delai.unite : [],
			jourFerie: this.freelancer.jourRepos,
			validationAuto: this.freelancer.validationAuto ? this.freelancer.validationAuto : false,
			mode: this.freelancer.modeRdv
		});
	}

	sendMofication() {
		const formVal = this.dateForm.value;
		const free = {
			...this.freelancer,
			delai: {
				valeur: formVal.valDelai,
				unite: formVal.uniteDelai
			},
			jourRepos: formVal.jourFerie,
			validationAuto: formVal.validationAuto,
			modeRdv: formVal.mode
		}
		this.userService.upDateUser(free);
	}



}
