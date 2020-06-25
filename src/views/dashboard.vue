<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="dashboard-currency-selector" v-if="dataResponse">
      <div class="dashboard-currency-buttons" v-for="(currency, index) in currencies" :key="index" :class="activeCurrency === currency ? 'active-currency' : ''" @click="activeCurrency = currency">{{ currency }}</div>
      <button class="dashboard-upload-invoice-button" @click="uploadStatus = true">
        <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" />
        Upload Invoice
      </button>
    </div>
    <div class="page-dash" v-if="dataResponse && !uploadStatus">
      <div class="row dashboard__row">
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="new-dashboard__box-icon new-dashboard__box-icon-orange-highlight">
              <font-awesome-icon :icon="['fas', 'coins']" class="new-dashboard__box-icon-orange" />
            </span>
            <div class="dashboard__box-content">
              <span class="new-dashboard__box-text">Amount made this week</span>
              <span class="new-dashboard__box-number new-dashboard__box-icon-orange">{{ activeCurrency }} {{ cashMadeThisWeek }}</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="new-dashboard__box-icon new-dashboard__box-icon-green-highlight">
              <font-awesome-icon :icon="['fas', 'university']" class="new-dashboard__box-icon-green" />
            </span>
            <div class="dashboard__box-content">
              <span class="new-dashboard__box-text">Next transfer</span>
              <span class="new-dashboard__box-number new-dashboard__box-icon-green">{{ activeCurrency }} {{ nextTransfer }}</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="new-dashboard__box-icon new-dashboard__box-icon-maroon-highlight">
              <font-awesome-icon :icon="['fas', 'mobile']" class="new-dashboard__box-icon-maroon" />
            </span>
            <div class="dashboard__box-content">
              <span class="new-dashboard__box-text">Weekly airime purchase</span>
              <span class="new-dashboard__box-number new-dashboard__box-icon-maroon">{{ activeCurrency }} 0</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="new-dashboard__box-icon new-dashboard__box-icon-yellow-highlight">
              <font-awesome-icon :icon="['fas', 'gas-pump']" class="new-dashboard__box-icon-yellow" />
            </span>
            <div class="dashboard__box-content">
              <span class="new-dashboard__box-text">Weekly fuel advance</span>
              <span class="new-dashboard__box-number new-dashboard__box-icon-yellow">{{ activeCurrency }} 0</span>
            </div>
          </div>
        </div>
        <div class="dashboard__box-container">
          <div class="dashboard__dash-box">
            <span class="new-dashboard__box-icon new-dashboard__box-icon-blue-highlight">
              <font-awesome-icon :icon="['fas', 'calendar-week']" class="new-dashboard__box-icon-blue" />
            </span>
            <div class="dashboard__box-content">
              <span class="new-dashboard__box-text">Pending D Notes</span>
              <span class="new-dashboard__box-number new-dashboard__box-icon-blue" v-if="count">{{ count }} </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="dashboard__mid">
            <!-- <div class="dashboard__mid-header">
            <h3 class="dashboard__mid-title">Monthly Recap</h3>
            </div>-->
            <div class="dashboard__mid-body">
              <div class="row">
                <div class="col-lg-9">
                  <p class="new-dashboard-head-smol">
                    <span class="new-dashboard-graph-selector" :class="activeGraph === 'revenue' ? 'new-dashboard-active-graph' : ''" @click="activeGraph = 'revenue'">
                      Revenue
                    </span>
                    <span class="new-dashboard-graph-selector" :class="activeGraph === 'total orders' ? 'new-dashboard-active-graph' : ''" @click="activeGraph = 'total orders'">
                      Total Orders
                    </span>
                    <span class="new-dashboard-graph-selector" :class="activeGraph === 'fuel advance' ? 'new-dashboard-active-graph' : ''" @click="activeGraph = 'fuel advance'">
                      Fuel Advance
                    </span>
                    <span class="new-dashboard-graph-selector" :class="activeGraph === 'airtime purchases' ? 'new-dashboard-active-graph' : ''" @click="activeGraph = 'airtime purchases'">
                      Airtime Purchases
                    </span>
                  </p>
                  <div v-if="dataPoints && dataPoints.labels.length > 0">
                    <chart :chart-data="dataPoints" :options="dataOptions" />
                  </div>
                  <div v-else>
                    <img class="new-dashboard-graph-img" src="https://images.sendyit.com/partner_portal/images/no_data.png" alt="No gragh data" />
                    <p class="new-dashboard-graph-label">No data to show here yet</p>
                  </div>
                </div>
                <div class="col-lg-3">
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Average rating this week</span>
                    <div class="new-dashboard-ratings">
                      <span v-for="(star, index) in ratingThisWeek()" :key="index">
                        <font-awesome-icon v-if="star === 1" :icon="['fas', 'star']" class="new-dashboard__box-icon-orange all-stars" />
                        <font-awesome-icon v-if="star > 0 && star < 1" :icon="['fas', 'star-half']" class="new-dashboard__box-icon-orange all-stars" />
                        <font-awesome-icon v-if="star > 0 && star < 1" :icon="['far', 'star']" class="new-dashboard__box-icon-orange half-star all-stars" />
                        <font-awesome-icon v-if="star === 0" :icon="['far', 'star']" class="new-dashboard__box-icon-orange all-stars" />
                      </span>
                    </div>
                  </div>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Average rating this month</span>
                    <div class="new-dashboard-ratings">
                      <span v-for="(star, index) in ratingThisMonth()" :key="index">
                        <font-awesome-icon v-if="star === 1" :icon="['fas', 'star']" class="new-dashboard__box-icon-orange all-stars" />
                        <font-awesome-icon v-if="star > 0 && star < 1" :icon="['fas', 'star-half']" class="new-dashboard__box-icon-orange all-stars" />
                        <font-awesome-icon v-if="star > 0 && star < 1" :icon="['far', 'star']" class="new-dashboard__box-icon-orange half-star all-stars" />
                        <font-awesome-icon v-if="star === 0" :icon="['far', 'star']" class="new-dashboard__box-icon-orange all-stars" />
                      </span>
                    </div>
                  </div>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Hours online this week</span>
                    <div class="new-dashboard-online-hours">{{ hoursOnlineThisWeek() }} Hours</div>
                  </div>
                  <div class="dashboard__rate-group">
                    <span class="dashboard__rate-text">Hours online this month</span>
                    <div class="new-dashboard-online-hours">{{ hoursOnlineThisMonth() }} Hours</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="new-dashboard-upload-container" v-if="dataResponse && uploadStatus">
      <span class="upload-invoice-span">
        <font-awesome-icon :icon="['fas', 'arrow-left']" class="upload-invoice-back-button" @click="uploadStatus = false" />
        Upload invoice
      </span>
      <div class="upload-invoice-pad">
        <div class="upload-invoice-container">
          <div class="upload-invoice-pad-inputs" v-if="uploadingStage === 1">
            <div class="upload-invoice-inputs">
              <p>
                Invoice number
              </p>
              <input type="text" class="upload__invoice-inputs" v-model="invoiceNumber" />
            </div>
            <div class="upload-invoice-inputs">
              <p>
                Number of orders
              </p>
              <input type="text" onkeypress="return event.charCode >= 48 && event.charCode <= 57" class="upload__invoice-inputs" v-model="numberOfOrders" />
            </div>
            <div class="upload-invoice-inputs">
              <p>
                Order dates
              </p>
              <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="Start date" end-placeholder="End date"> </el-date-picker>
            </div>
            <div class="upload-invoice-inputs">
              <div class="upload-invoice-submit-button" @click="transfer('invoiceUpload')">
                <font-awesome-icon :icon="['fas', 'cloud-upload-alt']" />
                Upload invoice
              </div>
              <div v-if="invoiceSuccessUpload">
                <span class="invoice-attached-label">
                  invoice attached
                </span>
                <span class="invoice-change-label" @click="transfer('invoiceUpload')">
                  change
                </span>
              </div>
            </div>
            <input type="file" name value class="form-control" placeholder="Driver Photo" accept=".pdf, image/*" id="invoiceUpload" style="display:none;" @change="upload()" />
          </div>
          <div class="upload-invoice-buttons" v-if="uploadingStage === 1">
            <button class="upload-invoice-next-button" @click="submitInvoice()" :class="uploadInvoiceStatus ? 'ready-upload-status' : 'inactive-upload-status'">
              Upload
            </button>
          </div>
          <img class="uploading-gifs" :class="uploadingStage === 2 ? '' : 'hidden'" src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/partner_portal/images/loader.gif" alt="loader" />
          <p v-if="uploadingStage === 2" class="center-text">Uploading</p>
          <img class="uploading-gifs" v-if="uploadingStage === 3" src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/partner_portal/images/check.gif" alt="check" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import S3 from 'aws-s3';
