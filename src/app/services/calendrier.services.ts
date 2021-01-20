import { Calendrier } from './../models/calendar.model';
import { CalendarEvent } from 'angular-calendar';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { first, map, tap, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CalendrierService {
    rdvSubject: Subject<any[]>;
    lastrdv: Observable<any>;
    rdvList :Subject<any>;


    constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
        this.rdvSubject = new Subject;

    }


    createRdv(event) {
        console.log(event);
        this.afs.collection('users').doc(event.contact.userUid).collection('rdv').doc(event.contact.uid).set(Object.assign({}, event));
    }


    createRdvClient(event) {
        console.log(event);
        this.afs.collection('users').doc(event.contact.userUid).collection('rdv').doc(event.contact.uid).set(Object.assign({}, event));
        this.afs.collection('users').doc(event.contact.freeUid).collection('rdv').doc(event.contact.uid).set(Object.assign({}, event));
    }

    getRdv(user): Observable<Calendrier[]> {
        console.log('ici');
        console.log(user.uid);
        return this.afs.collection('users').doc(user.uid).collection<Calendrier>('rdv').valueChanges();
    }

    getLastRdv(user): Observable<any> {
        this.rdvList = new BehaviorSubject(null);
        console.log('last:', user);
        this.rdvList.next(user);
        this.lastrdv = this.rdvList.pipe(
            switchMap(user => this.afs.collection('users').doc(user).collection('rdv', ref => ref.orderBy('event.start')).valueChanges()),
            map(rdv=> rdv.splice(0, rdv.length-1)),
            tap(rdv => console.log(rdv))
        )
        return this.lastrdv;
    }

    deleteRdv(user, rdv) {
        console.log(user, rdv);
        this.afs.collection('users').doc(user.uid).collection('rdv').doc(rdv.id).delete();
    }

    editRdv(event) {
        this.afs.collection('users').doc(event.contact.userUid).collection('rdv').doc(event.contact.uid).update((Object.assign({}, event)));
    }
}

