import { UserService } from './../../../services/user.service';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';


interface Unite {
	value: string;
	viewValue: string;
}


@Component({
	selector: 'app-tarifs',
	templateUrl: './tarifs.component.html',
	styleUrls: ['./tarifs.component.scss']
})
export class TarifsComponent implements OnInit {

	@Input() user: any;
	servicesForm: FormGroup;

	unite: Unite[] = [
		{ value: 'm', viewValue: 'minutes' },
		{ value: 'h', viewValue: 'heures' },
	];


	constructor(private formBuilder: FormBuilder, private userService: UserService) { }

	ngOnInit(): void {
		this.initForm();
	}

	initForm() {
		this.servicesForm = this.formBuilder.group({
			services: this.formBuilder.array([])
		})
		if (this.user.prestation) {
			this.servicesForm.patchValue(this.user.prestation);
			this.servicesForm.setControl('services', this.setServices(this.user.prestation));
		}
	}

	setServices(services) {
		let formArray = new FormArray([]);
		services.forEach((r) => {
			console.log(r);
			formArray.push(this.formBuilder.group({
				titre: r.titre,
				sousSection: this.setSousServices(r.sousSection)
			}));
		});
		return formArray;

	}

	setSousServices(sousServ) {
		let formArray = new FormArray([]);
		sousServ.forEach((s) => {
			console.log(s);
			formArray.push(this.formBuilder.group({
				unite :s.unite, 
				valeur : s.valeur,
				prix: s.prix,
				nom: s.nom
			}));
		});
		return formArray;
	}

	getServices() {
		return this.servicesForm.get('services') as FormArray;
	}


	getSousSection(control) {
		return control.get('sousSection') as FormArray;
	}

	onAddServices() {
		const newrowControl = this.formBuilder.group({
			titre: '',
			sousSection: this.formBuilder.array([])
		});
		this.getServices().push(newrowControl);
	}

	onAddSousSection(controls) {
		var control = controls.get('sousSection') as FormArray;
		const newrowControl = this.formBuilder.group({
			nom: '',
			prix: '',
			valeur :'',
			unite : ''
		});
		console.log(control);
		this.getSousSection(controls).push(newrowControl);
	}

	onDeleteSousSection(control, j) {
		this.getSousSection(control).removeAt(j);
	}

	onDeleteServices(i) {
		this.getServices().removeAt(i);
	}

	onSubmitForm() {
		const formVal = this.servicesForm.value;
		const newUser = {
			...this.user,
			prestation: formVal.services
		};
		console.log(newUser);
		this.userService.upDateUser(newUser);
	}


}
