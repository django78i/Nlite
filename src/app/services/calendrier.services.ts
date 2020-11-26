import { CalendarEvent } from 'angular-calendar';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CalendrierService {
    rdvSubject: Subject<any[]>;

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

    getRdv(user) {
        console.log('ici');
        console.log(user.uid);
        return this.afs.collection('users').doc(user.uid).collection('rdv').valueChanges();
    }

    deleteRdv(user,rdv){
        console.log(user, rdv);
        this.afs.collection('users').doc(user.uid).collection('rdv').doc(rdv.id).delete();
    }

    editRdv(event){
        this.afs.collection('users').doc(event.contact.userUid).collection('rdv').doc(event.contact.uid).update((Object.assign({}, event)));
    }
}

