import { Portfolio } from './../../../models/portfolio.model';
import { PortFolioService } from './../../../services/portfolio.service';
import { Observable, Subscription } from 'rxjs';
import { UserService } from './../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { FreelancerFolioSlideComponent } from '../../freelancer-folio-slide/freelancer-folio-slide.component';

@Component({
	selector: 'app-freelancer-profil-client',
	templateUrl: './freelancer-profil-client.component.html',
	styleUrls: ['./freelancer-profil-client.component.scss']
})
export class FreelancerProfilClientComponent implements OnInit {

	public demo1TabIndex = 0;
	demo1TabIndexSubscription :Subscription;
	freelancer$: Observable<User>
	params: any;
	backgroundColorToggle = "primary";
	portfolioList: Observable<any[]>
	data: any;
	constructor(public dialog: MatDialog, private eleRef: ElementRef, private route: ActivatedRoute,
		private userService: UserService, private portfolioService: PortFolioService, private router: Router) {
		this.route.params.subscribe((params) => {
			this.params = params.id,
				this.freelancer$ = this.userService.getSingleContact(params.id);
			this.portfolioList = this.portfolioService.getFreelancerFolio(params.id);
		}
		)
		this.portfolioService.rdvSubject.next(false);
	}

	ngOnInit(): void {
		this.demo1TabIndexSubscription = this.portfolioService.rdv.subscribe(num=>{
			if(num !=true){
				this.demo1TabIndex = 0
			}else{
				this.demo1TabIndex = 1
			}
		});
	}


	openRoom(contactUid) {
		this.userService.openRoom(contactUid);
		this.router.navigate(['chatCom', contactUid.uid]);
	}







}
