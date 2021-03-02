import { PortFolioService } from './../../services/portfolio.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FreelancerProfilClientComponent } from '../freelancers/freelancer-profil-client/freelancer-profil-client.component';
import { SwiperComponent } from 'ngx-useful-swiper';
import { SwiperOptions } from 'swiper';
import { DialogData } from '../freelancers/folio-carousel/folio-carousel.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-freelancer-folio-slide',
	templateUrl: './freelancer-folio-slide.component.html',
	styleUrls: ['./freelancer-folio-slide.component.scss']
})
export class FreelancerFolioSlideComponent implements OnInit {


	config: SwiperOptions = {
		pagination: { el: '.swiper-pagination', clickable: true },
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		initialSlide: this.data.uid,
	};

	constructor(private router : Router, private portfolioService : PortFolioService, public dialogRef: MatDialogRef<FreelancerProfilClientComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

	ngOnInit(): void {
		console.log(this.data);
	}




	onNoClick(): void {
		this.dialogRef.close();
	}

	valider(){
		this.portfolioService.rdvSubject.next(true);
		this.onNoClick();
	}

}
