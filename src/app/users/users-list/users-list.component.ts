import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormulaireService } from './../../services/formulaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subscription } from 'rxjs';
import { UserService } from './../../services/user.service';
import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { count, tap } from 'rxjs/operators';


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
	countObser: any;
	req: any;
	titre: any;

	constructor(private route: ActivatedRoute, private formulaireService: FormulaireService, private formBuilder: FormBuilder, private userService: UserService, private auth: AngularFireAuth, private router: Router, private forulaireService: FormulaireService) {
		this.req = history.state.data ? history.state.data : { location: 'All', type: 'All', allFreelancer: true };
		this.titre = {
			lieu: this.req.type == "All" ? "France" : this.req.location,
			type: this.req.type == "All" ? "tous freelancers" : this.req.location
		}
		this.formulaireService.filterSubject.next(this.req);
		this.freelancerList = this.formulaireService.freelancerList
			.pipe(tap(res => this.countObser = res.length));

	}

	ngOnInit(): void {
		this.auth.onAuthStateChanged((user) => {
			if (user) {
				this.curentUser = this.userService.getCurrentUSer(user)
			}
		})
		this.initForm();
	}

	initForm() {
		this.searchForm = this.formBuilder.group({
			location: '',
			prix: [''],
			type: ''
		});
		this.req.location = this.req.location == 'All' ? 'France' : this.req.location;
		this.req ? this.searchForm.patchValue(this.req) : '';
	}

	appear() {
		const value = this.searchForm.value;
		let val = this.addresss.find(ad => ad.types.find(v => v === 'administrative_area_level_2' ? true : ''));
		const newForm = {
			location: val.short_name,
			allFreelancer: false,
			type: value['type']

		}
		this.titre = {
			lieu: newForm.type == "All" ? "France" : newForm.location,
			type: newForm.type == "All" ? "tous freelancers" : newForm.type
		}

		this.formulaireService.filterSubject.next(newForm);
	}


	profileNavigate(contactUid) {
		this.router.navigate(['freelanceClientProfil', contactUid.uid])
	}


}
