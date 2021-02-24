import { BehaviorSubject } from 'rxjs';
import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import * as moment from 'moment';

@Component({
	selector: 'app-message-view',
	templateUrl: './message-view.component.html',
	styleUrls: ['./message-view.component.scss']
})
export class MessageViewComponent implements AfterViewInit {

	@ViewChild('scrollMe') private myScrollContainer: ElementRef;

	@Input() message;
	@Input() contactUid;
	@Input() userUid;
	container: HTMLElement;
	pos: any;
	msgs: any[] = [];

	constructor() { }

	ngOnInit(): void {

	}

	ngAfterViewInit() {
		this.container = document.getElementById("discussionContent");
		this.container.scrollTop = this.container.scrollHeight;
	}

	position(message) {
		let pos;
		if (message == this.userUid) {
			return pos = 'flex-start';
		} else return pos = 'flex-end';
	}


	back(message) {
		let pos;
		if (message == this.userUid) {
			return pos = '#FFFFFF';
		} else return pos = '#3467C9';
	}

	color(message){
		let pos;
		if (message == this.userUid) {
			return pos = '#0E0E0F';
		} else return pos = '#FFFFFF';
	}

	// ngAfterViewChecked() {
	// 	this.scrollToBottom();
	// }


	// scrollToBottom(): void {
	// 	try {
	// 		this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
	// 	} catch (err) { }
	// }


}
