import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormulaireService } from '../services/formulaire.service';


interface FreelanceType {
	value: string;
	viewValue: string;
}
interface Locations {
	value: string;
	viewValue: string;
}


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	selectedValue: string;
	searchForm: FormGroup;
	types: FreelanceType[] = [
		{ value: 'coiffure', viewValue: 'coiffure' },
		{ value: 'plombier', viewValue: 'plombier' },
		{ value: 'IT', viewValue: 'IT' },
		{ value: 'All', viewValue: 'tous les freelancers' }
	];

	locations: Locations[] = [
		{ value: 'Yvelines', viewValue: 'Yvelines' },
		{ value: 'Loire-Atlantique', viewValue: 'Loire-Atlantique' },
		{ value: 'All', viewValue: 'toute la France' },
	];

	resultList: Observable<any[]>;
	results: any[];
	resultSubscription: Subscription;

	constructor(private formBuilder: FormBuilder, private formulaireService: FormulaireService, private router : Router) { }

	ngOnInit(): void {
		this.initForm();
	}


	initForm() {
		this.searchForm = this.formBuilder.group({
			freelanceType: [''],
			location: ['']
		})
	}

	searchResult() {
		const formValue = this.searchForm.value;
		const formSearch = {
			type: formValue['freelanceType'],
			location: formValue['location'],
		}
		console.log(formSearch);
		// this.formulaireService.onSubmitForm(formSearch);
		this.router.navigate(['freelanceList'], {state: {data : formSearch}});
		this.resultList = this.formulaireService.freelancerList;
	 }


}
