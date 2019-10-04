<template>
  <div>
    <div class="map-div" id="map_zone"></div>
    <div class="load-details">
      <p class="loading-text">{{ text }}</p>
      <div class="loading" v-if="loadingStatus" style="margin: 0;"></div>
    </div>
    <div class="controls">
      <span class="tooltipcontrol Decrease">Decrease speed</span>
      <span class="tooltipcontrol Rewind">Rewind</span>
      <span class="tooltipcontrol Play">Play</span>
      <span class="tooltipcontrol Pause">Pause</span>
      <span class="tooltipcontrol Fast">Fast forward</span>
      <span class="tooltipcontrol Increase">Increase speed</span>
    </div>
    <div class="controls">
      <img
        src="https://images.sendyit.com/partner_portal/images/rewind.png"
        class="decrease-speed tracker-icon"
        @click="markerSlow()"
        @mouseover="ToolTip('Decrease', 1)"
        @mouseout="ToolTip('Decrease', 0)"
      />
      <img
        src="https://images.sendyit.com/partner_portal/images/back.png"
        class="previous tracker-icon"
        @click="markerPrevious()"
        @mouseover="ToolTip('Rewind', 1)"
        @mouseout="ToolTip('Rewind', 0)"
      />
      <img
        src="https://images.sendyit.com/partner_portal/images/play-button.png"
        class="play tracker-icon"
        @click="markerPlay()"
        @mouseover="ToolTip('Play', 1)"
        @mouseout="ToolTip('Play', 0)"
      />
      <img
        src="https://images.sendyit.com/partner_portal/images/pause.png"
        class="pause tracker-icon"
        @click="markerPause()"
        @mouseover="ToolTip('Pause', 1)"
        @mouseout="ToolTip('Pause', 0)"
      />
      <img
        src="https://images.sendyit.com/partner_portal/images/next.png"
        class="next tracker-icon"
        @click="markerNext()"
        @mouseover="ToolTip('Fast', 1)"
        @mouseout="ToolTip('Fast', 0)"
      />
      <img
        src="https://images.sendyit.com/partner_portal/images/fast-forward.png"
        class="increase-speed tracker-icon"
        @click="markerFast()"
        @mouseover="ToolTip('Increase', 1)"
        @mouseout="ToolTip('Increase', 0)"
      />
    </div>
    <div class="labels name">{{ name }}</div>
    <div class="labels phone">{{ phone }}</div>
    <div class="labels time" v-if="time">{{ getTime() }}</div>
    <div class="labels date" v-if="time">{{ getDate() }}</div>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { TravelMarker, TravelMarkerOptions, TravelData, TravelEvents, EventType } from 'travel-marker';
