import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private http: HttpClient) { }

  getPlace(text) {
    // return this.http.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + text + '&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyAGjPKxEo7Jy5BsHwdrgA5lPzHC3eHAxtE');
  }
}
