<template>
<div id="footer">
  <div class="container" v-if="selectedRating == ''">
  <div class="row">
    <div class="col-lg-12">
    <h5 class="align-middle"> {{ $t('footer.how_likely') }} </h5>
    <br/>
    </div>
  </div>
  <div class="row" id="info">
    <div class="col-lg-12">
      <span>
      {{ $t('footer.not_likely') }}
      </span>
    <span v-for="(rating, i) in ratings" :key="i">
    <button :id="rating" class="circles" :value="selectedRating" @click="getScore(rating)">
      {{ rating }}
      </button>
    </span>
    <span>
      {{ $t('footer.very_likely') }}
    </span>
    <button class="dismissbtn" @click="cancelSurvey()">
        X
      </button>
    </div>
  </div>
  </div>
    <div class="container" v-if="selectedRating !== '' && surveyStatus !== 1">
  <div class="row">
    <div class="col-lg-12">
    <h5 class="align-middle">{{ $t('footer.what_like_most') }}</h5>
    <br/>
    </div>
  </div>
  <div class="row" id="info">
    <div class="col-lg-11">
      <span>
        <textarea id="opinion" v-model="opinion"></textarea>
    <button id="submitbtn" @click="submitSurvey()">
      {{ $t('footer.submit') }}
      </button>
      </span></div>
      <div class="col-lg-1">
    <button class="dismissbtn" @click="cancelSurvey()">
        X
      </button>
    </div>
  </div>
  </div>
  <div class="container" v-if="surveyStatus === 1">
  <div class="row">
    <div class="col-lg-12">
    <h5 class="align-middle">{{ message }}</h5>
    <br/>
    </div>
  </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import $ from 'jquery';

export default {
  data() {
    return {
      ratings: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      selectedRating: '',
      opinion: '',
      surveyStatus: 0,
      ownerID: null,
      countryCode: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
      message: '',
      };
  },
beforeMount () {
  this.getSessionData();
},
  methods: {
    getScore(rating) {
      this.selectedRating = rating;
      return this.selectedRating;
    },
    submitSurvey() {
      if (this.selectedRating !== '') {
      this.surveyStatus = 1;
      this.postSurvey();
      } else {
        this.surveyStatus = 0;
      }
      return this.surveyStatus;
    },
    fadeSurvey() {
      $('#footer').fadeOut(3000);
    },
    getSessionData() {
      const sessionInfo = JSON.parse(localStorage.sessionData).payload;
      this.ownerID = sessionInfo.id;
      this.countryCode = sessionInfo.country_code;
    },
    postSurvey() {
      const surveyPayload = {
        respondent_type: 'owner',
        respondent_id: this.ownerID,
        country_code: this.countryCode,
        business_unit_id: 1,
        score: this.selectedRating,
        reason: this.opinion,
      };
      axios
        .post(`${process.env.ADONIS_PRIVATE_API}nps/surveys`, surveyPayload, this.config)
        .then(res => {
          this.message = this.$t('footer.thank_you');
          this.fadeSurvey();
        })
        .catch(error => {
          this.message = this.$t('footer.something_went_wrong');
        });
    },
    cancelSurvey() {
      const surveyPayload = {
        respondent_type: 'owner',
        respondent_id: this.ownerID,
        country_code: this.countryCode,
        business_unit_id: 1,
        dismissed: true,
      };
      axios
        .post(`${process.env.ADONIS_PRIVATE_API}nps/surveys`, surveyPayload, this.config)
        .then(res => {
          if (res.data.message === this.$t('footer.user_already_surveyed')) {
            this.fadeSurvey();
          } else {
          this.fadeSurvey();
          }
        })
        .catch(error => {
          this.message = this.$t('footer.something_went_wrong');
        });
    },
},
};
</script>

<style>
#footer{
position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    /* margin: 0 2%; */
    background-color: #fff;
    color: #555;
    font-size: 13px;
    min-height: 90px;
    box-shadow: 22px 7px rgba(0, 0, 0, 0.33), 0 -6px 4px rgba(183, 183, 183, 0.54);
    border-radius: 3px;
    text-align: center;
    z-index: 1;
    padding-top: 20px;
}

h5{
font-style: normal;
font-weight: 600;
font-size: 24px;
line-height: 133%;
display: inline;
color:
#EE7D00;
}

.dismissbtn{
  border: none;
  background-color:#fff;
  font-weight: bolder;
}

#info{
  padding: 20px 0px 20px 0px;
}

.circles{
background:#FFFFFF;
border: 1px solid #BDBDBD;
-webkit-box-sizing: border-box;
box-sizing: border-box;
border-radius: 50%;
width: 40px;
height: 40px;
display: inline-block;
color: #757575;
}

.circles:hover{
  background-color: #093359;
  color: #fff;
}

#opinion{ border: 1px solid
rgb(189, 189, 189);
box-sizing: border-box;
box-shadow:
rgba(0, 0, 0, 0.15) 0px 5px 10px;
border-radius: 5px;
width: 80%;
margin-right: 20px;
height: 65px;
resize: none;
}

#submitbtn{
  padding: 10px 20px;
position: absolute;
background:
#0B588C;
border: 1px solid
#0B588C;
box-sizing: border-box;
border-radius: 5px;
color:
#fff;
margin-top: 10px;
}

span{
  padding: 7px;
}

@media only screen and (max-width: 600px) {
h5{
    font-weight: 550;
    font-size: 18px;
    text-align: left;
    color: #EE7D00;
}
}
</style>
