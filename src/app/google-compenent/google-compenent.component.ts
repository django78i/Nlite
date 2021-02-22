import { Component, OnInit, ViewChild, EventEmitter, Output, AfterViewInit, Input, Inject, Renderer2, } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { } from "googlemaps";
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-google-compenent',
  templateUrl: './google-compenent.component.html',
  styleUrls: ['./google-compenent.component.scss'],
})
export class GoogleCompenentComponent implements OnInit {
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  @Input() adressType: string;
  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  autocompleteInput: string;
  queryWait: boolean;


  formattedaddress = " ";
  options = {
    componentRestrictions: {
      country: ["FR"]
    }
  }
  public AddressChange(address: any) {
    //setting address from API to local variable 
    this.formattedaddress = address.formatted_address
  }

  constructor(@Inject(DOCUMENT) private document: Document, private renderer2: Renderer2,) { }

  ngOnInit(): void {
    // const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBAyMH-A99yD5fHQPz7uzqk8glNJYGEqus';
    // this.loadScript(url);
  }

  // private loadScript(url) {
  //   return new Promise((resolve, reject) => {
  //     const script = this.renderer2.createElement('script');
  //     script.type = 'text/javascript';
  //     script.src = url;
  //     script.text = ``;
  //     script.async = true;
  //     script.defer = true;
  //     script.onload = resolve;
  //     script.onerror = reject;
  //     this.renderer2.appendChild(this.document.body, script);
  //   })
  // }

  public handleAddressChange(address: Address) {
    this.formattedaddress = address.formatted_address

  }

}



