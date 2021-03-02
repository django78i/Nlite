import { SignUpComponent } from './login/sign-up/sign-up.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignInUpComponent } from './login/sign-in-up/sign-in-up.component';
import { ChatComponent } from './chat/chat/chat.component';
import { ChatComComponent } from './chat/chat-com/chat-com.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { FreelancerProfilComponent } from './users/freelancers/freelancer-profil/freelancer-profil.component';
import { UserProfilComponent } from './users/user/user-profil/user-profil.component';
import { FreelancerProfilClientComponent } from './users/freelancers/freelancer-profil-client/freelancer-profil-client.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
  { path: 'login', component: SignInUpComponent },
  { path: 'mail', component: SignUpComponent },
  { path: 'nav', component: NavigationComponent },
  { path: 'freelanceList', component: UsersListComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'chatCom', component: ChatComComponent },
  { path: 'freelancerProfil', component: FreelancerProfilComponent },
  { path: 'clientProfil', component: UserProfilComponent },
  { path: 'freelanceClientProfil/:id', component: FreelancerProfilClientComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
