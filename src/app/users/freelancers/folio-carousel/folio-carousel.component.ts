import { Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwiperComponent } from 'ngx-useful-swiper';
import { SwiperOptions } from 'swiper';
import { FreelancerFolioSlideComponent } from '../../freelancer-folio-slide/freelancer-folio-slide.component';


export interface DialogData {
	uid: number,
	photos : [],
	titre : string,
	prix : number,
}


@Component({
	selector: 'app-folio-carousel',
	templateUrl: './folio-carousel.component.html',
	styleUrls: ['./folio-carousel.component.scss']
})
export class FolioCarouselComponent implements OnInit {
	@ViewChild('usefulSwiper', { static: false }) usefulSwiper: SwiperComponent;

	@Input()photos : any[];
	@Input()titre : any;
	@Input()prix : number;

	
	config: SwiperOptions = {
		pagination: { el: '.swiper-pagination', clickable: true },
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
	};


	constructor(public dialog: MatDialog,) { }

	ngOnInit(): void {
	}


	openDialog(photos, i): void {
		console.log('entree :${photos},${i} ');
		const dialogRef = this.dialog.open(FreelancerFolioSlideComponent, {
			maxWidth: '100%',
			width: '100%',
			height: '100vh',
			data: { uid: i, photos : photos, titre: this.titre, prix : this.prix },
			panelClass: 'custom',
		});
	}


}
