import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  key: string = 'client_id=5N0W1JXCK0BHBK5XJWZL0NBJQ0DE11HGFL2HAIHSFUO54O1O&client_secret=ITJHRE1I2XCXO4KNLDJDW5JY0C0MVEYAQIETRUMBMM521M0T&v=20180323';

  constructor(private http: HttpClient) { }

  getPlacebySearch(city, text) {
    let url = 'https://api.foursquare.com/v2/venues/search?' + this.key + '&limit=1' + '&near=' + city + '&query=' + text;
    let place = this.http.get(url);
    return place;
  }

  getPlace(city, section) {
    let url = 'https://api.foursquare.com/v2/venues/explore?' + this.key + '&limit=1' + '&near=' + city + '&section=' + section + '&venuePhotos=1';
    let place = this.http.get(url);
    return place;
  }
 
  getPhotos(venueId) {
    let url = 'https://api.foursquare.com/v2/venues/' + venueId + '/photos?' + this.key + '&limit=1';
    let photos = this.http.get(url);
    return photos;
  }

  getTip(venueId) {
    let url = 'https://api.foursquare.com/v2/venues/' + venueId + '/tip?' + this.key + '&limit=1';
    let tip = this.http.get(url);
    return tip;
  }
}
