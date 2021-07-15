<template>
  <div id="bidding">
    <errorHandler :error="errorObj" v-if="errorObj" />

    <!-- BID SUCCESS MESSAGE -->
    <div class="bid-status-ok">
      <div class="bid-web-form">
        <div v-if="!rejected" v-show="success" class="success-card">
          <div>
            <span @click="success = false"> <i class="fas fa-check-circle"></i> </span>
            <span class="success-message">{{ $t('biddingWebForm.bid_successfully_submitted') }} </span>
          </div>
          <span @click="success = false"> <i class="fas fa-times lg"></i> </span>
        </div>

        <!-- BID DETAILS -->
        <h1 class="bid-heading">{{ $t('biddingWebForm.shipment_details') }}</h1>
        <div class="bid" v-if="Object.keys(formData).length > 0">
          <div class="webForm__map">
            <img :src="createStaticMapUrl()" class="map" id="map" />
          </div>

          <div class="bid-details">
            <span v-if="formData.quotation.status === 1" class="request-status review">{{ $t('biddingWebForm.under_review') }}</span>
            <span v-else-if="formData.quotation.status === 2" class="request-status accepted">{{ $t('biddingWebForm.awarded') }}</span>

            <div class="bid-details-shipment">
              <div class="bid-information">
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.pickup') }}</h2>
                <p class="bid-details-content">{{ formData.pickup.name }}</p>
                <h2 class="bid-details-content small-font">{{ $t('biddingWebForm.load_picked_at') }} {{ formData.pickup_facility }}</h2>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.destination') }}</h2>
                <p class="bid-details-content">{{ formData.destination.name }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.type_of_load') }}</h2>
                <p class="bid-details-content">{{ formData.carrier_type }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.date_of_pickup') }}</h2>
                <p class="bid-details-content">{{ formData.pickup_time }}</p>
                <div v-show="formData.cargo_type_options.length > 1">
                  <h2 class="bid-details-subheading">{{ $t('biddingWebForm.number_of_trucks_wanted') }}</h2>
                  <p class="bid-details-content">{{ formData.total_trucks }} {{ $t('biddingWebForm.trucks') }}</p>
                </div>
              </div>
              <hr />

              <div class="bid-details-truck">
                <div v-show="formData.cargo_type_options.length < 1">
                  <h2 class="bid-details-subheading">{{ $t('biddingWebForm.number_of_trucks_wanted') }}</h2>
                  <p class="bid-details-content">{{ formData.total_trucks }} {{ $t('biddingWebForm.trucks') }}</p>
                </div>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.type_of_truck') }}</h2>
                <p class="bid-details-content">{{ formData.cargo_type }}</p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.weight_of_load') }}</h2>
                <p class="bid-details-content">{{ formData.tonnes_per_truck }} {{ $t('biddingWebForm.tonnes') }}</p>

                <div v-if="formData.cargo_type_options.length > 1">
                  <h2 class="bid-details-subheading">{{ $t('biddingWebForm.return_container') }}</h2>
                  <p class="bid-details-content">{{ formData.cargo_type_options[0].value === 'true' ? this.$t('biddingWebForm.yes_containers_returned') : this.$t('biddingWebForm.no_containers_returned') }}</p>
                  <p class="bid-details-subheading">{{ $t('biddingWebForm.no_of_20_containers_moved') }}</p>
                  <h2 class="bid-details-content">{{ formData.cargo_type_options[1].value }}</h2>
                  <p class="bid-details-subheading">{{ $t('biddingWebForm.no_of_40_containers_moved') }}</p>
                  <h2 class="bid-details-content">{{ formData.cargo_type_options[2].value }}</h2>
                </div>
                <div v-if="formData.offer_amount > 0 && formData.is_negotiable">
                  <h2 class="bid-details-subheading">{{ $t('biddingWebForm.clients_price_offer') }}</h2>
                  <p class="bid-details-content">
                    <b>{{ formData.currency }}</b> {{ formData.offer_amount }}
                  </p>
                </div>
              </div>
            </div>

            <hr />
            <div v-if="initialSubmit === true">
              <div v-if="rejected">
                <p class="bid-details-content">{{ $t('biddingWebForm.successfully_rejected_bid') }}</p>
                <i>
                  <p class="timestamp">{{ $t('biddingWebForm.forfeit_submitted') }} {{ new Date().toLocaleString() }}</p>
                </i>
              </div>
              <div v-else>
                <h2 class="bid-submitted-heading">{{ $t('biddingWebForm.your_bids') }}</h2>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.trucks_available') }}</h2>
                <p class="bid-details-content">
                  <span v-if="formData.is_negotiable !== true">{{ formData.quotation.trucks_available }}</span><span v-else>{{ bidInfo.available_trucks }}</span> {{ bidInfo.available_trucks === 1 ? 'Truck' : 'Trucks' }}
                </p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.bid_amount_per_truck') }}</h2>
                <p class="bid-details-content">
                  {{ formData.currency }} <span v-if="formData.is_negotiable !== false">{{ bidInfo.amount_per_truck }}</span><span v-else> {{ formData.offer_amount }}</span>
                </p>
                <h2 class="bid-details-subheading">{{ $t('biddingWebForm.total_bid_amount') }}</h2>
                <p class="bid-details-content">
                  <span v-if="formData.is_negotiable !== false">{{ formData.currency }} {{ bidInfo.available_trucks * bidInfo.amount_per_truck }}</span> <span v-else>{{ formData.currency }} {{ bidInfo.available_trucks * formData.offer_amount }} </span>
                </p>
                <p class="shipment-heading">
                  <i>{{ $t('biddingWebForm.bid_submitted_on') }}{{ new Date().toLocaleString() }}</i>
                </p>
              </div>
            </div>
            <div v-else>
              <div class="bidForm" v-if="formData.quotation.status === 0">
                <div class="expired" v-if="expired">
                  <i class="far fa-clock expired_icon"></i>
                  <p class="expired_msg">
                    <i>{{ $t('biddingWebForm.expired') }}</i>
                  </p>
                </div>
                <div v-else>
                  <div v-if="!formData.is_negotiable === false || formData.is_negotiable === null">
                    <h2 class="bid-details-content bid_description orange bold">{{ $t('biddingWebForm.enter_your_bid') }}</h2>
                  </div>
                  <div v-else>
                    <h2 class="bid-details-content orange bid_description bold">{{ $t('biddingWebForm.offer') }}</h2>
                    <div v-show="formData.offer_amount != null">
                      <p class="bid-details-content">{{ $t('biddingWebForm.clients_price_offer') }}</p>
                      <p class="bid-details-content bold pb-3">
                        <b>{{ formData.currency }}</b> {{ formData.offer_amount }} {{ $t('biddingWebForm.per_truck') }}
                      </p>
                    </div>
                  </div>
                  <p class="bid-details-content">{{ $t('biddingWebForm.trucks_available') }}</p>
                  <div class="bidForm__trucks">
                    <button class="bidForm__truckbtn left-radius" :disabled="bidDetails.available_trucks === 1" @click="bidDetails.available_trucks--"><i class="fas fa-minus minus-btn"></i></button>
                    <input class="bidding-form-trucks-input bid-input" type="number" placeholder="0" min="1" :value="bidDetails.available_trucks" />
                    <button class="bidForm__truckbtn right-radius" :disabled="bidDetails.available_trucks === formData.total_trucks" @click="bidDetails.available_trucks++"><i class="fas fa-plus"></i></button>
                  </div>
                  <span v-show="bidDetails.available_trucks < 1" class="alert">{{ $t('biddingWebForm.truck_cannot_be_less') }}</span>
                  <div v-show="!formData.is_negotiable === false || formData.is_negotiable === null" class="bidForm__currency">
                    <p class="bid-details-content">{{ $t('biddingWebForm.bid_amount_per_truck') }}</p>
                    <div class="shipmentCurrency__selector">
                      <select class="bidForm__selector" name="currency" id="currency">
                        <option>{{ formData.currency }}</option>
                      </select>
                      <input class="bidForm__input right-radius bid-input" type="number" v-model="bidDetails.amount_per_truck" />
                    </div>
                    <span v-show="amountAlert" class="alert">{{ $t('biddingWebForm.valid_amount') }}</span>
                    <span v-show="bidDetails.trucks_available < 1" class="alert">{{ $t('biddingWebForm.truck_cannot_be_less') }}</span>
                  </div>
                </div>
                <div v-show="!expired" class="bidForm__btn">
                  <button @click="show" class="bidForm__submitBtn bidForm__submitBtn--accept">
                    <span v-show="formData.is_negotiable === false">{{ $t('biddingWebForm.accept_offer') }}</span> <span v-show="formData.is_negotiable === true || formData.is_negotiable === null">{{ $t('biddingWebForm.accept_bid') }}</span>
                  </button>
                  <button @click="showDecline()" class="bidForm__submitBtn bidForm__submitBtn--decline">
                    <span v-show="!negotiable">{{ $t('biddingWebForm.decline_offer') }}</span> <span v-show="negotiable">{{ $t('biddingWebForm.decline_bid') }}</span>
                  </button>
                </div>
              </div>
              <div v-else>
                <div v-if="formData.quotation.status !== -1">
                  <h2 class="submitted__card ">
                    <span class=" bid-details-content orange" v-if="formData.is_negotiable !== false">{{ $t('biddingWebForm.your_offer') }}</span><span class="bid-submitted-heading" v-else>{{ $t('biddingWebForm.your_bids') }}</span>
                  </h2>
                  <p>
                    <span v-if="formData.is_negotiable != false" class="bid-details-content">{{ $t('biddingWebForm.bid_amount_per_truck') }}</span><span v-else class="bid-details-content">{{ $t('biddingWebForm.clients_price_offer_per_truck') }} </span>
                  </p>
                  <p class="bid-details-content bold pb-3">
                    {{ formData.currency }}
                    <span class="bid-details-content bold pb-3">{{ formData.quotation.price_per_truck }}</span>
                  </p>
                  <p class="bid-details-content">{{ $t('biddingWebForm.how_many_trucks') }}</p>
                  <p class="bid-details-content bold pb-3">{{ formData.quotation.trucks_available }} {{ $t('biddingWebForm.trucks') }}</p>
                  <p class="bid-details-content">{{ $t('biddingWebForm.total_bid_amount') }}</p>
                  <p class="bid-details-content bold pb-3">{{ formData.currency }} {{ formData.quotation.price_per_truck * formData.quotation.trucks_available }}</p>
                </div>
                <div v-else>
                  <p class="bid-submitted-heading">{{ $t('biddingWebForm.rejected') }}</p>
                  <p class="bid-details-subheading">
                    <i>{{ $t('biddingWebForm.unfortunately_rejected') }}</i>
                  </p>
                </div>
                <hr />
              </div>
            </div>
          </div>
        </div>
        <!-- MODALs -->
        <modal name="bid-details-modal" class="bid-details-modal" :height="450" transition="slide" :pivot-y="0" :pivot-x="0.45">
          <div class="decline__modal">
            <div class="modal-head">
              <h2 class="modal__heading">{{ $t('biddingWebForm.confirm_offer') }}</h2>
              <i @click="hide('bid-details-modal')" class="fas fa-times fa-2x"></i>
            </div>
            <p class="bid-details-subheading">{{ $t('biddingWebForm.how_many_trucks') }}</p>
            <p class="bid-details-content bold">{{ bidDetails.available_trucks }} {{ $t('biddingWebForm.trucks') }}</p>
            <div>
              <p class="bid-details-subheading" v-if="formData.is_negotiable">{{ $t('biddingWebForm.bid_amount_per_truck') }}</p>
              <p class="bid-details-subheading" v-else>{{ $t('biddingWebForm.clients_price_offer_per_truck') }}</p>
            </div>
            <p class="bid-details-content bold">
              <b>{{ formData.currency }}</b><span v-if="formData.is_negotiable === true">{{ bidDetails.amount_per_truck }}</span><span v-else>{{ formData.offer_amount }}</span>
            </p>
            <p class="bid-details-subheading">{{ $t('biddingWebForm.total_shipment_amount') }}</p>
            <p class="bid-details-content bold">
              <b>{{ formData.currency }}</b> <span v-if="formData.is_negotiable || formData.is_negotiable === null">{{ bidDetails.available_trucks * bidDetails.amount_per_truck }}</span><span v-else>{{ bidDetails.available_trucks * formData.offer_amount }}</span>
            </p>
            <div class="modal__btns">
              <button class="bidForm__submitBtn bidForm__submitBtn--accept" @click="bidOffer(1)">{{ $t('biddingWebForm.confirm_offer') }}</button>
              <span @click="hide('bid-details-modal')" class="orange">{{ $t('biddingWebForm.edit_bid') }}</span>
            </div>
          </div>
        </modal>
        <modal name="bid-details-modal-2" class="bid-details-modal" :height="700" transition="slide" :pivot-y="0" :pivot-x="0.45">
          <div class="decline__modal">
            <div class="modal-head">
              <h2 class="modal__heading">{{ $t('biddingWebForm.decline_bid') }}</h2>
              <i @click="hide('bid-details-modal-2')" class="fas fa-times fa-2x"></i>
            </div>
            <p class="shipment__details">{{ $t('biddingWebForm.reason_for_declining') }}</p>
            <span v-show="reasonNo" class="alert">{{ $t('biddingWebForm.select_reason') }}</span>
            <div>
              <ul class="decline__reasons">
                <div class="decline__reasons">
                  <el-checkbox-group v-model="declineRes" class="decline__reason" v-for="(decline, i) in declineOptions" :key="i">
                    <el-checkbox class="shipment__heading" :label="decline.reason" @change="i === 3 ? (otherReason = !otherReason) : ''"></el-checkbox>
                  </el-checkbox-group>
                  <textarea v-show="otherReason" class="reason_textarea" name="" id="" cols="30" rows="5" v-model="openReason" :placeholder="$t('biddingWebForm.enter_reason')"></textarea>
                </div>
              </ul>
              <div class="modal__btns">
                <button class="bidForm__submitBtn bidForm__submitBtn--accept" @click="declineRes.length < 1 ? (reasonNo = true) : bidOffer(-1)">{{ $t('biddingWebForm.decline_bid') }}</button>
                <span @click="hide('bid-details-modal-2')" class="orange cancel_reason">{{ $t('biddingWebForm.cancel') }}</span>
              </div>
            </div>
          </div>
        </modal>
      </div>
    </div>
    <div v-show="mobilebanner" class="mobile-banner ">
      <div class="banner">
        <div class="banner-section">
          <i @click="mobilebanner = false" class="fas fa-times fa-lg mobile_banner-icon"></i>
          <p class="mobile-banner_msg">{{ $t('biddingWebForm.experience_is_better') }}</p>
        </div>
        <button class="mobile-banner-btn">
          <span class="btn_txt">
            <a :href="link">{{ $t('biddingWebForm.open_app') }}</a>
          </span>
        </button>
      </div>
    </div>
    <notify />
  </div>
</template>

<script>
import axios from 'axios';
import Mixpanel from 'mixpanel';
import VueI18n from 'vue-i18n';
import timezone from '../../mixins/timezone';
import notify from '../../components/notification';
import verifier from '../../components/verifier';
import errorHandler from '../../components/errorHandler';
import logInHeaderVue from '../../components/headers/logInHeader.vue';

const mixpanel = Mixpanel.init(process.env.MIXPANEL);

export default {
  title: 'Partner Portal - Freight Bidding Webform',
  components: {
    errorHandler,
    notify,
  },
  data() {
    return {
      auth: process.env.VUE_APP_AUTH,
      negotiable: false,
      bidDetails: {
        amount_per_truck: null,
        available_trucks: 1,
      },
      trucks: 0,
      amountAlert: false,
      bid_amount: null,
      total_amount: 0,
      otherReason: false,
      mobilebanner: false,
      declineRes: [],
      link: '',
      declineOptions: [],
      reasonsErr: false,
      openReason: '',
      deadline: '',
      rejectBid: null,
      rejected: false,
      bidInfo: {},
      reasonNo: false,
      submitted: false,
      initialSubmit: false,
      success: false,
      date: '',
      errObj: '',
      formData: {},
      requests: {},
      expired: false,
      url: '',
      val: 'en',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-language': this.$route.query.locale === undefined || this.$route.query.locale.length < 1 ? 'en-KE' : this.$route.query.locale,
        },
      },
      errorObj: '',
    };
  },
  mounted() {
    if (this.$route.params.shipment_id !== undefined && this.$route.params.owner_id !== undefined) {
      this.getBid();
      this.declineReasons();
      this.detectMobileDevice();
      this.formLang();
    }
  },
  methods: {
    formLang() {
      const lang = new Intl.Locale(this.$route.query.locale);
      const finalLang = lang.language;
      this.val = finalLang;
      this.detectLanguage();
    },
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    showDecline() {
      this.$modal.show('bid-details-modal-2');
    },
    show() {
      if (this.formData.is_negotiable === true && this.bidDetails.amount_per_truck < 10) {
        this.amountAlert = true;
        setTimeout(() => {
          this.amountAlert = false;
        }, 2000);
      } else {
        this.$modal.show('bid-details-modal');
      }
    },
    detectMobileDevice() {
      if (this.isAndroid()) {
        this.link = 'https://play.google.com/store/apps/details?id=com.sendyit.freight';
      }

      if (this.detectIOS()) {
        this.link = 'https://apps.apple.com/ke/app/sendy-freight/id1558197723';
      }
    },
    isMobile() {
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
        return true;
      } else {
        return false;
      }
    },
    isAndroid() {
      let resp = false;
      if (navigator.userAgent.match(/Android/i)) {
        resp = true;
      }
      return resp;
    },
    detectIOS() {
      let resp = false;
      if (navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)) {
        resp = true;
      }
      return resp;
    },
    hide(name) {
      this.rejectBid = false;
      this.$modal.hide(name);
    },

    submitBid() {
      this.hide('bid-details-modal');
    },
    createStaticMapUrl() {
      const google_key = process.env.GOOGLE_API_KEY;
      const from_cordinates = this.formData.pickup.coordinates;
      const to_cordinates = this.formData.destination.coordinates;
      return `https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|${from_cordinates}|${to_cordinates}&size=300x250&markers=color:0xF17F3A%7Clabel:P%7C
            ${from_cordinates}&markers=color:0x2c82c5%7Clabel:D%7C${to_cordinates}&key=${google_key}`;
    },
    async declineReasons() {
      axios.get(`${this.auth}freight-service/rejection_reasons?authkey=${process.env.BIDDING_API_KEY}`, this.config).then(res => {
        this.declineOptions = res.data.data;
      });
    },
    detectLanguage() {
      this.$i18n.locale = this.val;
      localStorage.setItem('language', this.val);
      localStorage.setItem('timeLocale', this.val);
    },
    async bidOffer(i) {
      this.hide('bid-details-modal');
      this.hide('bid-details-modal-2');
      this.initialSubmit = true;
      const decliners = [];
      if (i === 1) {
        this.bidInfo = {
          quotation_id: parseInt(this.$route.params.shipment_id, 0),
          amount_per_truck: parseInt(this.bidDetails.amount_per_truck, 0),
          available_trucks: this.bidDetails.available_trucks,
          transporter_id: this.$route.params.owner_id,
          status: 1,
        };
      } else if (i === -1) {
        this.rejected = true;

        for (let r = 0; r < this.declineRes.length; r++) {
          if (this.declineRes[r] === 'Other reason') {
            decliners.push({ reason_id: r + 1, reason: this.openReason });
          } else {
            decliners.push({ reason_id: r + 1, reason: null });
          }
        }
        this.bidInfo = {
          quotation_id: parseInt(this.$route.params.shipment_id, 0),
          transporter_id: this.$route.params.owner_id,
          status: -1,
          rejection_reasons: decliners,
        };
      }

      const payload = JSON.stringify(this.bidInfo);
      await axios
        .patch(`${this.auth}freight-service/shipments/quotations?authkey=${process.env.BIDDING_API_KEY}`, payload, this.config)
        .then(res => {
          if (res.status === 200) {
            this.success = true;
            const declineResponse = JSON.parse(payload);
            if (declineResponse.status === -1) {
              if (process.env.DOCKER_ENV === 'production') {
                mixpanel.track('Shipment Request Rejected', {
                  transporterId: this.$route.params.owner_id,
                  phone: this.formData.client_phone,
                  email: this.formData.transporter_user_email,
                  name: this.formData.quotation.name,
                  source: this.$route.query.utm_source,
                  shipmentId: parseInt(this.$route.params.shipment_id, 0),
                  quotationId: parseInt(this.formData.id, 0),
                  pickup: this.formData.pickup.name,
                  destination: this.formData.destination.name,
                  carrierType: this.formData.carrier_type,
                  cargoType: this.formData.cargo_type,
                  pickupFacility: this.formData.pickup_facility,
                  trucksNeeded: parseInt(this.formData.total_trucks, 0),
                  reason: this.bidInfo.rejection_reasons,
                  clientType: 'Web',
                  device: this.isMobile() ? 'mobile' : 'desktop',
                });
              }
            } else if (declineResponse.status === 1) {
              if (process.env.DOCKER_ENV === 'production') {
                mixpanel.track('Bid Placed', {
                  transporterId: this.$route.params.owner_id,
                  phone: this.formData.client_phone,
                  email: this.formData.transporter_user_email,
                  name: this.formData.quotation.name,
                  source: this.$route.query.utm_source,
                  shipmentId: parseInt(this.$route.params.shipment_id, 0),
                  quotationId: parseInt(this.formData.id, 0),
                  pickup: this.formData.pickup.name,
                  destination: this.formData.destination.name,
                  carrierType: this.formData.carrier_type,
                  cargoType: this.formData.cargo_type,
                  pickupFacility: this.formData.pickup_facility,
                  trucksNeeded: parseInt(this.formData.total_trucks, 0),
                  clientType: 'Web',
                  device: this.isMobile() ? 'mobile' : 'desktop',
                });
              }
            }
          }
        })
        .catch(err => {
          this.errObj = err;
        });
    },
    async getBid() {
      axios
        .get(`${this.auth}freight-service/shipments/quotations/${this.$route.params.shipment_id}/${this.$route.params.owner_id}?authkey=${process.env.BIDDING_API_KEY}`)
        .then(res => {
          this.requests = res;
          this.formData = res.data.data;
          if (new Date(this.formData.bidding_deadline).getTime() - new Date().getTime() < 0) {
            this.expired = true;
          }
          if (this.isMobile()) {
            this.mobilebanner = true;
          }
          if (this.formData.quotation.status === 0) {
            this.submitted = false;
            if (process.env.DOCKER_ENV === 'production') {
              mixpanel.people.set_once({
                'Transporter Id': this.$route.params.owner_id,
                $name: res.data.data.quotation.name,
                $email: res.data.data.transporter_user_email,
                $phone: res.data.data.transporter_user_phone,
              });

              mixpanel.identify(this.$route.params.owner_id);
            }
          } else {
            this.submitted = true;
          }
          if (res.status === 200) {
            if (process.env.DOCKER_ENV === 'production') {
              mixpanel.track('Shipment Request Viewed', {
                transporterId: this.$route.params.owner_id,
                phone: res.data.data.transporter_user_phone,
                email: res.data.data.transporter_user_email,
                name: res.data.data.quotation.name,
                source: this.$route.query.utm_source,
                shipmentId: parseInt(this.$route.params.shipment_id, 0),
                quotationId: parseInt(res.data.data.id, 0),
                pickup: res.data.data.pickup.name,
                destination: res.data.data.destination.name,
                carrierType: res.data.data.carrier_type,
                cargoType: res.data.data.cargo_type,
                pickupFacility: res.data.data.pickup_facility,
                trucksNeeded: parseInt(res.data.data.total_trucks, 0),
                clientType: 'Web',
                device: this.isMobile() ? 'mobile' : 'desktop',
              });
            }
          }
        })
        .catch(error => {
          this.errObj = error;
        });
    },
  },
};
</script>

<style scoped>
@import '../../../public/css/bidding.css';
</style>
