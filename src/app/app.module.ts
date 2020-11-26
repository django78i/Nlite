import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from './../environments/environment';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FormulaireService } from './services/formulaire.service'
import { UserService } from './services/user.service'
import { MessgesService } from './services/messages.service'
import { SignService } from './services/sign.service';
import { MatToolbarModule } from '@angular/material/toolbar';



//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//material
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SignInComponent } from './login/sign-in/sign-in.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { NavheaderComponent } from './navheader/navheader.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MailSendingComponent } from './mail-sending/mail-sending.component';
import { HomeComponent } from './home/home.component';
import { SignInUpComponent } from './login/sign-in-up/sign-in-up.component';
import { ChatComponent } from './chat/chat/chat.component';
import { ChatComComponent } from './chat/chat-com/chat-com.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { FreelancerProfilComponent } from './users/freelancers/freelancer-profil/freelancer-profil.component';
import { UserProfilComponent } from './users/user/user-profil/user-profil.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PopUpEditUserComponent } from './users/pop-up-edit-user/pop-up-edit-user.component';
import { FreelancerProfilClientComponent } from './users/freelancers/freelancer-profil-client/freelancer-profil-client.component';
import { MatTabsModule } from '@angular/material/tabs';
import { PortFolioService } from './services/portfolio.service';
import { PopEditFoliosComponent } from './users/freelancers/pop-edit-folios/pop-edit-folios.component';
import { PopUpCreateFolioComponent } from './users/freelancers/pop-up-create-folio/pop-up-create-folio.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DemoUtilsModule } from './calendar/demo-utils/module'
import { MatDatepickerModule, } from '@angular/material/datepicker';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { PopUpCalendarComponent } from './calendar/pop-up-calendar/pop-up-calendar.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { CalendrierService } from './services/calendrier.services';
import {MatSelectModule} from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendrierClientComponent } from './calendar/calendrier-client/calendrier-client.component';
import { PopUpCalenderClientComponent } from './calendar/pop-up-calender-client/pop-up-calender-client.component';

registerLocaleData(localeFr);

@NgModule({
	declarations: [
		AppComponent,
		SignInComponent,
		SignUpComponent,
		NavheaderComponent,
		NavigationComponent,
		MailSendingComponent,
		HomeComponent,
		SignInUpComponent,
		ChatComponent,
		ChatComComponent,
		UsersListComponent,
		FreelancerProfilComponent,
		UserProfilComponent,
		PopUpEditUserComponent,
		FreelancerProfilClientComponent,
		PopEditFoliosComponent,
		PopUpCreateFolioComponent,
		CalendarComponent,
		PopUpCalendarComponent,
		CalendrierClientComponent,
		PopUpCalenderClientComponent,
	],
	entryComponents: [
		PopEditFoliosComponent,
		PopUpEditUserComponent,
		PopUpCreateFolioComponent,
		PopUpCalendarComponent,
		PopUpCalenderClientComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFirestoreModule,
		BrowserAnimationsModule,
		MatStepperModule,
		MatFormFieldModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSlideToggleModule,
		MatToolbarModule,
		LayoutModule,
		MatSidenavModule,
		MatIconModule,
		FormsModule,
		MatListModule,
		MatDialogModule,
		MatTabsModule,
		MatProgressSpinnerModule,
		CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
		DemoUtilsModule,
		MatDatepickerModule,
		MatNativeDateModule,
		NgxMaterialTimepickerModule.setLocale('fr-FR'),
		MatSelectModule,
		NgbModule
		],
	providers: [
		MatDatepickerModule,
		FormulaireService,
		SignService,
		UserService,
		MessgesService,
		PortFolioService,
		CalendrierService,
		{provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
