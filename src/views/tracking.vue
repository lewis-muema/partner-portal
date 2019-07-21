<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="map-div" id="map_area"></div>
    <div
      class="vehicles-tracking-dashboard__controls vehicles-tracking-dashboard__controls--left-control"
      id="vehicles-tracking-dashboard--left-control"
      @click="showTrackingVendors()"
    >
      <i class="vehicles-tracking-icons fa fa-chevron-right"></i>
    </div>
    <div class="selector" id="vehicles-tracking-dashboard">
      <div class="selector--title selector--title__left" v-if="availableVendors.length > 0">
        <span v-for="availableVendor in availableVendors" :key="availableVendor.rider_id">
          <label class="vendor-name">
            <input
              type="checkbox"
              class="vendor-check"
              :value="availableVendor.vendor_type"
              checked
              @click="senseChecked(availableVendor.vendor_type, $event)"
            />
            {{ availableVendor.vendor_disp_name }}
          </label>
        </span>
      </div>
      <div class="selector--title selector--title__left" v-else>Vehicle Tracking</div>
      <div class="selector--content">
        <div v-if="ridersWithTrackers.length > 0">
          <div
            class="selector--checkbox"
            @click="senseClick(ridersWithTracker.indexer)"
            v-for="ridersWithTracker in ridersWithTrackers"
            :key="ridersWithTracker.rider_id"
          >
            <p class="hide" :class="`vehicle-index${ridersWithTracker.indexer}`">true</p>
            <img
              src="https://images.sendyit.com/partner_portal/images/partnerTruck.jpg"
              class="truck-img"
            />
            <label>
              <span
                class="selector--checkbox-info"
              >{{ ridersWithTracker.rider_details.registration_no }}</span>
            </label>
            <span class="selector--checkbox-info font-14">
              Driver:
              <label class="spacer"></label>
              {{ ridersWithTracker.rider_details.f_name }} {{ ridersWithTracker.rider_details.s_name }}; {{ ridersWithTracker.rider_details.phone_no }}
            </span>
            <span
              class="selector--checkbox-info font-14"
              :class="`speed${ridersWithTracker.indexer}`"
            >
              Speed:
              <label class="spacer2"></label>
              {{ ridersWithTracker.speed }} Kmph
            </span>
            <span
              class="selector--checkbox-info font-14 checkbox-time"
              :class="`time${ridersWithTracker.indexer}`"
            >
              Tracker:
              <label class="spacer3"></label>
              {{ getTrackerStatus(ridersWithTracker.time, ridersWithTracker.indexer) }}
              <p
                class="font-14 checkbox-time extra-info"
              >{{ addTrackerStatusInfo(ridersWithTracker.time) }}</p>
            </span>
          </div>
        </div>
        <div class="vehicle-tracking-info" v-else>
          You do not currently have a Sendy issued tracker installed on your vehicle.
          <br />Get in touch with our
          <a
            href="mailto:support@sendyit.com"
            class="color-orange"
          >Partner Management Team</a> to get one today.
        </div>
      </div>
    </div>
    <div
      class="vehicles-tracking-dashboard__controls vehicles-tracking-dashboard__controls--right-control"
      id="vehicles-tracking-dashboard--right-control"
      @click="hideTrackingVendors()"
    >
      <i class="vehicles-tracking-icons fa fa-chevron-left"></i>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
import moment from 'moment';
import mqtt from 'mqtt';
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';

let client = '';

let map = '';
let bounds = '';
const loopInterval = [];
const clientIdArray = [];

