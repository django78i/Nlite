import { CalendrierService } from 'src/app/services/calendrier.services';
import { User } from './../../../models/user.model';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormulaireService } from '../../../services/formulaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss']
})
export class UserProfilComponent implements OnInit {

  user: Observable<User>;
  rdv: Observable<any>;
  rdvUser: any;
  locale: string = 'fr';
  msgList : Observable<any>;

  constructor(private userService: UserService, private calendrierService: CalendrierService, ) { }

  ngOnInit(): void {
    moment.locale('fr');
    this.user = this.userService.user.pipe(
      tap(user => this.rdv = this.calendrierService.getLastRdv(user.uid).pipe(
        map(rdv => {
          const data = {
            nom: rdv[0].contact.freeDisplayName,
            date: moment(rdv[0].event.start.toDate()).format('LLL')
          }
          return data;
        }),
        tap(rdv => console.log(rdv))
      ))
    );
    this.msgList = this.userService.getRooms(this.userService.user);
  }




}
