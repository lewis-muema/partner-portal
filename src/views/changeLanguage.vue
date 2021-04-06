<template lang="html">
  <div class="container mt-5">
    <div class="row" >
        <div class='col-5'>
            <button class="change float-right mr-5 mt-5"> {{ $t('changeLanguage.change_language') }}</button>
        </div>
        <hr class='vertical' >
        <div class='col-6 mt-5 ml-5'>
            <p> {{ $t('changeLanguage.choose_preferred_language') }}</p>
            <el-select v-model="locale" placeholder="Select" class="select">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                </el-option>
                </el-select>
            <div class="mt-5">
                <el-button type="primary" class="px-5 mt-5 primary" @click="changeLanguage" >{{ $t('changeLanguage.save') }}</el-button>
            </div>
        </div>
    </div>
    <notify />
  </div>
</template>

<script>
import axios from 'axios';
import { mapMutations, mapActions, mapGetters } from 'vuex';
import notify from '../components/notification';


export default {
  name: 'changeLanguage',
  components: {
      notify,
  },
  data() {
    return {
      options: [
        {
          value: 'en',
          label: 'English (EN)',
        },
        {
        value: 'fr',
        label: 'Francais (FR)',
        },
      ],
      locale: 'en',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      partner_type: 1,
    };
  },
  computed: {
    ...mapGetters(['getSessionInfo']),
  },
  watch: {
    locale(val) {
      this.$i18n.locale = val;
      const countryCode = localStorage.getItem('countryCode');
      const acceptLanguage = `${val}-${countryCode}`;
      localStorage.setItem('timeLocale', val);
      localStorage.setItem('language', acceptLanguage);
      this.setLanguage(val);
    },
  },
  mounted() {
    this.locale = localStorage.getItem('timeLocale');
    this.getPartnerDetails();
  },
  methods: {
    ...mapMutations(['setLanguage']),
    ...mapActions({
      requestChangeLanguage: '$_user/requestChangeLanguage',
    }),
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    getPartnerDetails() {
      const session = this.getSessionInfo;
      const payload = {
        phone_no: session.phone,
      };
      axios.post(`${process.env.NODE_PARTNER_API}management/get_partner_details`, payload, this.config).then((response) => {
        this.partner_type = response.data.partner_type;
      })
      .catch(error => {
      });
    },
    changeLanguage() {
      const session = this.getSessionInfo;
      const payload = {
        preferred_language: this.locale,
      };
      switch (this.partner_type) {
        case 1:
          payload['rider_id'] = session.id;
          break;
        case 2:
          payload['owner_id'] = session.id;
          break;
        default:
          payload['owner_id'] = session.id;
          break;
      }
      axios.post(`${process.env.ADONIS_PRIVATE_API}user-preferences`, payload, this.config).then((response) => {
        this.message = response.status ? this.$t('changeLanguage.language_changed') : this.$t('changeLanguage.something_went_wrong');
        this.notify(3, 1, this.message);
      })
      .catch(error => {
        this.message = this.$t('changeLanguage.something_went_wrong');
        this.notify(3, 0, this.message);
      });
    },

  },

};
</script>

<style scoped>
.help-card {
  -webkit-box-flex: 1;
  flex: 1;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  padding-top: 30px;
  margin: -9% auto;
  max-width: 32rem;

}

.new-card2 {
  -webkit-box-flex: 1;
  flex: 1;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  padding-top: 3px ! important;

}
.select {
  width: 240px;
  height: 32px;
  background: #F7F9FC;
  border-radius: 4px;
}
.btn {
  width: 156px;
  height: 44px;
  margin-top: 60px;
}
.primary {
    background-color:#1b7fc3;
    width: 156px;
    height: 44px;
}
.vertical {
    border-right: 1px solid #e2e7ed;
    height: 500px;
}
.change {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 8px;

    position: static;
    width: 248px;
    height: 36px;
    left: 16px;
    top: 16px;

    background: #FFF3E6;
    border-radius: 4px;
    border: none;
}
</style>
