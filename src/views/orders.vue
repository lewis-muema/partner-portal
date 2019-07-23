<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="truckflow__container-tab">
      <div class="truckflow__container-outer">
        <div class="truckflow__container-search">
          <span class="container__search-input">
            <input
              type="text"
              onfocus="value = ''"
              class="container__search-element"
              id="inp"
              placeholder="Enter pickup"
              @input="filterPickup()"
              @keyup.delete="refresh()"
            />
          </span>
          <span class="container__search-input">
            <input
              type="text"
              onfocus="value = ''"
              class="container__search-element"
              id="dst"
              placeholder="Enter destination"
              @input="filterDest()"
              @keyup.delete="refresh()"
            />
          </span>
          <span class="container__search-select">
            <select
              name
              class="container__search-element select-font"
              @change="filterVendor()"
              id="vend"
            >
              <option value selected>Select type of truck</option>
              <option value="3T Truck">3 Tonne Truck</option>
              <option value="5T Truck">5 Tonne Truck</option>
              <option value="10T Truck">10 Tonne Truck</option>
              <option value="14T Truck">14 Tonne Truck</option>
              <option value="20T Truck">20 Tonne Truck</option>
              <option value="28T Truck">28 Tonne Truck</option>
              <option value="Freight">Freight Truck</option>
            </select>
          </span>
        </div>
        <div class="bids">
          <div id="orders__list-table" class="orders__list-table">
            <div class="orders__list-toprow table-head">
              <div class="orders__col-head pickup uppercase">pickup location</div>
              <div class="orders__col-head load uppercase">type of load</div>
              <div class="orders__col-head destination uppercase">destination</div>
              <div class="orders__col-head distance uppercase">distance</div>
              <div class="orders__col-head pick-date uppercase">pickup date</div>
              <div class="orders__col-head truck uppercase">truck</div>
              <div class="orders__col-head orderNo">order number</div>
              <div class="orders__col-head price-align uppercase">price</div>
              <div class="orders__col-head bid-in uppercase"></div>
              <div class="orders__col-head center-action uppercase">action</div>
            </div>
            <div class="loading" v-if="loadingStatus"></div>
            <div class="no-records" v-if="!loadingStatus && orders.length === 0">
              <p class="no-records-par">There are no orders</p>
            </div>
            <template v-for="order in orders.slice().reverse()">
              <div
                class="orders__list-row"
                @click="toggle(order.id)"
                :class="{ opened: opened.includes(order.id) }"
                v-if="showParentOrdercard(order.id)"
                :key="order.id"
              >
                <div class="orders__list-col pickup">
                  <p class="orders__mobile-col">Pickup</p>
                  <p
                    class="row1"
                    @mouseover="showFromTooltip(order.id)"
                    @mouseout="hideFromTooltip(order.id)"
                  >{{ shortFromName(order.id) }}</p>
                  <span
                    :class="`tooltiptext sp${order.id}`"
                  >{{ order.from_name }}, {{ order.start_address }}</span>
                </div>
                <div class="orders__list-col load">
                  <p class="orders__mobile-col">Load</p>
                  <p>N/A</p>
                </div>
                <div class="orders__list-col destination">
                  <p class="orders__mobile-col">Destination</p>
                  <p
                    class="row2"
                    @mouseover="showToTooltip(order.id)"
                    @mouseout="hideToTooltip(order.id)"
                  >{{ shortToName(order.id) }}</p>
                  <span
                    :class="`tooltiptext sps${order.id}`"
                  >{{ order.to_name }}, {{ order.end_address }}</span>
                </div>
                <div class="orders__list-col distance">
                  <p class="orders__mobile-col">Distance</p>
                  <p class="orders__mobile-col--distance">{{ formatDistance(order.id) }} km</p>
                </div>
                <div class="orders__list-col pick-date">
                  <p class="orders__mobile-col">Date</p>
                  <p>{{ timeFormat(order.id) }}</p>
                </div>
                <div class="orders__list-col truck">
                  <p class="orders__mobile-col">Truck</p>
                  <p class="row3">{{ order.vendorname }}</p>
                </div>
                <div class="orders__list-col orderNo">
                  <p class="orders__mobile-col">order number</p>
                  <p>{{ order.orderNo }}</p>
                </div>
                <div class="orders__list-col price-align">
                  <p class="orders__mobile-col">Price</p>
                  <p class="right-align">{{ order.currency }} {{ currencyFormat(order.id) }}</p>
                </div>
                <div class="orders__list-col bid-in"></div>
                <div class="orders__list-col center-action">
                  <P class="orders__mobile-col uppercase">action</P>
                  <div class="orders__statuses">
                    <span>
                      <p
                        class="orders__confirm-icon confirmedbutton orders__buttons"
                        v-if="confirmedStatus(order)"
                      >confirmed</p>
                      <p
                        class="orders__confirm-icon in-transitButton orders__buttons"
                        v-if="inTransitStatus(order)"
                      >in transit</p>
                      <p
                        class="orders__confirm-icon deliveredButton orders__buttons"
                        v-if="deliveredStatus(order)"
                      >delivered</p>
                      <p
                        class="orders__confirm-icon pendingDnotes orders__buttons"
                        v-if="pendingDnotes(order)"
                      >pending d.notes</p>
                      <p
                        class="orders__confirm-icon cancelledButton orders__buttons"
                        v-if="cancelledStatus(order)"
                      >cancelled</p>
                    </span>
                    <span>
                      <i
                        class="material-icons icon arrow"
                        :class="orderStatuses(order)"
                        v-if="opened.includes(order.id)"
                      >keyboard_arrow_down</i>
                      <i
                        class="material-icons icon arrow"
                        :class="orderStatuses(order)"
                        v-if="!opened.includes(order.id)"
                      >keyboard_arrow_right</i>
                    </span>
                  </div>
                </div>
              </div>
              <div
                v-if="opened.includes(order.id)"
                :class="'row-' + order.id "
                :key="order.orderNo"
              >
                <div colspan="8" class="expanded-row">
                  <div class="map-details--go-back" @click="toggle(order.id)">
                    <i class="material-icons icon map-details-go-back--icon">arrow_back</i>
                    <span class="map-details-go-back--span">Back</span>
                  </div>
                  <div class="map__column">
                    <img :src="createStaticMapUrl(order)" class="map" />
                    <div class="map__details-row">
                      <div class="map__details-col">
                        <p class="map__details-pickup heading uppercase">pickup location</p>
                        <p class="map__details-pickup par">{{ order.from_name }}</p>
                        <p class="map__details-date heading uppercase">date and time</p>
                        <p class="map__details-date par">{{ timeFormat(order.id) }}</p>
                      </div>
                      <div class="map__details-col">
                        <p class="map__details-dest heading uppercase">destination</p>
                        <p class="map__details-dest par">{{ order.to_name }}</p>
                        <p class="map__details-distance heading uppercase">distance</p>
                        <p class="map__details-distance par">{{ order.distance }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="order__column">
                    <p class="order__weight heading uppercase">approximate weight of the order</p>
                    <p class="order__weight par" v-if="!weight">Not applicable</p>
                    <p class="order__weight par" v-else>{{ weight }}</p>
                    <p class="order__loader heading uppercase">loader(s) needed</p>
                    <p class="order__loader par" v-if="!loaders">Not applicable</p>
                    <p class="order__loader par" v-else>{{ loaders }}</p>
                    <p class="order__loadtype heading uppercase">type of load</p>
                    <p class="order__loadtype par" v-if="!load">Not applicable</p>
                    <p class="order__loadtype par" v-else>{{ load }}</p>
                    <p class="order__notes heading uppercase">notes</p>
                    <p class="order__notes par">{{ orderNotes(order.id) }}</p>
                  </div>
                  <div class="order__column">
                    <p class="order__amount heading uppercase">amount</p>
                    <p class="order__amount par">{{ order.currency }} {{ currencyFormat(order.id) }}</p>
                    <div v-if="order.confirmStatus === 1 && order.orderStatus === 1">
                      <div class="assigned">
                        <p class="order__amount heading uppercase">vehicle assigned to this order</p>
                        <p class="order__amount par">{{ confirmedVehicle }}</p>
                      </div>
                      <div class="assigned">
                        <p class="order__amount heading uppercase">driver assigned to this order</p>
                        <p class="order__amount par">{{ confirmedDriver }}</p>
                      </div>
                      <div class="assigned" v-if="pendingDnotes(order)">
                        <p class="order__amount heading uppercase">delivery status</p>
                        <p class="order__amount par">D Notes NOT delivered</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDTsp-JumEjWjNNPjPuH5qJEWdFjtQvTsU&amp;v=3.exp&amp;libraries=places,geometry"></script>

<script>
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';
import axios from 'axios';
import moment from 'moment';

let interval = '';

export default {
  title: 'Partner Portal - My Orders',
  components: {
    verifier,
    errorHandler,
  },
  data() {
    return {
      allVehicles: '',
      auth: process.env.VUE_APP_AUTH,
      opened: [],
      show: false,
      orders: [],
      riders: [],
      vehicles: [],
      addDriverStatus: false,
      addVehicleStatus: false,
      orderNo: null,
      count: null,
      count1: null,
      regNo: null,
      insuNo: null,
      box: '0',
      vendorType: null,
      ownerId: null,
      closed: null,
      driverName: null,
      driverPhone: null,
      riderId: null,
      vehicleId: null,
      ownerPhone: null,
      DL: null,
      ID: null,
      refrigirated: null,
      partnerVendor: null,
      message: null,
      error: null,
      load: null,
      loaders: null,
      notes: null,
      weight: null,
      regOk: null,
      insuOk: null,
      driverNameOk: null,
      IDOk: null,
      DLOk: null,
      drivePhoneOk: null,
      newVehicle: false,
      newRider: false,
      vehiclePayload: [],
      riderPayload: [],
      pick: [],
      responseNo: 0,
      confirmedDriver: null,
      confirmedVehicle: null,
      loadingStatus: true,
      fetchOrderStatus: false,
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
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.getOrders();
    }
  },
  beforeDestroy() {
    clearInterval(interval); // stop the interval
  },
  computed: {},
  methods: {
    regcounter(id) {
      this.regOk = id;
    },
    createStaticMapUrl(path) {
      const google_key = 'AIzaSyDJ_S9JgQJSaHa88SXcPbh9JijQOl8RXpc';
      const from_cordinates = path.from;
      const to_cordinates = path.to;
      return `https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|${from_cordinates}|${to_cordinates}&size=500x200&markers=color:0xF17F3A%7Clabel:P%7C
            ${from_cordinates}&markers=color:0x2c82c5%7Clabel:D%7C${to_cordinates}&key=${google_key}`;
    },
    insucounter(id) {
      this.insuOk = id;
    },
    driverNameCounter(id) {
      this.driverNameOk = id;
    },
    IDCounter(id) {
      this.IDOk = id;
    },
    DLCounter(id) {
      this.DLOk = id;
    },
    driverPhoneCounter(id) {
      this.drivePhoneOk = id;
    },
    showFromTooltip(id) {
      const tooltiprow = document.querySelector(`.sp${id}`);
      tooltiprow.style.display = 'block';
    },
    hideFromTooltip(id) {
      const tooltiprow = document.querySelector(`.sp${id}`);
      tooltiprow.style.display = 'none';
    },
    showToTooltip(id) {
      const tooltiprow = document.querySelector(`.sps${id}`);
      tooltiprow.style.display = 'block';
    },
    hideToTooltip(id) {
      const tooltiprow = document.querySelector(`.sps${id}`);
      tooltiprow.style.display = 'none';
    },
    timeFormat(id) {
      const timer = moment(this.orders[id - 1].orderTime).format('ddd, Do MMM');
      return timer;
    },
    confirmedStatus(order) {
      if (this.orderStatuses(order) === 'confirmedbutton') {
        return true;
      }
    },
    inTransitStatus(order) {
      if (this.orderStatuses(order) === 'in-transitButton') {
        return true;
      }
    },
    deliveredStatus(order) {
      if (this.orderStatuses(order) === 'deliveredButton') {
        return true;
      }
    },
    pendingDnotes(order) {
      if (this.orderStatuses(order) === 'pendingDnotes') {
        return true;
      }
    },
    cancelledStatus(order) {
      if (this.orderStatuses(order) === 'cancelledButton') {
        return true;
      }
    },
    orderStatuses(order) {
      if (order.confirmStatus === 1 && order.orderStatus === 1 && order.delivery_status === 0) {
        return 'confirmedbutton';
      } else if (order.confirmStatus === 1 && order.orderStatus === 1 && order.delivery_status === 2) {
        return 'in-transitButton';
      } else if (order.confirmStatus === 1 && order.orderStatus === 1 && order.delivery_status === 3) {
        if (order.delivery_verification.hasOwnProperty('physical_delivery_note_status') && order.delivery_verification.physical_delivery_note_status) {
          if (order.delivery_notes[0].hasOwnProperty('physical_delivery_note_status') && order.delivery_notes[0].physical_delivery_note_status === 2) {
            return 'deliveredButton';
          } else {
            return 'pendingDnotes';
          }
        } else {
          return 'deliveredButton';
        }
      } else {
        return 'cancelledButton';
      }
    },
    currencyFormat(id) {
      const amount = this.orders[id - 1].amount;
      return amount
        .toString()
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
        .split('.')[0];
    },
    formatDistance(id) {
      const distance = this.orders[id - 1].distance;
      const num = distance.replace(/\D+$/g, '');
      return Math.round(num);
    },
    orderNotes(id) {
      if (this.orders[id - 1].orderNotes) {
        return this.orders[id - 1].orderNotes.slice(7, 10000);
      } else {
        return 'No notes';
      }
    },
    shortFromName(id) {
      if (this.orders[id - 1].from_name.indexOf(',') > -1) {
        const name = this.orders[id - 1].from_name.substr(0, this.orders[id - 1].from_name.indexOf(','));
        if (name.length > 30) {
          return `${name.slice(0, 30)}...`;
        } else {
          return name;
        }
      } else {
        if (this.orders[id - 1].from_name.length > 30) {
          return `${this.orders[id - 1].from_name.slice(0, 30)}. . .`;
        } else {
          return this.orders[id - 1].from_name;
        }
      }
    },
    shortToName(id) {
      if (this.orders[id - 1].to_name.indexOf(',') > -1) {
        const name = this.orders[id - 1].to_name.substr(0, this.orders[id - 1].to_name.indexOf(','));
        if (name.length > 30) {
          return `${name.slice(0, 30)}...`;
        } else {
          return name;
        }
      } else {
        if (this.orders[id - 1].to_name.length > 30) {
          return `${this.orders[id - 1].to_name.slice(0, 30)}. . .`;
        } else {
          return this.orders[id - 1].to_name;
        }
      }
    },
    toggle(id) {
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index, 1);
      } else {
        this.opened.splice(index, 1); // this allows you to open only one tab at a time.
        this.opened.push(id);
      }
      this.count = null;
      this.count1 = null;
      this.ownerPhone = this.sessionInfo.phone;
      this.vendorType = this.orders[id - 1].vendor_type;
      this.ownerId = this.sessionInfo.id;
      this.closed = this.orders[id - 1].carrier_type;
      this.orderNo = this.orders[id - 1].order_no;
      this.message = null;
      this.confirmedDriver = this.orders[id - 1].confirmedDriver;
      this.confirmedVehicle = this.orders[id - 1].confirmedVehicle;
      if (this.orders[id - 1].package_details) {
        if (this.orders[id - 1].package_details.load_weight) {
          this.weight = `${this.orders[id - 1].package_details.load_weight} ${this.orders[id - 1].package_details.load_units}`;
        } else {
          this.weight = 'No weight provided';
        }
        if (this.orders[id - 1].package_details.no_of_loaders) {
          this.loaders = this.orders[id - 1].package_details.no_of_loaders;
        } else {
          this.loaders = 'N/A';
        }
        if (this.orders[id - 1].package_details.delivery_item) {
          this.load = this.orders[id - 1].package_details.delivery_item;
        } else {
          this.load = 'N/A';
        }
      } else {
        this.weight = null;
        this.loaders = null;
        this.load = null;
      }
    },
    isMobile() {
      let check = false;
      (a => {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
    showParentOrdercard(order_id) {
      return !(this.opened.includes(order_id) && this.isMobile());
    },
    filterPickup() {
      const input = document.getElementById('inp').value.toLowerCase();
      const length = document.querySelectorAll('.row1').length;
      for (let i = 0; i < length; i++) {
        const classer = document.querySelectorAll('.row1')[i].parentNode;
        const searched = document.querySelectorAll('.row1')[i].innerHTML.toLowerCase();
        if (searched.indexOf(input) > -1) {
          // No item
        } else {
          classer.parentNode.style.display = 'none';
        }
      }
    },
    filterDest() {
      const input = document.getElementById('dst').value;
      const input1 = input.toLowerCase();
      const length = document.querySelectorAll('.row2').length;
      for (let i = 0; i < length; i++) {
        const classer = document.querySelectorAll('.row2')[i].parentNode;
        const searched = document.querySelectorAll('.row2')[i].innerHTML;
        const searched1 = searched.toLowerCase();
        if (searched1.indexOf(input1) > -1) {
          // No item
        } else {
          classer.parentNode.style.display = 'none';
        }
      }
    },
    filterVendor() {
      this.refresh();
      const input = document.getElementById('vend').value;
      const show = document.querySelectorAll('.orders__list-toprow').length;
      for (let i = 0; i < show; i++) {
        const hidden = document.querySelectorAll('.orders__list-toprow')[i];
        hidden.style.display = 'grid';
      }
      const input1 = input.toLowerCase();
      const length = document.querySelectorAll('.row3').length;
      for (let i = 0; i < length; i++) {
        const classer = document.querySelectorAll('.row3')[i].parentNode;
        const searched = document.querySelectorAll('.row3')[i].innerHTML;
        const searched1 = searched.toLowerCase();
        if (searched1.indexOf(input1) > -1) {
          // No item
        } else {
          classer.parentNode.style.display = 'none';
        }
      }
    },
    refresh() {
      document.querySelectorAll('.orders__list-row').forEach(row => {
        row.style.display = 'grid';
      });
      const inputInp = document.getElementById('inp').value.toLowerCase();
      const inputDst = document.getElementById('dst').value.toLowerCase();
      const inputVend = document.getElementById('vend').value.toLowerCase();
      document.querySelectorAll('.row1').forEach((row1, i) => {
        const classer = row1.parentNode;
        const searchedInp = row1.innerHTML.toLowerCase();
        const searchedDst = document.querySelectorAll('.row2')[i].innerHTML.toLowerCase();
        const searchedVend = document.querySelectorAll('.row3')[i].innerHTML.toLowerCase();
        if (searchedInp.indexOf(inputInp) > -1 && searchedDst.indexOf(inputDst) > -1 && searchedVend.indexOf(inputVend) > -1) {
          // No item
        } else {
          classer.parentNode.style.display = 'none';
        }
      });
    },
    refreshOrders() {
      interval = setInterval(() => {
        let order = '';
        let openid = '';
        let allDetails = '';
        if (this.opened[0]) {
          openid = this.opened[0];
          order = this.orders[openid - 1].orderNo;
        }
        this.ownerPhone = this.sessionInfo.phone;
        const orderPayload = JSON.stringify({
          owner_id: this.sessionInfo.id,
        });
        axios
          .post(`${this.auth}v1/list_owner_orders/`, orderPayload, this.config)
          .then(response => {
            const unescaped = response.data;
            this.orders = [];
            unescaped.data.forEach((row, i) => {
              allDetails = this.populateOrders(row, i);
              if (order === allDetails.orderno) {
                this.opened = [];
                this.opened.push(i + 1);
              }
              if (!this.bikesOnly) {
                this.orders.push(allDetails);
              }
            });
          })
          .catch(error => {
            this.errorObj = error.response;
            if (error.response) {
              //   this.loadingStatus = false;
            }
          });
      }, 60000);
    },
    getOrders() {
      this.loadingStatus = true;
      this.ownerPhone = this.sessionInfo.phone;
      const orderPayload = JSON.stringify({
        owner_id: this.sessionInfo.id,
      });
      axios
        .post(`${this.auth}v1/list_owner_orders/`, orderPayload, this.config)
        .then(response => {
          const unescaped = response.data;
          unescaped.data.forEach((row, i) => {
            this.orders.push(this.populateOrders(row, i));
            this.responseNo = 1;
            this.loadingStatus = false;
          });
          this.refreshOrders();
        })
        .catch(error => {
          this.errorObj = error.response;
          if (error.response) {
            this.loadingStatus = false;
          }
        });
    },
    populateOrders(row, i) {
      const orderno = row.order_no;
      const time = row.date_time;
      const driver = row.rider_name;
      const vehicle = row.vehicle_reg_no;
      const vendorname = row.vendor_disp_name;
      const orderStatus = row.order_status;
      const confirmStatus = row.confirm_status;
      const unescaped1 = JSON.parse(row.order_details);
      const orderDetails = unescaped1.values;
      const priceDetails = JSON.parse(row.price_details);
      if (row.rider_deliver_img) {
        orderDetails.delivery_notes = JSON.parse(row.rider_deliver_img);
      }
      if (priceDetails.order_currency) {
        orderDetails.currency = priceDetails.order_currency;
      } else {
        orderDetails.currency = 'KES';
      }
      if (row.order_notes) {
        orderDetails.orderNotes = row.order_notes[0].msg;
      }
      if (row.customer_min_amount) {
        orderDetails.amount = row.amount;
      } else {
        orderDetails.amount = row.take_home;
      }
      orderDetails.orderNo = orderno;
      orderDetails.id = i + 1;
      orderDetails.confirmed = 0;
      orderDetails.vendorname = vendorname;
      orderDetails.orderTime = time;
      orderDetails.confirmedDriver = driver;
      orderDetails.confirmedVehicle = vehicle;
      orderDetails.orderStatus = orderStatus;
      orderDetails.confirmStatus = confirmStatus;
      orderDetails.delivery_status = row.delivery_status;
      return orderDetails;
    },
  },
};
</script>

<style>
</style>
