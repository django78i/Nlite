import { CalendrierService } from 'src/app/services/calendrier.services';
import { User } from './../../../models/user.model';
import { UserService } from './../../../services/user.service';
import { Component, OnInit, Inject } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormulaireService } from '../../../services/formulaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpUserRdvComponent } from '../pop-up-user-rdv/pop-up-user-rdv.component';


export interface DialogData {
	rdv: any;
}

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
	msgList: Observable<any>;
	rdvList: any[] = [];
	lastRdv: any;

	constructor(public dialog: MatDialog, private router: Router, private userService: UserService, private calendrierService: CalendrierService,) { }

	ngOnInit(): void {
		moment.locale('fr');
		this.user = this.userService.user.pipe(
			tap(user => this.rdv = this.calendrierService.getLastRdv(user.uid).
				pipe(tap(res => this.lastRdv = res[0]))
			)
		);
		this.msgList = this.userService.getRooms(this.userService.user);
	}

	openDialog(rdv) {
		this.dialog.open(PopUpUserRdvComponent, {
			width: '90%',
			height: '340px',
			maxWidth: '100%',
			data: {
				rdv: rdv
			}
		});
	}


	checkRoom(id) {
		const val = {
			freeUid: id.freeUid,
			clientId: id.clientUid,
			client: id.user,
			freelance: id.freelancer,
			uid: id.uid,

		}
		this.router.navigate(['/chatCom'], { state: { data: { val } } });

	}


}
