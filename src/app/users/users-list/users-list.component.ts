import { of } from 'rxjs/internal/observable/of';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormulaireService } from './../../services/formulaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserService } from './../../services/user.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { from } from 'rxjs/internal/observable/from';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { Address } from 'ngx-google-places-autocomplete/objects/address';


interface Lieu {
	value: string;
	viewValue: string;
}
interface Type {
	value: string;
	viewValue: string;
}


@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

	addresss: any[];
	formattedaddress = " ";

	public AddressChange(address: any) {

		this.addresss = address;
		//setting address from API to local variable 
		this.formattedaddress = address.formatted_address
	}
	public handleAddressChange(address: Address) {
		this.addresss = address.address_components;
		this.formattedaddress = address.formatted_address

	}
	options = {
		componentRestrictions: {
			country: ["FR"]
		}
	}



	curentUser: Observable<User>;
	freelancerList: Observable<User[]>;
	searchForm: FormGroup;
	prixFiltre: Observable<any>;
	prix: number;
	types: Type[] = [
		{ value: 'coiffure', viewValue: 'coiffeur' },
		{ value: 'plombier', viewValue: 'plombier' },
		{ value: 'All', viewValue: 'Tous les freelancers' },
	];

	//skills filter
	// visible = true;
	// selectable = true;
	// removable = true;
	// separatorKeysCodes: number[] = [ENTER, COMMA];
	// fruitCtrl = new FormControl();
	// filteredFruits: Observable<string[]>;
	req: any;
	// fruits: string[] = ['toutes'];
	// allFruits: string[] = ['toutes', 'dreads', 'afro', 'degradé', 'femme', 'beauté'];
	// @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
	// @ViewChild('auto') matAutocomplete: MatAutocomplete;

	constructor(private route: ActivatedRoute, private formulaireService: FormulaireService, private formBuilder: FormBuilder, private userService: UserService, private auth: AngularFireAuth, private router: Router, private forulaireService: FormulaireService) { }

	ngOnInit(): void {
		this.auth.onAuthStateChanged((user) => {
			if (user) {
				this.curentUser = this.userService.getCurrentUSer(user)
			}
		})
		this.req = history.state.data ? history.state.data : { location: 'All', type: 'All', allFreelancer: true };
		console.log(this.req);
		this.formulaireService.filterSubject.next(this.req);
		this.freelancerList = this.formulaireService.freelancerList;
		this.initForm();
	}

	initForm() {
		this.searchForm = this.formBuilder.group({
			location: '',
			prix: [''],
			type: ''
		});
		console.log(this.req);
		this.req.location = this.req.location == 'All' ? 'Toute la France' : this.req.location;
		this.req ? this.searchForm.patchValue(this.req) : '';
	}

	appear() {
		const value = this.searchForm.value;
		let val = this.addresss.find(ad => ad.types.find(v => v === 'administrative_area_level_2' ? true : ''));
		const newForm = {
			req: {
				location: val.short_name,
				prix: value['prix'],
				type: value['type']
			}
		}
		console.log(newForm);
		this.formulaireService.filterSubject.next(newForm);
	}


	profileNavigate(contactUid) {
		this.router.navigate(['freelanceClientProfil', contactUid.uid])
	}

}
