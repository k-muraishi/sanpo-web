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
    window.location.reload()
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
          url: 'https://my.microsoftpersonalcontent.com/personal/fbbb8642c60c4b7d/_layouts/15/download.aspx?UniqueId=467ac523-0cef-4e6c-821b-83deb6a61324&Translate=false&tempauth=v1e.eyJzaXRlaWQiOiJjM2Y4MjAwZC1iZmE2LTQ2ZTQtOWU2OC1iMGU4N2M3Nzc0MWUiLCJhcHBpZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDA0ODE3MTBhNCIsImF1ZCI6IjAwMDAwMDAzLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMC9teS5taWNyb3NvZnRwZXJzb25hbGNvbnRlbnQuY29tQDkxODgwNDBkLTZjNjctNGM1Yi1iMTEyLTM2YTMwNGI2NmRhZCIsImV4cCI6IjE3MzIyMDEyMDAifQ.T3tSJvpgQuyrFKkk_MB6Do_EnkYmCBx1WJfjnVA7Pdi17wEWjdXBBx7BytGqBGP6-ph6Ssbst3kvxCFLzwzjeHOK3yk0K21bEo3qlWATfNi5e3FZV5COJol_NYWsdKkEpTqwZ9MSI3d2GDyFELBp4172qVOqoxf1nKT44WzPEcL4F3ksfZSuurxOJPdabvYg9Nz1SYeXAwDDb23Z3yRvo8F_cRTPsrzbHFSKQVpyBfCxmhWixSWd9BISB4gGy3YY9h8DaSux4AhxBpYlLcHhhXoy7LFwKKaehTxvRq1WzsoXbitYZ_O6Pvc0vJr66ZL9Ke4QDPO2r_-hqt-7R9mTACB2o_rVB3KRQlkB1KcsIs1pWgs8vKgIYm_l64s6_5qx4q00ha69Jqp-P6M-ZpSeQNh76SjLYsHv5jrpehQ-xeA.5XbE_McD4D9uqgQJGIYaNyJ_DB0n9nJpXeVBYxI2q3c&ApiVersion=2.0',
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