import axios from 'axios';
import moment from 'moment';
import chart from '../components/chart.vue';
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';

let s3 = '';

export default {
  title: 'Partner Portal - Dashboard',
  components: {
    verifier,
    errorHandler,
    chart,
  },
  data() {
    return {
      dataStatus: false,
      vehArray: [],
      vehicles: [],
      riders: [],
      riderId: '',
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      dateRange: '',
      invoiceNumber: '',
      numberOfOrders: '',
      fileName: '',
      activeGraph: 'revenue',
      uploadStatus: false,
      invoiceSuccessUpload: false,
      activeCurrency: '',
      dataResponse: '',
      errorObj: '',
      count: '',
      amount: '',
      currency: '',
      uploadingStage: 1,
      ownerStats: {},
      currencyStats: {},
      nextTransferAmount: '',
      dataPoints: '',
      dataOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                drawOnChartArea: false,
              },
            },
          ],
        },
      },
    };
  },
  computed: {
    currencies() {
      const currencies = [];
      Object.keys(this.currencyStats).forEach(row => {
        currencies.push(row);
      });
      return currencies;
    },
    revenueDataPoints() {
      const months = [];
      const amountArray = [];
      if (Object.keys(this.currencyStats).length > 0 && this.currencyStats[this.activeCurrency].monthlyEarnings) {
        this.currencyStats[this.activeCurrency].monthlyEarnings.forEach((row, i) => {
          months.push(row.month);
          amountArray.push(parseInt(row.amount, 10));
        });
      }
      const revenueDataPoints = {
        labels: months,
        datasets: [
          {
            label: `Amount earned (${this.activeCurrency})`,
            borderColor: '#F28226',
            backgroundColor: '#fff',
            data: amountArray,
          },
        ],
      };
      return revenueDataPoints;
    },
    ordersDataPoints() {
      const months = [];
      const totalOrders = [];
      if (Object.keys(this.currencyStats).length > 0 && this.currencyStats[this.activeCurrency].totalOrders) {
        this.currencyStats[this.activeCurrency].totalOrders.forEach((row, i) => {
          months.push(row.month);
          totalOrders.push(parseInt(row.totalOrders, 10));
        });
      }
      const ordersDataPoints = {
        labels: months,
        datasets: [
          {
            label: 'Total Orders',
            borderColor: '#F28226',
            backgroundColor: '#fff',
            data: totalOrders,
          },
        ],
      };
      return ordersDataPoints;
    },
    fuelDataPoints() {
      const months = [];
      const amountArray = [];
      if (Object.keys(this.currencyStats).length > 0 && this.currencyStats[this.activeCurrency].fuelAdvance) {
        this.currencyStats[this.activeCurrency].fuelAdvance.forEach((row, i) => {
          months.push(row.month);
          amountArray.push(parseInt(row.amount, 10));
        });
      }
      const fuelDataPoints = {
        labels: months,
        datasets: [
          {
            label: `Total Fuel Advance (${this.activeCurrency})`,
            borderColor: '#F28226',
            backgroundColor: '#fff',
            data: amountArray,
          },
        ],
      };
      return fuelDataPoints;
    },
    airtimeDataPoints() {
      const months = [];
      const amountArray = [];
      if (Object.keys(this.currencyStats).length > 0 && this.currencyStats[this.activeCurrency].airtimePurchases) {
        this.currencyStats[this.activeCurrency].airtimePurchases.forEach((row, i) => {
          months.push(row.month);
          amountArray.push(parseInt(row.amount, 10));
        });
      }
      const airtimeDataPoints = {
        labels: months,
        datasets: [
          {
            label: `Amount in ${this.activeCurrency}`,
            borderColor: '#F28226',
            backgroundColor: '#fff',
            data: amountArray,
          },
        ],
      };
      return airtimeDataPoints;
    },
    cashMadeThisMonth() {
      if (Object.keys(this.currencyStats).length > 0 && this.currencyStats[this.activeCurrency].cashMadeThisMonth) {
        return Math.abs(parseFloat(this.currencyStats[this.activeCurrency].cashMadeThisMonth));
      }
      return 0;
    },
    cashMadeThisWeek() {
      if (Object.keys(this.currencyStats).length > 0 && this.currencyStats[this.activeCurrency].cashMadeThisWeek) {
        return Math.abs(parseFloat(this.currencyStats[this.activeCurrency].cashMadeThisWeek));
      }
      return 0;
    },
    nextTransfer() {
      if (Object.keys(this.currencyStats).length > 0 && this.currencyStats[this.activeCurrency].nextTransfer) {
        return Math.abs(parseFloat(this.currencyStats[this.activeCurrency].nextTransfer, 100));
      }
      return 0;
    },
    uploadInvoiceStatus() {
      if (this.invoiceNumber && this.numberOfOrders && this.dateRange && document.getElementById('invoiceUpload')['files'] && this.invoiceSuccessUpload) {
        return true;
      }
      return false;
    },
  },
  watch: {
    activeGraph(val) {
      if (val === 'revenue') {
        this.dataPoints = this.revenueDataPoints;
      } else if (val === 'total orders') {
        this.dataPoints = this.ordersDataPoints;
      } else if (val === 'fuel advance') {
        this.dataPoints = this.fuelDataPoints;
      } else if (val === 'airtime purchases') {
        this.dataPoints = this.airtimeDataPoints;
      }
    },
    activeCurrency() {
      if (this.activeGraph === 'revenue') {
        this.dataPoints = this.revenueDataPoints;
      } else if (this.activeGraph === 'total orders') {
        this.dataPoints = this.ordersDataPoints;
      } else if (this.activeGraph === 'fuel advance') {
        this.dataPoints = this.fuelDataPoints;
      } else if (val === 'airtime purchases') {
        this.dataPoints = this.airtimeDataPoints;
      }
    },
  },
  created() {
    if (localStorage.sessionData) {
      this.initiateS3();
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      const payload = JSON.stringify({
        owner_id: parseInt(this.sessionInfo.id, 10),
      });
      const riderIds = [];
      this.sessionInfo.riders.forEach((row, i) => {
        riderIds.push(row.rider_id);
      });
      const riderPayload = JSON.stringify({
        rider_ids: riderIds,
      });
      this.post(process.env.VUE_APP_AUTH, 'partner/v1/partner_portal/pending_delivery_notes', riderPayload)
        .then(response => {
          if (response.data.status) {
            this.count = response.data.pendingDeliveryNotesData[0].count;
            this.amount = response.data.pendingDeliveryNotesData[0].total_amount;
          }
        })
        .then(() => {
          this.post(process.env.VUE_APP_AUTH, 'partner/v1/partner_portal/dashboard', payload).then(response => {
            this.dataStatus = true;
            this.dataResponse = response.data;
            Object.values(this.dataResponse.data).forEach((row, i) => {
              if (typeof row === 'string' || typeof row === 'number') {
                this.ownerStats[Object.keys(this.dataResponse.data)[i]] = row;
              }
              if (typeof row === 'object') {
                this.currencyStats[Object.keys(this.dataResponse.data)[i]] = row;
              }
            });
            this.activeCurrency = Object.keys(this.currencyStats)[0];
            this.dataPoints = this.revenueDataPoints;
          });
        });
    }
  },
  methods: {
    initiateS3() {
      const script = document.createElement('script');
      script.onload = () => {
        const albumBucketName = 'sendy-partner-docs';
        const bucketRegion = 'eu-west-1';
        const IdentityPoolId = 'eu-west-1:2812c134-0c22-4755-be2d-8fa850a041ee';

        AWS.config.update({
          region: bucketRegion,
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId,
          }),
        });

        s3 = new AWS.S3({
          apiVersion: '2006-03-01',
          params: { Bucket: albumBucketName },
        });
      };
      script.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.7.20.min.js';

      document.head.appendChild(script);
    },
    getVehicles() {
      return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
          owner_id: this.sessionInfo.id,
        });
        axios
          .post(`${process.env.VUE_APP_AUTH}rider/admin_partner_api/v5/partner_portal/vehicles`, payload, this.config)
          .then(response => {
            this.vehArray = response.data.msg;
            this.listVehicles();
            this.listRiders();
          })
          .catch(error => {
            this.errorObj = error.response;
          });
      });
    },
    listRiders() {
      const vehCount = this.vehArray;
      vehCount.forEach((row, g) => {
        if (vehCount[g].rider !== null) {
          this.riders.push(vehCount[g].rider);
        }
      });
    },
    listVehicles() {
      const vehCount = this.vehArray;
      vehCount.forEach((row, g) => {
        if (vehCount[g].vehicle !== null) {
          this.vehicles.push(vehCount[g].vehicle);
        }
      });
    },
    rating(totalRating) {
      const ratings = [];
      for (let i = 0; i < 5; i++) {
        const remainder = totalRating - i;
        if (remainder >= 1) {
          ratings.push(1);
        } else if (remainder < 1 && remainder > 0) {
          ratings.push(remainder);
        } else if (remainder <= 0) {
          ratings.push(0);
        }
      }
      return ratings;
    },
    post(app, url, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${app}${url}`, payload, this.config)
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            resolve(error);
          });
      });
    },
    ratingThisWeek() {
      if (Object.prototype.hasOwnProperty.call(this.ownerStats, 'averageRatingThisWeek')) {
        return this.rating(parseInt(this.ownerStats.averageRatingThisWeek, 10));
      }
      return this.rating(0);
    },
    ratingThisMonth() {
      if (Object.prototype.hasOwnProperty.call(this.ownerStats, 'averageRatingThisMonth')) {
        return this.rating(parseInt(this.ownerStats.averageRatingThisMonth, 10));
      }
      return this.rating(0);
    },
    hoursOnlineThisWeek() {
      if (Object.prototype.hasOwnProperty.call(this.ownerStats, 'hoursOnlineThisWeek')) {
        return this.ownerStats.hoursOnlineThisWeek;
      }
      return 0;
    },
    hoursOnlineThisMonth() {
      if (Object.prototype.hasOwnProperty.call(this.ownerStats, 'hoursOnlineThisMonth')) {
        return this.ownerStats.hoursOnlineThisMonth;
      }
      return 0;
    },
    transfer(id) {
      document.getElementById(id).click();
    },
    upload(id) {
      const files = document.getElementById('invoiceUpload')['files'];
      if (!files.length) {
        // eslint-disable-next-line no-alert
        return alert('Please choose a file to upload first.');
      }
      this.invoiceSuccessUpload = false;
      const file = files[0];
      const fileType = files[0]['type'];
      const fileName = this.sanitizeFilename(file.name);
      this.fileName = fileName;
      const albumPhotosKey = `${encodeURIComponent('invoices')}/`;
      const photoKey = albumPhotosKey + fileName;
      s3.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: 'public-read',
          ContentType: fileType,
        },
        (err, data) => {
          if (err) {
            console.log('There was an error uploading your photo: ', err.message);
          } else {
            this.invoiceSuccessUpload = true;
          }
          // eslint-disable-next-line comma-dangle
        }
      );
    },
    submitInvoice() {
      this.uploadingStage = 2;
      const payload = {
        owner_id: parseInt(this.sessionInfo.id, 10),
        invoice_file_name: this.fileName.split('.')[0],
        invoice_no: this.invoiceNumber,
        no_of_orders: parseInt(this.numberOfOrders, 10),
        invoice_start_date: moment(this.dateRange[0]).format('YYYY-MM-DD HH:mm:ss'),
        invoice_end_date: moment(this.dateRange[1]).format('YYYY-MM-DD HH:mm:ss'),
        invoice_url: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/invoices/${this.fileName}`,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/upload_owner_invoice`, payload, this.config)
        .then(response => {
          this.dateRange = '';
          this.numberOfOrders = '';
          this.invoiceNumber = '';
          this.fileName = '';
          this.uploadingStage = 3;
          this.invoiceSuccessUpload = false;
          setTimeout(() => {
            this.uploadingStage = 1;
          }, 5000);
        })
        .catch(error => {
          this.uploadingStage = 4;
          setTimeout(() => {
            this.uploadingStage = 1;
          }, 5000);
          this.errorObj = error.response;
        });
    },
    sanitizeFilename(name) {
      const temp_name = `invoice_${this.sessionInfo.id}_${new Date().getTime()}.${name.split('.').pop()}`;
      return temp_name;
    },
  },
};
</script>

<style></style>
