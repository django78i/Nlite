import { FormulaireService } from './services/formulaire.service';
import { UserService } from './services/user.service';
import { SignService } from './services/sign.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Observable, ObservedValueOf } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
	title = 'testMailing';


	isAuth: any;
	userFormat: any;
	user: Observable<any>;
	url: "../../../assets/icones/logo.svg"; private
	menu$: Observable<Boolean>;
	smallScreen: any;
	small: Boolean;


	constructor(private router: Router, private afs: AngularFirestore, private breakpointObserver: BreakpointObserver
		, public auth: AngularFireAuth, public signService: SignService, public userService: UserService, public fms: FormulaireService) {
		this.userService.authSub.subscribe(u => {
			this.isAuth = u;
			if (u == true) {
				this.getUserDisplay();
			}
		})

	}

	ngOnInit(): void {
	}
	ngAfterViewInit() {
		this.smallScreen = this.breakpointObserver.isMatched('(max-width: 550px)');
		if (this.smallScreen === true) {
			this.small = true;
		} else {
			this.small = false;

		}
	}

	logout() {
		this.signService.logout();
	}

	getUserDisplay(): Observable<any> {
		this.user = this.userService.user.pipe(
			tap(user => {
				const spl = user.displayName.split(" ").map(n => n[0]).join("");
				this.userFormat = spl;
			})
		);
		return this.user;
	}



	state() {
		this.auth.onAuthStateChanged((user) => {
			this.isAuth = user ? true : false;
			if (user) {
				this.user = this.userService.user;
			}
		})
	}

	profil(user) {
		user === 'freelancer' ? this.router.navigate(['freelancerProfil']) : this.router.navigate(['clientProfil'])
	}

	onActivate($event) {
		window.scroll(0, 0);
	}





}
