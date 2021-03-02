import { Calendrier } from './../models/calendar.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import * as moment from 'moment';


@Injectable({
    providedIn: 'root'
})
export class CalendrierService {
    rdvSubject: Subject<any[]>;
    lastrdv: Observable<any>;
    rdvList: Subject<any>;

    jour = new Date()

    constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
        this.rdvSubject = new Subject;

    }


    createRdv(event) {
        console.log(event);
        this.afs.collection('rdv').doc(event.event.id).set(Object.assign({}, event));
    }

    createdevis(devis) {
        console.log(devis);
        let id = this.afs.createId();
        this.afs.collection('devis').doc(id).set(Object.assign({}, devis));
    }


    createRdvClient(event) {
        console.log(event);
        this.afs.collection('rdv').doc(event.event.id).set(Object.assign({}, event));
    }

    getRdv(user): Observable<Calendrier[]> {
        console.log('ici');
        console.log(user);
        return this.afs.collection<Calendrier>('rdv', ref => ref.where('freeUid', '==', user.uid)).valueChanges();
    }

    getLastRdv(user): Observable<any> {
        console.log('last:', this.jour);
        return this.afs.collection('rdv', ref => ref.where('userUid', '==', user)).valueChanges()
            .pipe(
                map(rdv => rdv.filter((rdv: any) => moment(this.jour).isBefore(rdv.event.start.toDate()))),
                map(res => _.sortBy(res, 'event.start', 'desc')),
            );
    }

    deleteRdv(user, rdv) {
        console.log(user, rdv);
        this.afs.collection('users').doc(user.uid).collection('rdv').doc(rdv.id).delete();
    }


    delete(rdv) {
        console.log(rdv);
        this.afs.collection('rdv').doc(rdv.rdv.event.id).delete();
    }

    editRdv(event) {
        this.afs.collection('users').doc(event.contact.userUid).collection('rdv').doc(event.contact.uid).update((Object.assign({}, event)));
    }
}

