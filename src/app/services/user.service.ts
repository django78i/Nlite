import { Router } from '@angular/router';
import { User } from './../models/user.model';
import { Message } from './../models/message.model';
import { filter, last, map, mergeMap, switchMap, takeLast, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subject, combineLatest, merge, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    //User
    usersObser: Observable<User[]>;
    singleContactObser: Observable<User>;
    user: Observable<User>;
    contactSubject: BehaviorSubject<any>;
    userSubject: BehaviorSubject<any>;
    messageSubject: BehaviorSubject<any>;
    messageObser: Observable<Message[]>;

    // freelancer
    freelancers: Observable<User[]>;

    //Room
    rooms: Observable<any>;
    roomsubject: BehaviorSubject<any>;
    roomSubscription: Subscription;
    isAuth: boolean = false;
    conn: any;

    constructor(private afs: AngularFirestore, public auth: AngularFireAuth, private router: Router) {

        this.contactSubject = new BehaviorSubject(null);
        // this.userSubject = new BehaviorSubject(null);
        this.messageSubject = new BehaviorSubject(null);

        // recupération user en cours
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.isAuth = true;
                this.getCurrentUSer(user);
            }
        })

    }

    getCurrentUSer(user): Observable<User> {
        console.log('get user :', user);
        this.userSubject = new BehaviorSubject(null);
        this.userSubject.next(user);
        this.user = this.userSubject
            .pipe(
                switchMap(user => {
                    return this.afs.collection<User>('users').doc<User>(user.uid).valueChanges()
                })
            )
        return this.user;
    }

    getUsers(): Observable<User[]> {
        return this.usersObser = this.afs.collection<User>('users').valueChanges();
    }

    getFreelancers() {
        return this.freelancers = this.afs.collection<User>('users', ref => ref.where('status', '==', 'freelancer')).valueChanges();
    }

    getSingleContact(uid): Observable<User> {
        this.contactSubject.next(uid);
        this.singleContactObser = this.contactSubject
            .pipe(
                switchMap((data) => {
                    return this.afs.collection<User>('users').doc<User>(uid).valueChanges()
                })
            )
        return this.singleContactObser;
    }

    upDateUser(user) {
        console.log(user);
        this.afs.collection('users').doc(user.uid).update(Object.assign({}, user));
    }

    getRooms(user: Observable<User>): Observable<any> {
        return this.rooms = user.pipe(
            switchMap(userUnique => {
                return userUnique.status == 'freelancer' ? this.afs.collection('rooms', ref => ref.where('freeUid', '==', userUnique.uid)).valueChanges()
                    : this.afs.collection('rooms', ref => ref.where('clientUid', '==', userUnique.uid)).valueChanges()
            }),
            tap(rooms => console.log(rooms))
        )
    }

    // getClientRooms(user: Observable<User>): Observable<any> {
    //     return this.rooms = user.pipe(
    //         switchMap(userUnique => {
    //             return userUnique.status =='freelancer'? this.afs.collection('rooms', ref=>ref.where('freeUid','==',userUnique.uid)).valueChanges()
    //             : this.afs.collection('rooms', ref=>ref.where('clientUid','==',userUnique.uid)).valueChanges()
    //         })
    //     )
    // }


    openRoom(contact) {
        console.log('rooms', contact);
        this.roomsubject = new BehaviorSubject(null);
        this.roomsubject.next(contact);
        this.rooms = combineLatest([
            this.user,
            this.roomsubject
        ]).pipe(
            switchMap(([user, contact]) => {
                console.log(user);
                console.log(contact);

                const val = contact.uid + user.uid;
                return this.afs.collection('rooms').doc(val).valueChanges()
            }),
            tap(room => {
                console.log(room);
                if (!room) {
                    this.createRooms(contact)
                }
            })
        )
        this.rooms.subscribe();

    }

    createRooms(contact) {
        console.log('creation room', contact);
        this.roomSubscription = this.user.subscribe((user) => {
            const val = contact.uid + user.uid;
            const roomIdUser = {
                uid: val,
                user: user.displayName,
                freelancer: contact.displayName,
                freeUid: contact.uid,
                clientUid: user.uid
            }
            // const roomIdContact = {
            //     uid: user.uid,
            //     name: user.displayName
            // }
            // const id = this.afs.createId();
            this.afs.collection('rooms').doc(val).set(Object.assign({}, roomIdUser));
            // this.afs.collection('users').doc(contact.uid).collection('rooms').doc(user.uid).set(Object.assign({}, roomIdContact));
        })

    }



}
