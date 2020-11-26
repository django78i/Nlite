import { Observable } from 'rxjs';
import { UserService } from './../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-freelancer-profil-client',
  templateUrl: './freelancer-profil-client.component.html',
  styleUrls: ['./freelancer-profil-client.component.scss']
})
export class FreelancerProfilClientComponent implements OnInit {

  freelancer$: Observable<User>
  params: any;
  backgroundColorToggle = "primary";


  constructor(private route: ActivatedRoute, private userService: UserService) {
    this.route.params.subscribe((params) => {
      this.params = params.id,
      this.freelancer$ = this.userService.getSingleContact(params.id);
    }
    )
  }

  ngOnInit(): void {
  }

}
