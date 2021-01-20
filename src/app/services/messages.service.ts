import { switchMap, tap, filter, map } from 'rxjs/operators';
import { Message } from './../models/message.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class MessgesService {

    messageList: Observable<Message[]>;
    user: any;

    constructor(private userService: UserService, private afs: AngularFirestore, public auth: AngularFireAuth) {
    }

    getMessages(contact): Observable<Message[]> {

        // this.messageList = this.userService.user.pipe(
        //     switchMap(user=>{
        //         const pair = ''
        //         return this.afs.collection('users').doc(user.uid).collection('rooms').doc(contact).collection<Message>('messages', ref => ref.orderBy('timestamp')).valueChanges()
        //     }),
        //     tap(message=> console.log(message))
        // )
        // return this.messageList;
        this.messageList = this.userService.user.pipe(
            switchMap(user => {
                console.log('user :',user,'contact :',contact);
                return user.status == 'freelancer' ?
                    this.afs.collection<Message>('messages', ref => ref.where('keyPair', '==', user.uid + contact)).valueChanges()
                    : this.afs.collection<Message>('messages', ref => ref.where('keyPair', '==', contact + user.uid)).valueChanges()
            })
            ,
            tap(message => console.log(message))
        )
        return this.messageList;
    }


    saveMessage(message, contactId, userId) {
        console.log('enregistrement message');
        const id = this.afs.createId();
        message.uid = id;
        this.afs.collection('messages').doc(id).set(Object.assign({}, message))
        // this.afs.collection('users').doc(userId).collection('rooms').doc(contactId).collection('messages').doc(id).set(Object.assign({}, message));
        // this.afs.collection('users').doc(contactId).collection('rooms').doc(userId).collection('messages').doc(id).set(Object.assign({}, message));
    }


}

