import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private http: HttpClient) { }

  getPlace(text) {
    let place = this.http.get('https://api.foursquare.com/v2/venues/explore?client_id=5N0W1JXCK0BHBK5XJWZL0NBJQ0DE11HGFL2HAIHSFUO54O1O&client_secret=ITJHRE1I2XCXO4KNLDJDW5JY0C0MVEYAQIETRUMBMM521M0T&v=20180323&limit=1&ll=40.7243,-74.0018&query=coffee');
      console.log(place);
    return place;
  }
}
