import { switchMap, tap, filter, map } from 'rxjs/operators';
import { Message } from './../models/message.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './user.service';
import * as _ from 'lodash';


@Injectable({
    providedIn: 'root'
})
export class MessgesService {

    messageList: Observable<Message[]>;
    user: any;

    constructor(private userService: UserService, private afs: AngularFirestore, public auth: AngularFireAuth) {
    }

    getMessages(contact): Observable<Message[]> {

        this.messageList = this.userService.user.pipe(
            switchMap(user => {
                const pair = ''
                return this.afs.collection('rooms').doc(contact).collection<Message>('messages').valueChanges()
            }),
            map(msg => _.orderBy(msg, ['timestamp'], ['asc']))
        )
        return this.messageList;
    }


    saveMessage(message, contactId, userId) {
        const id = this.afs.createId();
        message.uid = id;
        this.afs.collection('rooms').doc(message.keyPair).collection('messages').doc(id).set(Object.assign({}, message));
        // this.afs.collection('users').doc(contactId).collection('rooms').doc(userId).collection('messages').doc(id).set(Object.assign({}, message));
    }


}

