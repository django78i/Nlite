import { Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwiperComponent } from 'ngx-useful-swiper';
import { SwiperOptions } from 'swiper';
import { FreelancerFolioSlideComponent } from '../../freelancer-folio-slide/freelancer-folio-slide.component';


export interface DialogData {
	uid: number,
	photos: [],
	titre: string,
	prix: number,
}


@Component({
	selector: 'app-folio-carousel',
	templateUrl: './folio-carousel.component.html',
	styleUrls: ['./folio-carousel.component.scss']
})
export class FolioCarouselComponent implements OnInit {
	@ViewChild('usefulSwiper', { static: false }) usefulSwiper: SwiperComponent;

	@Input() photos: any[];
	@Input() titre: any;
	@Input() prix: number;

	image = '../../../assets/icones/videoTest.png';
	// image = 'https://i2.wp.com/watermarkcounseling.com/wp-content/uploads/2018/12/background-design-marble-850796.jpg?ssl=1';

	config: SwiperOptions = {
		pagination: { el: '.swiper-pagination', clickable: true },
		slidesPerView: 'auto',
		spaceBetween: 10,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
	};


	constructor(public dialog: MatDialog,) { }

	ngOnInit(): void {
	}


	openDialog(photos, i): void {
		const dialogRef = this.dialog.open(FreelancerFolioSlideComponent, {
			maxWidth: '100%',
			width: '100%',
			height: '100%',
			data: { uid: i, photos: photos, titre: this.titre, prix: this.prix },
			panelClass: 'custom',
		});
	}


}
