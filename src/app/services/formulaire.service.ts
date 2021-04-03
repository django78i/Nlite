import { Router } from '@angular/router';
import { User } from './../models/user.model';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { filter, tap, switchMap, flatMap, map, share } from 'rxjs/operators';
import * as _ from 'lodash';
import { Freelancer } from '../models/freelancer.model';


@Injectable({
	providedIn: 'root'
})
export class FormulaireService {

	freelancerList: Observable<any[]>;
	filteredList: Observable<any[]>;

	filterSubject: BehaviorSubject<any>;
	req: any;
	menuSub: Boolean;

	constructor(private afs: AngularFirestore, private router: Router) {
		this.filterSubject = new BehaviorSubject(null);
		this.freelancerList = this.filterSubject.pipe(
			tap(data => this.req = data),
			switchMap(req => this.afs.collection<Freelancer>('users', ref => ref.where('status', '==', 'freelancer')).valueChanges()),
			map(free => free.filter(free => this.req.allFreelancer == true ? free.status == 'freelancer' : free.adresse.departement == this.req.location)),
			map(free => free.filter(free => this.req.allFreelancer == true ? free.status == 'freelancer' : free.categories.find(categ => categ == this.req.type))),
			share()
		)
		this.menuSub = true;
	}




}

