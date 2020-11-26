import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FormulaireService {

  constructor(private afs: AngularFirestore) { }

  // onSubmitForm(message) {
  //   console.log(message);
  //   this.afs.collection('users').doc(message.nom).set(Object.assign({}, message));
  //   // firebase.database().ref('/users').set(message);
  // }
}

