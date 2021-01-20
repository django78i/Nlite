import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

@Component({
	selector: 'app-message-view',
	templateUrl: './message-view.component.html',
	styleUrls: ['./message-view.component.scss']
})
export class MessageViewComponent implements AfterViewInit, AfterViewChecked {

	@ViewChild('scrollMe') private myScrollContainer: ElementRef;

	@Input() message;
	@Input() uid;
	container: HTMLElement;

	constructor() { }

	ngOnInit(): void {
		console.log(this.message)
	}

	ngAfterViewInit() {
		this.container = document.getElementById("discussionContent");
		this.container.scrollTop = this.container.scrollHeight;
	}

	position(message) {
		if (message == this.uid) {
			return 'flex-start';
		} else return 'flex-end';
	}

	ngAfterViewChecked() {
		this.scrollToBottom();
	}


	scrollToBottom(): void {
		try {
			this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
		} catch (err) { }
	}


}
