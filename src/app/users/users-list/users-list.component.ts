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

	usersList: Observable<User[]>;
	curentUser: Observable<User>;
	freelancerList: Observable<User[]>;
	searchForm: FormGroup;
	prixFiltre: Observable<any>;
	prix: number;
	lieu: Lieu[] = [
		{ value: 'Yvelines', viewValue: 'Yvelines' },
		{ value: 'Loire-Atlantique', viewValue: 'Loire-Atlantique' },
	];
	types: Type[] = [
		{ value: 'coiffure', viewValue: 'coiffeur' },
		{ value: 'plombier', viewValue: 'plombier' },
	];

	//skills filter
	visible = true;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	fruitCtrl = new FormControl();
	filteredFruits: Observable<string[]>;
	req: any;
	fruits: string[] = ['toutes'];
	allFruits: string[] = ['toutes', 'dreads', 'afro', 'degradé', 'femme', 'beauté'];
	@ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
	@ViewChild('auto') matAutocomplete: MatAutocomplete;

	constructor(private route: ActivatedRoute, private formulaireService: FormulaireService, private formBuilder: FormBuilder, private userService: UserService, private auth: AngularFireAuth, private router: Router, private forulaireService: FormulaireService) { }

	ngOnInit(): void {
		this.auth.onAuthStateChanged((user) => {
			if (user) {
				this.curentUser = this.userService.getCurrentUSer(user)
			}
		})
		this.req = history.state.data ? history.state.data : this.formulaireService.req ? this.formulaireService.req : '';
		this.req ? this.formulaireService.filterSubject.next(this.req) : this.formulaireService.filterSubject.next({ location: 'All', type: 'All' });
		this.freelancerList = this.formulaireService.freelancerList;
		this.initForm();
		//filterSkills
		this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
			startWith(<string>null),
			map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));

	}

	initForm() {
		this.searchForm = this.formBuilder.group({
			location: [''],
			prix: [''],
			type: ['']
		});
		this.searchForm.patchValue(this.req);
	}

	appear() {
		const value = this.searchForm.value;
		const newForm = {
			location: value['location'],
			prix: value['prix'],
			type: value['type']
		}
		console.log(newForm);
		this.formulaireService.filterSubject.next(newForm);
	}

	openRoom(contactUid) {
		this.userService.openRoom(contactUid);
		this.router.navigate(['chatCom', contactUid.uid]);
	}

	profileNavigate(contactUid) {
		this.router.navigate(['freelanceClientProfil', contactUid.uid])
	}


	//skills Formulaire
	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our fruit
		if ((value || '').trim()) {
			this.fruits.push(value.trim());
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}

		this.fruitCtrl.setValue(null);
	}

	remove(fruit: string): void {
		const index = this.fruits.indexOf(fruit);

		if (index >= 0) {
			this.fruits.splice(index, 1);
		}
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		this.fruits.push(event.option.viewValue);
		this.fruitInput.nativeElement.value = '';
		this.fruitCtrl.setValue(null);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
	}

}
