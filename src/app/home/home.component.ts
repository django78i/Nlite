import { UserService } from './../services/user.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, NgZone, ViewChild, Input } from '@angular/core';
import { FormulaireService } from '../services/formulaire.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import * as _ from 'lodash';


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

	@ViewChild("placesRef") placesRef: GooglePlaceDirective;
	@ViewChild('addresstext') addresstext: any;


	selectedValue: string;
	searchForm: FormGroup;
	types: FreelanceType[] = [
		{ value: 'coiffure', viewValue: 'coiffure' },
		{ value: 'plombier', viewValue: 'plombier' },
		{ value: 'IT', viewValue: 'IT' },
		{ value: 'All', viewValue: 'tous les freelancers' }
	];

	resultList: Observable<any[]>;
	results: any[];
	resultSubscription: Subscription;
	addresss: any[];

	formattedaddress = " ";
	options = {
		componentRestrictions: {
			country: ["FR"]
		}
	}
	public AddressChange(address: any) {

		this.addresss = address;
		//setting address from API to local variable 
		this.formattedaddress = address.formatted_address
	}
	public handleAddressChange(address: Address) {
		this.addresss = address.address_components;
		this.formattedaddress = address.formatted_address

	}

	users: Observable<any>;
	checked: boolean = false;
	disableInput: boolean = false;
	disableSelect: boolean = false;

	constructor(private formBuilder: FormBuilder, public userService: UserService, private router: Router, public zone: NgZone) { }

	ngOnInit(): void {
		this.initForm();
		this.users = this.userService.user;
	}


	initForm() {
		this.searchForm = this.formBuilder.group({
			freelanceType: '',
			location: '',
			checked: false
		})
	}

	searchResult() {
		let val = this.addresss ? this.addresss.find(ad => ad.types.find(v => v === 'administrative_area_level_2' ? true : '')) : '';
		const form = this.searchForm.value;
		const req = {
			type: form.freelanceType ? form.freelanceType : '',
			location: val ? val.short_name : '',
			allFreelancer: form.checked
		}
		console.log(req);
		this.router.navigate(['/freelanceList'], {
			state: {
				data: {
					type: form.checked == true ? 'All' : form.freelanceType,
					location: form.checked == true ? 'All' : val.short_name,
					allFreelancer: form.checked
				}
			}
		});
	}

	callType(value) {
		console.log(value);
		if (value == true) {
			this.disableSelect = true;
			this.disableInput = true;
		}
	}

}
