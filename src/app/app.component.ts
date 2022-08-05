import { Component } from '@angular/core';
import { TravelMarker, TravelMarkerOptions, TravelData, TravelEvents, EventType } from 'travel-marker';
declare var google: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public title = 'sanpo';
  public zoom: number = 15;
  public latitude: number = 35.7027021;
  public longitude: number = 139.5607125;
  public fromLat: any;
  public fromlong: any;
  public toLat: any;
  public toLong: any;
  public label: string = '出発地を決めてね！';
  public line: any;
  public map: any;
  public mapClickListener: any;
  public directionsService: any;
  public marker!: TravelMarker;
  public speedMultiplier = 1;
  public locationChosen = true;
  start: any;
  end: any;

  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) =>
    {
        this.latitude = e.latLng.lat();
        this.longitude = e.latLng.lng();
        this.locationChosen = true;
    });
  }

  setFrom() {
    this.fromLat = this.latitude;
    this.fromlong = this.longitude
    this.label = "目的地を決めてね！"
    this.start = new google.maps.LatLng(this.fromLat, this.fromlong);
    const startMarker = new google.maps.Marker({position: this.start, map: this.map, label: '発'});
  }

  setTo() {
    this.toLat = this.latitude;
    this.toLong = this.longitude
    this.label = "散歩スタート！"
    this.end = new google.maps.LatLng(this.toLat, this.toLong);
    const endMarker = new google.maps.Marker({position: this.end, map: this.map, label: '着'});
  }

  play() {
    this.mockDirections();
    this.marker.play();
    this.label = "出発地を決めてね！"
  }
  reset() {
    this.marker.reset();
  }

  // mock directions api
  mockDirections() {
    var locationData =[[this.fromLat, this.fromlong],[this.toLat, this.toLong]]

    const locationArray = locationData.map(l => new google.maps.LatLng(l[0], l[1]));

    this.line = new google.maps.Polyline({
      strokeOpacity: 0.5,//透明度
      strokeColor: '#7B68EE', //色
      strokeWeight: 3, //太さ
      path: [],
      map: this.map
    });
    locationArray.forEach(l => this.line.getPath().push(l));
    this.initRoute();

  }

  // initialize travel marker
  initRoute() {
    const route = this.line.getPath().getArray();

    // options
    const options: TravelMarkerOptions = {
      map: this.map,  // map object
      speed: 50,  // default 10 , animation speed
      interval: 10, // default 10, marker refresh time
      speedMultiplier: this.speedMultiplier,
      markerOptions: {
        title: 'Travel Marker',
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'https://i.imgur.com/DHZKIn4.png',
          // This marker is 20 pixels wide by 32 pixels high.
          animation: google.maps.Animation.DROP,
          // size: new google.maps.Size(256, 256),
          scaledSize: new google.maps.Size(128, 128),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(53, 110)
        }
      },
    };
    // define marker
    this.marker = new TravelMarker(options);

    // add locations from direction service
    this.marker.addLocation(route);
 }

}

