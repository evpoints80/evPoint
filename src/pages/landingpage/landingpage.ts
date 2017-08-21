import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';
//import { AboutPage} from '../about/about'
import { Barcode} from '../barcode/barcode'
import { Settings } from '../settings/settings';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the Contact page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

declare var google;
@Component({
	selector: 'landingpage',
	templateUrl: 'landingpage.html',
})
export class Landingpage {
	options: BarcodeScannerOptions;
	results: {};
	public hideScan: boolean;
  public qrcode: boolean;

 @ViewChild('map') mapElement: ElementRef;
		map: any; x: any;
		originPlaceId: any;
		destinationPlaceId:any;
		travelMode:any;
		directionsService:any;
		directionsDisplay:any;
		location: object;

	constructor(public navCtrl: NavController,
							public navParams: NavParams,
							private barcode:BarcodeScanner,
		          public storage: Storage,
							public geolocation: Geolocation,
						  public http: Http) {
	}
	getLocation(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(this.geoSuccess);
		}
	}
	geoSuccess(position){
		var lat = position.coords.latitude;
	  var lng = position.coords.longitude;
	}
	goTosettings(){
		this.navCtrl.push(Settings);
	}
	showBarcode(){
		this.navCtrl.push(Barcode);
	}
	ionViewDidLoad() {
		this.storage.get('canDrive').then((val) => {
		 if(val){
			 this.hideScan = true;
			 this.qrcode = false;
		 }else{
			 this.hideScan = false;
			 this.qrcode = true;
		 }
   });
	 this.getLocation();
   this.loadMap();
	 this.initMap();
}
  loadMap() {
      this.geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				//console.log('land', position.coords.latitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
      }, (err) => {
        console.log(err);
      });
    }

ngOnInit(){
 if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(position => {
			this.location = position.coords;
			//console.log('ds', position.coords);
		});
 }
}
		initMap() {
			this.getMarkers();
        var map = new google.maps.Map(document.getElementById('map'), {
          mapTypeControl: false,
          center: {
						lat: 37.6949659, ////37.6949598789713 37.68565481996576
						lng: -121.8868977 //-121.86402454850463 -121.90990105149535
					},
          zoom: 12,
					styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
        });


				//var userMarker = new google.maps.Marker({position: {lat: 37.6949659,lng:-121.8868977}, icon: '../assets/icon/G.png', map: map});



     	this.AutocompleteDirectionsHandler(map);
      }


			addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

			getMarkers() {
				//https://api.openchargemap.io/v2/poi/?output=json&countrycode=US&maxresults=500&compact=true&verbose=false
				//https://api.openchargemap.io/v3/poi/?client=ocm.app.ionic.v6_0_0&verbose=false&compact=true&output=json&latitude=37.6903074954139&longitude=-121.8869628&includecomments=true&maxresults=
				//500&connectiontypeid=&operatorid=&usagetypeid=&statustypeid=&minpowerkw=0&compact=true&boundingbox=
				//(37.69495987897133,-121.86402454850463),(37.68565481996576,-121.90990105149535)
			  this.http.get('https://api.openchargemap.io/v2/poi/?output=json&countrycode=US&maxresults=500&compact=true&verbose=false')
			  .map((res) => res.json())
			  .subscribe(data => {
					//console.log('data' , data);
					let tempData = [];
					for(let latLng of data){
						tempData.push(latLng.AddressInfo);
                //console.log('latLng', latLng.AddressInfo);

					}
					 this.addMarkersToMap(tempData);
			  });
			}
			addMarkersToMap(markers) {
				for(let marker of markers) {
			   var position = new google.maps.LatLng(marker.Latitude, marker.Longitude);
			   var userMarker = new google.maps.Marker({position: position, title: marker.title, icon: 'https://s3.amazonaws.com/plugshare.production.assets/icons/G@2x.png', map: this.map});
				 let content = "<h3>Sample info window!</h3><h5><label>what time your leaving<label><br></h5>";
         this.addInfoWindow(userMarker, content);
	 	 }

				// markers.filter(function(el){
				// 	var diff_task = [];
				// 	//console.log(el);
				// 	for(let el of markers) {
				//    var position = new google.maps.LatLng(el.Latitude, el.Longitude);
				//    var userMarker = new google.maps.Marker({position: position,  icon: 'https://s3.amazonaws.com/plugshare.production.assets/icons/G@2x.png', map: this.map});
				//  }
				// })
			}
			addInfoWindowToMarker(marker) {

}
		 AutocompleteDirectionsHandler(map) {
			 this.map = map;
			 this.originPlaceId = null;
			 this.destinationPlaceId = null;
			 this.travelMode = 'WALKING';
			 var originInput = document.getElementById('origin-input');
			 var destinationInput = document.getElementById('destination-input');
			 var modeSelector = document.getElementById('mode-selector');
			 this.directionsService = new google.maps.DirectionsService;
			 this.directionsDisplay = new google.maps.DirectionsRenderer;
			 this.directionsDisplay.setMap(map);

			 var originAutocomplete = new google.maps.places.Autocomplete(
					 originInput, {placeIdOnly: true});
			 var destinationAutocomplete = new google.maps.places.Autocomplete(
					 destinationInput, {placeIdOnly: true});

			 this.setupClickListener('changemode-walking', 'WALKING');
			 this.setupClickListener('changemode-transit', 'TRANSIT');
			 this.setupClickListener('changemode-driving', 'DRIVING');

			 this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
			 this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

			 this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
			 this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
			 this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);

		 }

		 // Sets a listener on a radio button to change the filter type on Places
		 // Autocomplete.

		 setupClickListener(id, mode){
			 var radioButton = document.getElementById(id);
			 var me = this;
			 radioButton.addEventListener('click', function() {
				 me.travelMode = mode;
				 me.route();
			 });
		 };

		 setupPlaceChangedListener(autocomplete, mode) {
			 var me = this;
			 autocomplete.bindTo('bounds', this.map);
			 autocomplete.addListener('place_changed', function() {
				 var place = autocomplete.getPlace();
				 if (!place.place_id) {
					 window.alert("Please select an option from the dropdown list.");
					 return;
				 }
				 if (mode === 'ORIG') {
					 me.originPlaceId = place.place_id;
				 } else {
					 me.destinationPlaceId = place.place_id;
				 }
				 me.route();
			 });

		 };

		 route() {
			 if (!this.originPlaceId || !this.destinationPlaceId) {
				 return;
			 }else if((this.originPlaceId || this.destinationPlaceId) !== null){
				this.location = {
					 "origin": this.originPlaceId,
					 "dest" : this.destinationPlaceId
				 }
				  this.storage.set('whereToGo', this.location);
			 }
			 var me = this;

			 this.directionsService.route({
				 origin: {'placeId': this.originPlaceId},
				 destination: {'placeId': this.destinationPlaceId},
				 travelMode: this.travelMode
			 }, function(response, status) {
				 if (status === 'OK') {
					 me.directionsDisplay.setDirections(response);
				 } else {
					 window.alert('Directions request failed due to ' + status);
				 }
			 });
		 };
}
