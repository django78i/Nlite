import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject, combineLatest, Subscription, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
// import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs/internal/observable/of';
import { merge, switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model'
import { forkJoin } from 'rxjs';
import { UrlResolver } from '@angular/compiler';
import firebase from 'firebase/app';

@Injectable({
    providedIn: 'root'
})
export class SignService {

    isAuth: Observable<any>;
    userSubject = new Subject<any>();
    user: Observable<any>;
    userRegister: any;

    constructor(private afs: AngularFirestore, public auth: AngularFireAuth, private router: Router) {

    }


    login() {
        console.log('login ..');
        const popUp = from(this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
        this.user = popUp.pipe(
            switchMap(data => this.afs.collection('users').doc(data.user.uid).valueChanges())
        )
        this.user.subscribe((data) => {
            console.log(data)
            if (!data) {
                console.log('trouvé')
                popUp.subscribe((datas) => {
                    const donnee = new User(
                        datas.user.uid,
                        datas.user.displayName,
                        datas.user.email,
                        '',
                        '',
                        'client',
                        [],
                        '',
                        '',
                        '',
                        '',
                        '',
                        '',
                        []
                    )
                    console.log('création');
                    this.createUser(donnee);
                })

            }
            this.router.navigate(['home']);
        })

    }

    userEmailPassword(user) {
        // let newUser;
        this.auth.createUserWithEmailAndPassword(user.email, user.password);
        firebase.auth().onAuthStateChanged((users) => {
            console.log(users);
            const newUser = {
                displayName: 'johny',
                email: user.email,
                uid: users.uid,
                status: 'client',
                password: user.password
            }
            this.createUser(newUser);
        })
        // val.pipe(
        //     switchMap(user =>{
        //         // return newUser = {
        //         //     displayName : user.displayName
        //         // }
        //     })
        // )
        // const id = this.afs.createId();
    }

    createUser(user) {
        this.afs.collection('users').doc(user.uid).set(Object.assign({}, user));
    }

    signUser(user){
        this.auth.signInWithEmailAndPassword(user.email, user.password);
    }

    logout() {
        this.auth.signOut();
    }



}