import axios from 'axios';
import moment from 'moment';
import $ from 'jquery';
// let client = '';
let map = '';
let bounds = '';
const loopInterval = [];
const clientIdArray = [];
let rewindInterval = '';
let fastForwardInterval = '';
export default {
  data() {
    return {
      marker: '',
      positions: [],
      count: '',
      time: '',
      name: '',
      phone: '',
      multiplier: 5,
      text: '',
      loadingStatus: true,
    };
  },
  created() {
    if (this.$route.params.id !== undefined && this.$route.params.fromdate !== undefined && this.$route.params.todate !== undefined) {
      let url;
      const payload = {
        partner_id: this.$route.params.id,
        start_date: `${this.$route.params.fromdate}`,
        end_date: `${this.$route.params.todate}`,
      };
      axios.post('https://auth.sendyit.com/positions/track_partner', payload).then(response => {
        if (response.data.status) {
          this.positions = response.data.positions;
          this.count = this.positions.length;
          this.name = this.positions[0].name;
          this.phone = this.positions[0].phone_no;
          this.time = this.positions[0].time;
          this.loadMapScript();
        } else {
          this.loadingStatus = false;
          if (response.data.reason) {
            this.text = response.data.reason;
          } else {
            this.text = 'No data has been returned';
          }
        }
      });
    } else {
      this.loadingStatus = false;
      this.text = 'Please provide all the parameters';
    }
  },
  mounted() {
    $('.login__logo').css('margin-left', '5%');
  },
  methods: {
    loadMapScript() {
      if (window.google && window.google.maps) {
        setTimeout(() => {
          this.initMap();
        }, 180);
      } else {
        const script = document.createElement('script');
        script.onload = () => {
          this.initMap();
        };
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyChEOAbj_2URQWRkL8N0p07vk6foBfHXGI';
        document.head.appendChild(script);
      }
    },
    initMap() {
      const mapcenter = { lat: this.positions[0].latitude, lng: this.positions[0].longitude };
      const mapOptions = {
        mapTypeId: 'roadmap',
        zoom: 15,
        center: new google.maps.LatLng(mapcenter),
        panControl: true,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        overviewMapControl: true,
        rotateControl: true,
      };
      map = new google.maps.Map(document.getElementById('map_zone'), mapOptions);
      bounds = new google.maps.LatLngBounds();
      map.addListener('tilesloaded', () => {
        this.loadingStatus = false;
      });
      this.playTracker();
    },
    playTracker() {
      const options = {
        map, // map object
        speed: this.multiplier, // default 10 , animation speed
        interval: 30, // default 10, marker refresh time
        speedMultiplier: 50, // default 1, for fast-forward/rewind
        cameraOnMarker: true, // default false, move camera with marker
        markerType: 'overlay', // default: 'default'
        overlayOptions: {
          offsetX: 0, // default: 0, x-offset for overlay
          offsetY: 0, // default: 0, y-offset for overlay
          offsetAngle: 0, // default: 0, rotation-offset for overlay
          imageUrl: `https://images.sendyit.com/web_platform/vendor_type/top/${this.positions[0].vendor_type}.png`, // image used for overlay
          imageWidth: 36, // image width of overlay
          imageHeight: 58, // image height of overlay
        },
      };
      this.marker = new TravelMarker(options);
      const locationArray = [];
      this.positions.forEach(entry => {
        const gMap = new google.maps.LatLng(`${entry.latitude}`, `${entry.longitude}`);
        locationArray.push(gMap);
      });
      this.marker.addLocation(locationArray);
      this.checkTime();
    },
    markerPlay() {
      clearInterval(rewindInterval);
      clearInterval(fastForwardInterval);
      rewindInterval = '';
      fastForwardInterval = '';
      this.marker.pause();
      setTimeout(() => {
        this.marker.play();
      }, 200);
    },
    markerPause() {
      clearInterval(rewindInterval);
      clearInterval(fastForwardInterval);
      rewindInterval = '';
      fastForwardInterval = '';
      this.marker.pause();
    },
    markerFast() {
      if (this.multiplier >= 5) {
        this.multiplier = this.multiplier + 5;
      } else {
        this.multiplier = 5;
      }
      setTimeout(() => {
        this.marker.setSpeed(this.multiplier);
      }, 200);
    },
    markerSlow() {
      if (this.multiplier > 5) {
        this.multiplier = this.multiplier - 5;
      } else {
        this.multiplier = 1;
      }
      setTimeout(() => {
        this.marker.setSpeed(this.multiplier);
      }, 200);
    },
    markerNext() {
      this.markerPause();
      fastForwardInterval = setInterval(() => {
        const multiplier = 10000000;
        const divider = 0.0000001;
        const latitude = Math.floor(this.marker.getPosition().lat() * multiplier) / multiplier;
        const longitude = Math.floor(this.marker.getPosition().lng() * multiplier) / multiplier;
        this.marker.next();
        if (latitude <= this.positions[this.count - 1].latitude + divider && latitude >= this.positions[this.count - 1].latitude - divider && (longitude <= this.positions[this.count - 1].longitude + divider && longitude >= this.positions[this.count - 1].longitude - divider)) {
          clearInterval(fastForwardInterval);
          fastForwardInterval = '';
        }
      }, 500);
    },
    markerPrevious() {
      this.markerPause();
      rewindInterval = setInterval(() => {
        const multiplier = 10000000;
        const divider = 0.0000001;
        const latitude = Math.floor(this.marker.getPosition().lat() * multiplier) / multiplier;
        const longitude = Math.floor(this.marker.getPosition().lng() * multiplier) / multiplier;
        this.marker.prev();
        if (latitude <= this.positions[0].latitude + divider && latitude >= this.positions[0].latitude - divider && (longitude <= this.positions[0].longitude + divider && longitude >= this.positions[0].longitude - divider)) {
          clearInterval(rewindInterval);
          rewindInterval = '';
        }
      }, 500);
    },
    checkTime() {
      this.marker.event.onEvent((event, data) => {
        this.time = this.positions[data.index].time;
      });
    },
    getTime() {
      const time = moment(this.time).format('h:mm:ss a');
      return time;
    },
    getDate() {
      const date = moment(this.time).format('MMMM Do YYYY');
      return date;
    },
    ToolTip(classname, action) {
      $(`.${classname}`).css('opacity', action);
    },
  },
};
</script>

<style>
</style>
