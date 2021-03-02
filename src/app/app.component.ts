import { UserService } from './services/user.service';
import { SignService } from './services/sign.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'testMailing';


	isAuth: boolean = false;
	userFormat: any;
	user: Observable<any>;
	url: "../../../assets/icones/logo.svg";

	constructor(private router: Router, private afs: AngularFirestore, private breakpointObserver: BreakpointObserver
		, public auth: AngularFireAuth, public signService: SignService, public userService: UserService) {
		this.auth.onAuthStateChanged((user) => {
			this.isAuth = user ? true : false;
			console.log(user);
			if (user) {
				this.user = this.userService.user.pipe(
					tap(user => {
						const spl = user.displayName.split(" ").map(n => n[0]).join("");
						this.userFormat = spl;
						console.log(spl);
					})
				);
			}
		})

	}

	ngOnInit(): void {
	}

	logout() {
		this.signService.logout();
	}

	state() {
		this.auth.onAuthStateChanged((user) => {
			this.isAuth = user ? true : false;
			console.log(user);
			if (user) {
				this.user = this.userService.user;
			}
		})
	}

	profil(user) {
		console.log(user);
		user === 'freelancer' ? this.router.navigate(['freelancerProfil']) : this.router.navigate(['clientProfil'])
	}

	onActivate($event) {
		window.scroll(0, 0);
	}




}
