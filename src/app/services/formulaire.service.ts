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

	filterSubject: Subject<any>;
	req: any;
	constructor(private afs: AngularFirestore, private router: Router) {
		this.filterSubject = new BehaviorSubject(null);
		this.freelancerList = this.filterSubject.pipe(
			tap(data => this.req = data),
			switchMap(req => this.afs.collection<Freelancer>('users', ref => ref.where('status', '==', 'freelancer')).valueChanges()),
			map(free => free.filter(free => this.req.location != 'All' ? free.departement === this.req.location : free.status == 'freelancer')),
			map(free => free.filter(free => this.req.type != 'All' ? free.categories.find(categ => categ === this.req.type) ? true : '' : free.status == 'freelancer')),
			map(free => free.filter(free => this.req.prix ? free.prixMinimum > this.req.prix : free.status == 'freelancer')),
			tap(free => console.log(this.req)),
			share()
		)
	}

}

