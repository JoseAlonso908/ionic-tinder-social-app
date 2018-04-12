import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController, Content } from 'ionic-angular';
import { MeetKinkStersPage } from '../meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../messages/messages';
import { MenuSidePage } from '../menu-side/menu-side';
import { DungeonFinderWalkthorughPage } from '../dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { DungeonListingPage } from '../dungeon-listing/dungeon-listing';

import { Geolocation } from '@ionic-native/geolocation';
import { NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { GroupsPage } from '../groups/groups';
import { AddyourdungeonPage } from '../addyourdungeon/addyourdungeon';
import { FirstproviderProvider } from '../../providers/firstprovider/firstprovider';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import { Keyboard } from 'ionic-angular/platform/keyboard';
import { NotificationProvider } from '../../providers/notification/notification';


// import $ from 'jquery';
/**
 * Generated class for the DungeonFinderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
// declare var MarkerClusterer;
@IonicPage()
@Component({
    selector: 'page-dungeon-finder',
    templateUrl: 'dungeon-finder.html',
})
export class DungeonFinderPage {
    @ViewChild('content_map') content: Content;
    reviews: any;
    avg = [];
    map: any = null;
    mapElement: HTMLElement;
    public watch: any;
    public lat: number = 0;
    public lng: number = 0;
    markers: Array<any>;

    dungeonLists = [];

    tempDungeon = [];
    paidDungeon = [];
    notifi_length = 0;

    search_key: string;


    constructor(public pushstate: NotificationProvider,
        public keyboard: Keyboard, public server: FirstproviderProvider, public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, public zone: NgZone,
        public backgroundGeolocation: BackgroundGeolocation, public toast: ToastController, public app: App, public loadingCtrl: LoadingController) {
        this.markers = [{ marker: '' }, { content: '' }];
        (window as any).angularComponent = { GoDetail: this.GoDetail, GoEdit: this.GoEdit, zone: zone };


    }
    ///////////////////////////////
    onFocus() {
        this.keyboard.close();

        this.content.resize();

    }
    //////////////////////////////////////////////////////search

    getItems(ev) {
        // Reset items back to all of the items

        // set val to the value of the ev target
        var val = ev.target.value;
        if (val == "") {
            this.tempDungeon = [];
            this.paidDungeon = [];
        }

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.search_key = ev.target.value;
            this.tempDungeon = this.dungeonLists.filter((items) => {
                this.paidDungeon = [];

                return (items.body.detail.locationName.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })

            let temp = this.tempDungeon;

            for (let dungeon = 0; dungeon < temp.length; dungeon++)

                if (temp[dungeon].body.pay.paid) {
                    this.paidDungeon.push(temp[dungeon]);
                    // this.tempDungeon.splice(dungeon, 1);
                    for (let doubledungeon = 0; doubledungeon < this.tempDungeon.length; doubledungeon++)
                        if (temp[dungeon] == this.tempDungeon[doubledungeon]){
                           this.tempDungeon.splice(doubledungeon, 1)
                        //    this.tempDungeon.push(temp[dungeon]);
                        }
                }

                this.tempDungeon = this.paidDungeon.concat(this.tempDungeon);

        }
    }

    ////////////////////////////////////////////////////////////

    getAVG() {
        for (let i = 0; i < this.dungeonLists.length; i++) {
            console.log(this.dungeonLists[i])
            alert(1);
            let temp1 = 0, bodylength = 0
            if (this.dungeonLists[i].body.reveiws.body.length != 0) {
                this.reviews = this.dungeonLists[i].body.reveiws;
                this.reviews.body.length;
            }


            for (let j = 0; j < bodylength; j++) {
                temp1 += this.reviews.body[j].mark.avg;

            }
            if (bodylength != 0) {
                this.avg[this.dungeonLists[i].ownner.uid] = Math.floor(10 * temp1 / bodylength) / 10;

                alert(this.avg[this.dungeonLists[i].ownner.uid]);

            } else {
                this.avg[this.dungeonLists[i].ownner.uid] = "No Reveiws";
                alert(this.avg[this.dungeonLists[i].ownner.uid]);
            }
        }

    }
    GoDetail = (providername) => {
        this.zone.run(() => {
            this.navCtrl.pop();

            this.navCtrl.push(DungeonListingPage, { dungeondata: providername, lists: this.dungeonLists });
        });
    }
    GoDetailFun(index, paid: boolean) {
        this.navCtrl.pop();
        if (paid)
            this.navCtrl.push(DungeonListingPage, { dungeondata: index, lists: this.paidDungeon });
        else
            this.navCtrl.push(DungeonListingPage, { dungeondata: index, lists: this.tempDungeon });

    }

    GoEdit = (providername) => {
        // this.zone.run(() => {
        //     console.log('This is the correct function!');
        //     this.navCtrl.pop();
        //     this.navCtrl.push(AddyourdungeonPage);
        // });
    }

    ionViewDidLoad() {
        /////////////////notification state
        this.notifi_length = 0;
        this.pushstate.getpushstate();

        let messageNotification = this.pushstate.notification;
        for (let i = 0; i < messageNotification.length; i++)
            this.notifi_length += messageNotification[i].cnt;
        ///////////////
        this.readDungeonLists();

        this.mapElement = document.getElementById('map');
        this.getAVG();


    }

    readDungeonLists() {
        let credention = { "status": "readdungeonlist" }
        this.server.postAdminData(credention).then((result) => {
            if (Object(result).status == "success") {
                for (let i = 0; i < Object(result).body.length; i++)
                    for (let j = 0; j < (JSON.parse(Object(result).body[i].body)).body.length; j++)
                        this.dungeonLists.push({ ownner: (JSON.parse(Object(result).body[i].body)).ownner, body: (JSON.parse(Object(result).body[i].body)).body[j] });

                this.loadMap();


            } else {
                let toast = this.toast.create({
                    message: "No Network",
                    duration: 2000
                })
                toast.present();
            }

        }, (err) => {
            let toast = this.toast.create({
                message: "No Network",
                duration: 2000
            })
            toast.present();
        });
    }


    loadMap() {
        let loading = this.loadingCtrl.create({
            content: "Please Wait..."
        });
        loading.present();
        var that = this;
        this.geolocation.getCurrentPosition().then((position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let styledMapType = new google.maps.StyledMapType(
                [
                    {
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#444444"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#f2f2f2"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.attraction",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.attraction",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.attraction",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.business",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.government",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.medical",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.park",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.place_of_worship",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.school",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi.sports_complex",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [
                            {
                                "saturation": -100
                            },
                            {
                                "lightness": 45
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit.line",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "transit.station",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#ce1f2f"
                            },
                            {
                                "visibility": "on"
                            }
                        ]
                    }
                ],
                { name: 'Styled Map' });

            let mapOptions = {
                center: latLng,
                zoom: 13,
                maxZoom: 15,
                mapTypeControlOptions: {
                    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
                }
            }
            this.map = new google.maps.Map(this.mapElement, mapOptions);
            this.map.mapTypes.set('styled_map', styledMapType);
            this.map.setMapTypeId('styled_map');


            let locations = [];
            for (let i = 0; i < this.dungeonLists.length; i++) {
                console.log(this.dungeonLists[i]);

                let clientlatlng = {
                    'lat': this.dungeonLists[i].body.detail.location.lat,
                    'lng': this.dungeonLists[i].body.detail.location.long
                }
                let content = i;

                locations.push(clientlatlng);

            }
            let markers = locations.map((location, indexOf) => {

                return this.addMarker(location, indexOf);
            });

            //////////////////////////////////////////////////////////////////////cluster
            let mcOptions = {
                styles: [{
                    textColor: 'white',
                    textSize: 20,
                    height: 57,
                    width: 60,
                    url: "assets/icon/cluster.png",
                    anchor: [0, 0],
                }],
                clusterClass: 'myCluster',
                zoomOnclick: false,
                averageCenter: true,
                cssClass: 'myCluster',
                maxZoom: 25


            }
            var markerCluster = new MarkerClusterer(this.map, markers, mcOptions);


            ////current pos marker
            new google.maps.Marker({
                map: that.map,
                animation: google.maps.Animation.DROP,
                position: latLng,
                icon: 'assets/icon/Available-locations.svg',
            });


            loading.dismiss();

            ////////
        }, (err) => {
            console.log(err);
            let toast = this.toast.create({
                message: "please check your Location and GPS setting",
                duration: 4000
            })
            toast.present();
            loading.dismiss();


        });


    }

    addMarker(posInfo, info: number) {
        let position = posInfo;

        var that = this;
        let marker = new google.maps.Marker({
            map: that.map,
            animation: google.maps.Animation.DROP,
            position: position,
            icon: 'assets/icon/dungeon-icon-nooutline.svg',
        });



        if (this.dungeonLists[info].body.dungeonPhoto[0] === null || this.dungeonLists[info].body.dungeonPhoto[0] === "")
            this.dungeonLists[info].body.dungeonPhoto[0] = "assets/img/dungeonIner.png";
        let markerInfo = '<div class="row"><h2 style="font-size:20px;width: 218px;">' + this.dungeonLists[info].body.detail.title + '</h2><img src = "assets/icon/star.svg" style = "height:10px;"/><span style = "color:green;font-size:15px;">' + this.avg[this.dungeonLists[info].ownner.uid] + '</span></div> '
            + "<img src = '" + this.dungeonLists[info].body.dungeonPhoto[0] + "' onclick=\"window.angularComponent.GoDetail('" + info + "')\" style = 'height:100px;width:250px;'/><br>"
            + '<img src = ' + this.dungeonLists[info].body.detail.detailPhotoUrl + ' style = "border-radius:70%;height:50px;width:50px"/>'
            + this.dungeonLists[info].body.detail.description;

        // this.markers.push(marker)

        this.addInfoWindow(marker, markerInfo);

        return marker;



    }


    addInfoWindow(marker, content) {

        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });


    }

    // startTracking() {

    //   let config = {
    //     desiredAccuracy: 0,
    //     stationaryRadius: 20,
    //     distanceFilter: 10,
    //     debug: true,
    //     interval: 2000
    //   };

    //   this.backgroundGeolocation.configure(config).subscribe((location) => {

    //     console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

    //     // Run update inside of Angular's zone
    //     this.zone.run(() => {
    //       this.lat = location.latitude;
    //       this.lng = location.longitude;
    //     });

    //   }, (err) => {

    //     console.log(err);

    //   });

    //   // Turn ON the background-geolocation system.
    //   this.backgroundGeolocation.start();


    //   // Foreground Tracking

    //   let options = {
    //     frequency: 3000,
    //     enableHighAccuracy: true
    //   };

    //   this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

    //     console.log(position);

    //      this.zone.run(() => {
    //       this.lat = position.coords.latitude;
    //       this.lng = position.coords.longitude;
    //     });
    //     this.lat = position.coords.latitude;
    //     this.lng = position.coords.longitude;
    //     console.log(this.lat + "--------" + this.lng);

    //   });

    // }

    //  click_fullmap()
    //  {

    //     $('#messagebox').hide();
    //     $('#map').show();
    //     $('#close_icon').show();
    //     this.mapElement = document.getElementById('map');
    //     console.log(this.mapElement);
    //     this.loadMap();
    //     this.startTracking();
    //  }




    // Adds a marker to the map and push to the array.
    //   addMarker(location) {
    //     var marker = new google.maps.Marker({
    //       position: location,
    //       map: map
    //     });
    //     markers.push(marker);
    //   }

    //   // Sets the map on all markers in the array.
    setMapOnAll(map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    }

    //   // Removes the markers from the map, but keeps them in the array.
    clearMarkers() {
        this.setMapOnAll(null);
    }

    //   // Shows any markers currently in the array.
    showMarkers() {
        this.setMapOnAll(this.map);
    }

    // Deletes all markers in the array by removing references to them.
    deleteMarkers() {
        this.clearMarkers();
        this.markers = [];
    }

    goMeetKinkSters() {
        // this.watch.unsubscribe();
        this.navCtrl.pop();
        this.navCtrl.push(MeetKinkStersPage);
    }
    goMessages() {
        this.navCtrl.pop();
        //  this.watch.unsubscribe();
        this.navCtrl.push(MessagesPage);
    }
    goDungeonFinderWalkthorugh() {
        this.navCtrl.pop();
        //this.watch.unsubscribe();
        this.navCtrl.push(DungeonFinderWalkthorughPage);
    }
    goMenuSide() {
        this.navCtrl.pop();
        //this.watch.unsubscribe();
        this.navCtrl.push(MenuSidePage);
    }
    goDungeonListing() {
        this.navCtrl.pop();
        // this.watch.unsubscribe();
        this.navCtrl.push(DungeonListingPage);

    }
    goGroups() {
        this.navCtrl.pop();
        this.navCtrl.push(GroupsPage);
    }


}
