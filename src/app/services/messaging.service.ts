import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
    providedIn: 'root'
})
export class MessagingService {
    private draw: MatDrawer;

    constructor() { }

    close() {
        this.draw.close();
    }

}