export default {
  title: 'Partner Portal - Tracking',
  components: {
    verifier,
    errorHandler,
  },
  data() {
    return {
      extraInfo: '',
      trackerStatus: '',
      ridersWithTrackers: [],
      collection: '',
      availableVendors: [],
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      errorObj: '',
    };
  },
  created() {
    if (localStorage.sessionData) {
      this.loadMapScript();
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const riders = [];
      const riderIds = [];
      const payload = {
        owner_id: this.sessionInfo.id,
      };
      const lastPositionPayload = {
        rider_id: riderIds,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/owner_drivers`, payload, this.config)
        .then(response => {
          if (response.data.status) {
            response.data.riders.forEach((row, i) => {
              riderIds.push(row.rider_id);
              riders.push(row);
            });
          }
        })
        .then(() => {
          axios
            .post(`${process.env.VUE_APP_AUTH}v1/last_partner_position`, lastPositionPayload, this.config)
            .then(response => {
              if (response.data.status) {
                const vendorArray = [];
                response.data.partnerArray.forEach((row, i) => {
                  const filterObject = riders.filter(e => e.rider_id === row.rider_id);
                  if (filterObject.length > 0) {
                    row.rider_details = filterObject[0];
                    this.ridersWithTrackers.push(row);
                    const vendorDetails = {
                      vendor_type: row.rider_details.vendor_type,
                      vendor_disp_name: row.rider_details.vendor_disp_name,
                    };
                    if (!vendorArray.includes(row.rider_details.vendor_type)) {
                      vendorArray.push(row.rider_details.vendor_type);
                      this.availableVendors.push(vendorDetails);
                    }
                  }
                });
                this.setMarkers();
              }
            })
            .catch(error => {
              this.errorObj = error.response;
            });
        })
        .catch(error => {
          this.errorObj = error.response;
        });
    }
  },
  beforeDestroy() {
    this.ridersWithTrackers.forEach((row, i) => {
      client.unsubscribe(`partner_app_positions/${this.get_driver_city_and_tracking_no(this.ridersWithTrackers[i].sim_card_sn, this.ridersWithTrackers[i].partner_city_id)}`, {
        qos: 0,
      });
    });
    loopInterval.forEach(clearInterval);
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
      const mapcenter = { lat: -1.300212, lng: 36.772916 };
      const mapOptions = {
        mapTypeId: 'roadmap',
        zoom: 13,
        center: new google.maps.LatLng(mapcenter),
        disableDefaultUI: true,
      };
      map = new google.maps.Map(document.getElementById('map_area'), mapOptions);
      bounds = new google.maps.LatLngBounds();
    },
    getTrackerStatus(time, i) {
      const timeDiff = new Date().getTime() - new Date(time);
      if (timeDiff / 1000 < 1800) {
        return 'Online';
      } else if (timeDiff / 1000 > 1800 && timeDiff / 1000 < 3600) {
        return `Last seen ${Math.round(timeDiff / 60 / 1000, 10)} minutes ago`;
      } else {
        return 'Offline';
      }
    },
    addTrackerStatusInfo(time) {
      const timeDiff = new Date().getTime() - new Date(time);
      if (timeDiff / 1000 < 1800) {
        // return 'Online';
      } else if (timeDiff / 1000 > 1800 && timeDiff / 1000 < 3600) {
        // return `Last seen ${Math.round(timeDiff / 60 / 1000, 10)} minutes ago`;
      } else {
        return '(This could be due to network issues)';
      }
    },
    setMarkers() {
      for (let i = 0; i < this.ridersWithTrackers.length; i++) {
        const icon = {
          url: `https://images.sendyit.com/web_platform/vendor_type/top/${this.ridersWithTrackers[i].rider_details.vendor_type}.png`,
          scaledSize: new google.maps.Size(50, 50),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0),
        };
        const marker = new google.maps.Marker({
          position: { lat: this.ridersWithTrackers[i].lat, lng: this.ridersWithTrackers[i].lng },
          map,
          icon,
        });
        map.initialZoom = true;
        bounds.extend({ lat: this.ridersWithTrackers[i].lat, lng: this.ridersWithTrackers[i].lng });
        map.fitBounds(bounds);
        const date = new Date(this.ridersWithTrackers[i].time);
        const contentString = `${'<div class="vendor--infowindow-content"><div class="">'}${this.ridersWithTrackers[i].rider_details.registration_no}</div></div>`;

        marker['infowindow'] = new google.maps.InfoWindow({
          content: contentString,
        });
        this.ridersWithTrackers[i].indexer = i;

        // eslint-disable-next-line no-loop-func
        google.maps.event.addListener(map, 'zoom_changed', () => {
          const zoomChangeBoundsListener = google.maps.event.addListener(map, 'bounds_changed', event => {
            if (map.getZoom() > 15 && map.initialZoom) {
              // Change max/min zoom here
              map.setZoom(15);
              map.initialZoom = false;
            }
            google.maps.event.removeListener(zoomChangeBoundsListener);
          });
        });
        this.ridersWithTrackers[i].infowindow = false;
        // eslint-disable-next-line no-loop-func
        google.maps.event.addListener(marker, 'click', () => {
          const parent = document.querySelector(`.vehicle-index${i}`).parentNode;
          document.querySelector(`.vehicle-index${i}`).innerHTML = false;
          parent.style.borderLeftStyle = 'solid';
          parent.style.borderLeftColor = '#0082cc';
          parent.style.borderLeftWidth = '10px';
          marker['infowindow'].open(map, marker);
          this.ridersWithTrackers[i].infowindow = true;
        });
        google.maps.event.addListener(marker['infowindow'], 'closeclick', () => {
          const parent = document.querySelector(`.vehicle-index${i}`).parentNode;
          document.querySelector(`.vehicle-index${i}`).innerHTML = true;
          parent.style.borderLeftStyle = 'none';
          this.ridersWithTrackers[i].infowindow = false;
        });
        this.ridersWithTrackers[i].marker = marker;
        this.ridersWithTrackers[i].checked = true;
        this.ridersWithTrackers[i].lastSeen = this.ridersWithTrackers[i].time;
        const singleInterval = setInterval(this.loopTimer, 60000, i);
        loopInterval.push(singleInterval);
        this.connect_mqtt(i);
      }
    },
    senseClick(i) {
      const parent = document.querySelector(`.vehicle-index${i}`).parentNode;
      const driverState = JSON.parse(document.querySelector(`.vehicle-index${i}`).innerHTML);
      const selected = i;
      if (!driverState) {
        parent.style.borderLeftStyle = 'none';
        this.ridersWithTrackers[i].marker.infowindow.close();
        this.ridersWithTrackers[i].infowindow = false;
        document.querySelector(`.vehicle-index${i}`).innerHTML = true;
      } else {
        parent.style.borderLeftStyle = 'solid';
        parent.style.borderLeftColor = '#0082cc';
        parent.style.borderLeftWidth = '10px';
        this.ridersWithTrackers[i].marker.infowindow.open(map, this.ridersWithTrackers[i].marker);
        this.ridersWithTrackers[i].infowindow = true;
        document.querySelector(`.vehicle-index${i}`).innerHTML = false;
      }
    },
    senseChecked(data, event) {
      if (event.target.checked) {
        for (let x = 0; x < this.ridersWithTrackers.length; x++) {
          if (this.ridersWithTrackers[x].rider_details.vendor_type === data) {
            this.ridersWithTrackers[x].marker.setMap(map);
            this.ridersWithTrackers[x].checked = true;
            if (this.ridersWithTrackers[x].infowindow) {
              this.ridersWithTrackers[x].marker.infowindow.open(map, this.ridersWithTrackers[x].marker);
            } else {
              this.ridersWithTrackers[x].marker.infowindow.close();
            }
          }
        }
      } else {
        for (let x = 0; x < this.ridersWithTrackers.length; x++) {
          if (this.ridersWithTrackers[x].rider_details.vendor_type === data) {
            this.ridersWithTrackers[x].marker.setMap(null);
            this.ridersWithTrackers[x].checked = false;
          }
        }
      }
    },
    connect_mqtt(i) {
      const clientId = `mqttjs_wtp_${Math.random()
        .toString(16)
        .substr(2, 8)}_${Math.random()}_${new Date().getTime()}`;
      const host = 'wss://chat.sendyit.com:443';
      const options = {
        keepalive: 10,
        clientId,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        will: {
          topic: 'WillMsg',
          payload: 'Connection Closed abnormally..!',
          qos: 0,
          retain: false,
        },
        username: 'sendy',
        password: '93a3a43dbac9ddd362702fb525b42a2d',
        rejectUnauthorized: false,
      };
      client = mqtt.connect(host, options);

      client.on('error', err => {
        console.log(err);
        client.end();
      });

      client.on('connect', () => {
        console.log(`client connected:${clientId}`);
      });
      client.on('disconnect', () => {
        console.log(`${clientId} disconnected`);
      });

      client.subscribe(`partner_app_positions/${this.get_driver_city_and_tracking_no(this.ridersWithTrackers[i].sim_card_sn, this.ridersWithTrackers[i].partner_city_id)}`, {
        qos: 0,
      });

      client.on('message', (topic, message, packet) => {
        this.setRealTimeTracker(i, JSON.parse(message));
        this.setWindowVar(i, JSON.parse(message));
      });

      client.on('end', () => {
        console.log('connection ended');
      });

      client.on('close', () => {
        console.log(`${clientId} disconnected`);
      });
      clientIdArray.push(`partner_app_positions/${this.get_driver_city_and_tracking_no(this.ridersWithTrackers[i].sim_card_sn, this.ridersWithTrackers[i].partner_city_id)}`);
    },
    get_driver_city_and_tracking_no(tracking_no, city_id) {
      let city_code = '';
      if (city_id === 1) {
        city_code = 'ke-nairobi';
      } else if (city_id === 2) {
        city_code = 'ke-mombasa';
      } else if (city_id === 3) {
        city_code = 'ke-thika';
      } else if (city_id === 4) {
        city_code = 'ke-nakuru';
      } else if (city_id === 5) {
        city_code = 'ke-kisumu';
      } else {
        city_code = 'ke-nairobi';
      }
      return `${city_code}/${tracking_no}`;
    },
    hideTrackingVendors() {
      $('#vehicles-tracking-dashboard').hide();
      $('#vehicles-tracking-dashboard--right-control').hide();
      $('#vehicles-tracking-dashboard--left-control').show();
    },
    showTrackingVendors() {
      $('#vehicles-tracking-dashboard').show();
      $('#vehicles-tracking-dashboard--right-control').show();
      $('#vehicles-tracking-dashboard--left-control').hide();
    },
    setRealTimeTracker(i, data) {
      const icon = {
        url: `https://images.sendyit.com/web_platform/vendor_type/top/${this.ridersWithTrackers[i].rider_details.vendor_type}.png`,
        scaledSize: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      };
      const marker = new google.maps.Marker({
        position: { lat: data.lat, lng: data.lng },
        map,
        icon,
      });
      const contentString = `${'<div class="vendor--infowindow-content"><div class="">'}${this.ridersWithTrackers[i].rider_details.registration_no}</div></div>`;

      marker['infowindow'] = new google.maps.InfoWindow({
        content: contentString,
      });
      if (this.ridersWithTrackers[i].infowindow && this.ridersWithTrackers[i].checked) {
        marker['infowindow'].open(map, marker);
      }
      google.maps.event.addListener(marker, 'click', () => {
        const parent = document.querySelector(`.vehicle-index${i}`).parentNode;
        document.querySelector(`.vehicle-index${i}`).innerHTML = false;
        parent.style.borderLeftStyle = 'solid';
        parent.style.borderLeftColor = '#0082cc';
        parent.style.borderLeftWidth = '10px';
        marker['infowindow'].open(map, marker);
        this.ridersWithTrackers[i].infowindow = true;
      });
      google.maps.event.addListener(marker['infowindow'], 'closeclick', () => {
        const parent = document.querySelector(`.vehicle-index${i}`).parentNode;
        document.querySelector(`.vehicle-index${i}`).innerHTML = true;
        parent.style.borderLeftStyle = 'none';
        this.ridersWithTrackers[i].infowindow = false;
      });
      if (this.ridersWithTrackers[i].checked) {
        this.ridersWithTrackers[i].marker.setMap(null);
        this.ridersWithTrackers[i].marker = marker;
        this.ridersWithTrackers[i].marker.setMap(map);
      } else {
        this.ridersWithTrackers[i].marker = marker;
        this.ridersWithTrackers[i].marker.setMap(null);
      }
    },
    setWindowVar(i, data) {
      const speedEl = document.querySelector(`.speed${i}`);
      const timeEl = document.querySelector(`.time${i}`);
      if (speedEl && timeEl && this.ridersWithTrackers.length > 0) {
        speedEl.innerHTML = `Speed: <label class="spacer2"></label>${Math.round(data.speed * 10) / 10} Kmph`;
        const timeDiff = new Date(data.time) - new Date(this.ridersWithTrackers[i].lastSeen);
        if (timeDiff / 1000 < 1800) {
          timeEl.innerHTML = 'Tracker: <label class="spacer3"></label>Online';
        } else if (timeDiff / 1000 > 1800 && timeDiff / 1000 < 3600) {
          timeEl.innerHTML = `Tracker: <label class="spacer3"></label>Last seen ${Math.round(timeDiff / 60 / 1000, 10)} minutes ago`;
        } else {
          timeEl.innerHTML = 'Tracker: <label class="spacer3"></label>Offline <p class="font-14 checkbox-time extra-info">(This could be due to network issues)</p>';
        }
      }

      this.ridersWithTrackers[i].lastSeen = data.time;
    },
    loopTimer(i) {
      const timeEl = document.querySelector(`.time${i}`);
      if (timeEl && this.ridersWithTrackers.length > 0) {
        const timeDiff = new Date().getTime() - new Date(this.ridersWithTrackers[i].lastSeen);
        if (timeDiff / 1000 < 1800) {
          timeEl.innerHTML = 'Tracker: <label class="spacer3"></label>Online';
        } else if (timeDiff / 1000 > 1800 && timeDiff / 1000 < 3600) {
          timeEl.innerHTML = `Tracker: <label class="spacer3"></label>Last seen ${Math.round(timeDiff / 60 / 1000, 10)} minutes ago`;
        } else {
          timeEl.innerHTML = 'Tracker: <label class="spacer3"></label>Offline <p class="font-14 checkbox-time extra-info">(This could be due to network issues)</p>';
        }
      }
    },
  },
};
</script>

<style>
</style>
