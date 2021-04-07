<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="banks__container">
      <!--confirm bank details tab-->
      <div class="banks__confirm-banks-blinder">
        <div class="banks__confirm-banks-withdraw-popup banks__confirm-banks-row">
          <div class="popup-row banks__confirm-banks-row">
            <span class="banks__heavy-font"> {{ $t('banks.confirm_details') }}</span>
            <span>
              <i class="material-icons banks__confirm-banks-cancel-icon" @click="confirmDetails()">cancel</i>
            </span>
          </div>
          <div class="confirm-details-section">
            <p class="banks__heavy-font no-margin font-16 color-black"> {{ $t('banks.bank_name') }}</p>
            <p class="font-16">{{ getBankName(bankid) }}</p>
            <p class="banks__heavy-font no-margin font-16 color-black"> {{ $t('banks.bank_branch') }} </p>
            <p class="font-16">{{ branch }}</p>
            <p class="banks__heavy-font no-margin font-16 color-black"> {{ $t('banks.account_name') }} </p>
            <p class="font-16">{{ name }}</p>
            <p class="banks__heavy-font no-margin font-16 color-black"> {{ $t('banks.account_number') }}</p>
            <p class="font-16">{{ account }}</p>
          </div>
          <p class="banks__edit-details banks__confirm-banks-last-row banks__heavy-font font-16 color-black" @click="confirmDetails()"> {{ $t('banks.edit') }}</p>
          <button class="full-width input-height submit banks__confirm-banks-last-row banks__active-buttons" v-if="!sendingCodeStatus" @click="sendCode(1)"> {{ $t('banks.submit') }} </button>
          <button class="full-width input-height submit banks__confirm-banks-last-row" disabled v-else> {{ $t('banks.submit') }}</button>
        </div>
      </div>
      <!--Show existing owner bank accounts tab-->
      <div class="banks__existing-accounts">
        <p class="banks__bank-text-head">  {{ $t('banks.bank_account') }}</p>
        <button class="banks__add-account-button" @click="addAccount()"> {{ $t('banks.add_bank_account') }}</button>
        <div class="banks__banks-table" v-if="!Mobile">
          <div class="banks__table-head">
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16"> {{ $t('banks.bank') }}</p>
            </div>
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16"> {{ $t('banks.bank_branch') }}</p>
            </div>
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16"> {{ $t('banks.account_name') }}</p>
            </div>
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16"> {{ $t('banks.account_number') }}</p>
            </div>
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16"> {{ $t('banks.status') }}</p>
            </div>
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16"> {{ $t('banks.action') }} </p>
            </div>
          </div>
          <div class="banks__loader" v-if="accounts.length === 0 && !recievedResponse"></div>
          <div class="banks__no-banks-par" v-if="accounts.length === 0 && recievedResponse">
            <p> {{ $t('banks.no_banks_found') }}</p>
          </div>
          <div class="banks__table-rows" v-for="account1 in accounts" :key="account1.account_no">
            <div class="banks__table-col">
              <p class="no-margin small-font color-black">{{ account1.bank_name }}</p>
            </div>
            <div class="banks__table-col">
              <p class="no-margin small-font color-black">{{ account1.bank_branch }}</p>
            </div>
            <div class="banks__table-col">
              <p class="no-margin small-font color-black">{{ account1.account_name }}</p>
            </div>
            <div class="banks__table-col">
              <p class="no-margin small-font color-black">{{ account1.account_no }}</p>
            </div>
            <div class="banks__table-col">
              <p class="no-margin small-font color-black" v-if="account1.admin_approval === 0"> {{ $t('banks.not_approved') }}</p>
              <p class="no-margin small-font color-black" v-if="account1.admin_approval === 1"> {{ $t('banks.approved') }}</p>
              <p class="no-margin small-font color-black" v-if="account1.admin_approval === 2"> {{ $t('banks.declined') }}</p>
            </div>
            <div class="banks__table-col">
              <p class="no-margin banks__edit-bank-details" @click="addAccount(account1.id)" v-if="account1.admin_approval === 0"> {{ $t('banks.edit_capital') }}</p>
              <p class="no-margin banks__no-edit-bank-details" v-if="account1.admin_approval === 1 || account1.admin_approval === 2"> {{ $t('banks.edit_capital') }}</p>
            </div>
          </div>
        </div>
        <div class="banks__table--mobi" v-if="Mobile">
          <div class="banks__table-head--mobi">
            <p class="banks__table-header--mobi"> {{ $t('banks.banks') }}</p>
          </div>
          <div class="banks__loader" v-if="accounts.length === 0 && !recievedResponse"></div>
          <div class="banks__no-banks-par" v-if="accounts.length === 0 && recievedResponse">
            <p> {{ $t('banks.no_banks_found') }}</p>
          </div>
          <div class="banks__table-rows--mobi" v-for="account1 in accounts" :key="account1.account_no">
            <div class="banks__table-col--mobi">
              <p class="bolded"> {{ $t('banks.bank_name_capital') }} </p>
              <p class="no-margin small-font">{{ account1.bank_name }}</p>
            </div>
            <div class="banks__table-col--mobi">
              <p class="bolded"> {{ $t('banks.bank_name_capital') }}</p>
              <p class="no-margin small-font">{{ account1.bank_branch }}</p>
            </div>
            <div class="banks__table-col--mobi">
              <p class="bolded"> {{ $t('banks.account_name_capital') }} </p>
              <p class="no-margin small-font">{{ account1.account_name }}</p>
            </div>
            <div class="banks__table-col--mobi">
              <p class="bolded"> {{ $t('banks.account_number_capital') }}</p>
              <p class="no-margin small-font">{{ account1.account_no }}</p>
            </div>
            <div class="banks__table-col--mobi">
              <p class="bolded"> {{ $t('banks.status') }}</p>
              <p class="no-margin small-font" v-if="account1.admin_approval === 0"> {{ $t('banks.not_approved') }}</p>
              <p class="no-margin small-font" v-if="account1.admin_approval === 1"> {{ $t('banks.approved') }}</p>
              <p class="no-margin small-font" v-if="account1.admin_approval === 2"> {{ $t('banks.declined') }}</p>
            </div>
            <div class="banks__table-col--mobi">
              <p class="bolded"> {{ $t('banks.action') }}</p>
              <p class="no-margin banks__edit-bank-details--mobi" v-if="account1.admin_approval === 0" @click="addAccount(account1.id)"> {{ $t('banks.edit_capital') }}</p>
              <p class="no-margin banks__no-edit-bank-details" v-if="account1.admin_approval === 1 || account1.admin_approval === 2"> {{ $t('banks.edit_capital') }}</p>
            </div>
          </div>
        </div>
      </div>
      <!--check verification code section-->
      <div class="banks__verify-code-section">
        <i class="material-icons arrow" @click="verifyDetails()">arrow_back</i>
        <div class="banks__verify-tab">
          <p class="banks__verify-text font-16"> {{ $t('banks.for_your_security') }} <span class="resend-code" @click="sendCode(2)"> {{ $t('banks.resend_code') }}</span></p>
          <input class="banks__verify-inputs" maxlength="4" type="text" v-model="inputCode" />
          <button class="banks__verify-inputs banks__active-buttons" v-if="verifyCodeStatus" @click="verifyCode()"> {{ $t('banks.verify') }}</button>
          <button class="banks__verify-inputs" disabled v-else> {{ $t('banks.verifying_code') }}</button>
        </div>
      </div>
      <!--add new bank account tab-->
      <div class="banks__new-accounts">
        <!-- prettier-ignore -->
        <i class="material-icons arrow" @click="addAccount(); fetchOwnerBanks();">arrow_back</i>
        <div class="banks__new-bank-account">
          <div class="banks__new-bank-account-head no-margin">
            <p class="banks__new-bank-account-par no-margin font-16"> {{ $t('banks.new_bank_account') }}</p>
          </div>
          <div class="banks__new-bank-account-body">
            <p class="banks__input-width font-16">
              <span class="margin-right"> {{ $t('banks.bank_name_capital') }}</span>
              <span>
                <select class="banks__new-account-input" @change="bankNameCheckpoint()" v-model="bankid">
                  <option selected value="null"> {{ $t('banks.select_bank') }}</option>
                  <option class :value="bank.payment_bank_id" v-for="bank in banks" :key="bank.bankid">{{ bank.name }}</option>
                </select>
              </span>
            </p>
            <p class="banks__input-width font-16">
              <span class="margin-right"> {{ $t('banks.bank_branch_capital') }}</span>
              <span>
                <input class="banks__new-account-input" type="text" v-model="branch" @input="bankBranchCheckpoint()" />
              </span>
            </p>
            <p class="banks__input-width font-16">
              <span class="margin-right"> {{ $t('banks.account_name_capital') }}</span>
              <span>
                <input class="banks__new-account-input" type="text" v-model="name" @input="accountNameCheckpoint()" />
              </span>
            </p>
            <p class="banks__input-width font-16">
              <span class="margin-right"> {{ $t('banks.account_number_capital') }}</span>
              <span>
                <input class="banks__new-account-input" type="text" v-model="account" @input="accountNoCheckpoint()" />
              </span>
            </p>
            <button class="banks__input-button submit banks__active-buttons" v-if="submitStatus" @click="confirmDetails()"> {{ $t('banks.submit') }}</button>
            <button class="banks__input-button submit" disabled v-else> {{ $t('banks.submit') }}</button>
          </div>
        </div>
      </div>
      <notify />
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import axios from 'axios';
import moment from 'moment';
import Mixpanel from 'mixpanel';
import notify from '../components/notification';
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';

const mixpanel = Mixpanel.init(process.env.MIXPANEL);
export default {
  title: 'Partner Portal - Banks',
  components: {
    verifier,
    errorHandler,
    notify,
  },
  data() {
    return {
      accounts: [],
      opened: false,
      addAccountStatus: false,
      confirmAccountStatus: false,
      verifyDetailsStatus: false,
      verifyCodeStatus: true,
      bankid: null,
      branch: '',
      account: '',
      name: '',
      recordId: '',
      status: 1,
      requestId: '',
      inputCode: '',
      notificationMessage: '',
      notificationType: 'failed',
      notificationName: 'message-box',
      sendingCodeStatus: false,
      submitStatus: false,
      codeResponseNumber: 0,
      verifyResponseNumber: 0,
      responseCount: 0,
      editStatus: 0,
      recievedResponse: '',
      banksCount: 0,
      banks: [],
      Mobile: false,
      sessionInfo: '',
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      },
      errorObj: '',
    };
  },
  created() {
    if (localStorage.sessionData) {
      this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
      if (localStorage.time) {
        if (Date() > localStorage.time) {
          localStorage.requestId = '';
          localStorage.time = '';
          this.requestId = '';
        } else {
          this.requestId = localStorage.requestId;
        }
      } else {
        this.requestId = '';
      }
      if (window.innerWidth > 450) {
        this.Mobile = false;
      } else {
        this.Mobile = true;
      }
      window.addEventListener('resize', this.isMobile);
      this.fetchOwnerBanks();
      this.fetchAllBanks();
    }
  },
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    isMobile() {
      if (window.innerWidth > 450) {
        this.Mobile = false;
      } else {
        this.Mobile = true;
      }
    },
    addAccount(id) {
      if (id >= 0) {
        this.bankid = this.accounts[id].payment_bank_id;
        this.branch = this.accounts[id].bank_branch;
        this.account = this.accounts[id].account_no;
        this.name = this.accounts[id].account_name;
        this.recordId = this.accounts[id].owner_bank_account_id;
        this.submitStatus = true;
        this.editStatus = 1;
      } else {
        this.bankid = null;
        this.branch = '';
        this.account = '';
        this.name = '';
        this.submitStatus = false;
        this.editStatus = 0;
      }
      if (this.addAccountStatus) {
        this.addAccountStatus = false;
        $('.banks__new-accounts').css('display', 'none');
        $('.banks__existing-accounts').css('display', 'block');
      } else {
        this.addAccountStatus = true;
        $('.banks__new-accounts').css('display', 'block');
        $('.banks__existing-accounts').css('display', 'none');
      }
    },
    getBankName(id) {
      if (id) {
        return this.banks[id - 1].name;
      }
    },
    confirmDetails() {
      if (this.confirmAccountStatus) {
        this.confirmAccountStatus = false;
        $('.banks__confirm-banks-blinder').css('display', 'none');
      } else {
        this.confirmAccountStatus = true;
        $('.banks__confirm-banks-blinder').css('display', 'flex');
      }
    },
    verifyDetails() {
      this.verifyCodeStatus = true;
      if (this.verifyDetailsStatus) {
        this.verifyDetailsStatus = false;
        $('.banks__confirm-banks-blinder').css('display', 'flex');
        $('.banks__new-accounts').css('display', 'block');
        $('.banks__verify-code-section').css('display', 'none');
      } else {
        this.verifyDetailsStatus = true;
        $('.banks__confirm-banks-blinder').css('display', 'none');
        $('.banks__new-accounts').css('display', 'none');
        $('.banks__verify-code-section').css('display', 'block');
      }
    },
    verifyCode() {
      this.verifyResponseNumber = 0;
      this.notify(1, 2, 'Verifying code');
      this.sendingCodeStatus = true;
      this.verifyCodeStatus = false;
      const payload = JSON.stringify({
        code: this.inputCode,
        request_id: this.requestId,
      });

      axios
        .post(`${process.env.VUE_APP_AUTH}v1/check_verification`, payload, this.config)
        .then(response => {
          this.handleVerificationResponse(response);
        })
        .catch(error => {
          this.handleVerificationResponse(error.response);
          this.errorObj = error.response;
          this.handleError(error, 1);
        });
    },
    handleVerificationResponse(response) {
      const parsedResponse = response.data;
      if (parsedResponse.status) {
        this.sendOwnerBanks();
        setTimeout(() => {
          this.verifyDetails();
          this.confirmDetails();
          this.addAccount();
          this.fetchOwnerBanks();
        }, 2000);
        this.sendingCodeStatus = false;
        localStorage.requestId = '';
        this.requestId = '';
      } else {
        this.sendingCodeStatus = false;
        this.notify(3, 0, this.handleNotifications(parsedResponse));
      }
    },
    handleNotifications(parsedResponse) {
      if (parsedResponse.message === 'The code provided does not match the expected value') {
        const date = new Date();
        const time = new Date(localStorage.time);
        time.setMinutes(time.getMinutes() + 20);
        if (Date() < localStorage.time && Date() > time) {
          return '';
        } else {
          this.verifyCodeStatus = true;
          return this.$t('banks.enter_correct_verification_code');
        }
      } else if (parsedResponse.message.indexOf('it has been verified already') > -1) {
        localStorage.requestId = '';
        this.requestId = '';
        this.verifyCodeStatus = false;
        return this.$t('banks.failed_to_verify');
      } else if (parsedResponse.message.indexOf('Your request is incomplete and missing the mandatory parameter') > -1) {
        this.verifyCodeStatus = true;
        return this.$t('banks.please_enter_full_verification_code');
      } else if (parsedResponse.message.indexOf('A wrong code was provided too many times') > -1) {
        localStorage.requestId = '';
        this.requestId = '';
        this.verifyCodeStatus = false;
        return this.$t('banks.wrong_code_entered_many_times');
      }
    },
    sendCode(code) {
      if (this.requestId !== '') {
        if (code === 1) {
          this.verifyDetails();
        }
        this.notify(3, 2, this.$t('banks.pending_verification_code'));
      } else {
        this.codeResponseNumber = 0;
        this.notify(1, 2, this.$t('banks.sending_code'));
        this.sendingCodeStatus = true;
        const payload = JSON.stringify({
          number: this.sessionInfo.phone,
        });
        axios
          .post(`${process.env.VUE_APP_AUTH}v1/request_verification`, payload, this.config)
          .then(response => {
            this.handleSendCodeResponse(response);
          })
          .catch(error => {
            this.errorObj = error.response;
            this.handleError(error, 2);
          });
      }
    },
    handleSendCodeResponse(response) {
      const parsedResponse = response.data;
      if (parsedResponse.status) {
        this.requestId = parsedResponse.request_id;
        const date = new Date();
        date.setMinutes(date.getMinutes() + 20);
        localStorage.requestId = parsedResponse.request_id;
        localStorage.time = date;
        this.notify(3, 1, `${this.$t('banks.code_sent_to')} ${this.sessionInfo.phone}`);
        this.sendingCodeStatus = false;
        this.inputCode = '';
        this.verifyDetails();
      } else {
        this.sendingCodeStatus = false;
        this.notify(3, 0, parsedResponse.message);
      }
    },
    handleError(error, i) {
      const parsedResponse = response.data;
      this.sendingCodeStatus = false;
      if (i === 1) {
        this.notify(3, 0, parsedResponse.message);
      }
    },
    fetchOwnerBanks() {
      this.responseCount = 0;
      this.recievedResponse = '';
      this.accounts = [];
      const payload = JSON.stringify({
        owner_id: this.sessionInfo.id,
      });
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/get_owner_bank_accounts`, payload, this.config)
        .then(response => {
          const parsedResponse = response.data;
          this.recievedResponse = parsedResponse.status;
          parsedResponse.data.forEach((row, i) => {
            row.id = i;
            this.accounts.push(row);
          });
        })
        .catch(error => {
          this.errorObj = error.response;
          this.handleError(error, 1);
        });
    },
    fetchAllBanks() {
      this.banksCount = 0;
      this.banks = [];
      axios
        .get(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/banks`, this.config)
        .then(response => {
          const parsedResponse = response.data;
          this.recievedResponse = parsedResponse.status;
          parsedResponse.data.forEach((row, i) => {
            row.id = i;
            this.banks.push(row);
          });
        })
        .catch(error => {
          this.errorObj = error.response;
          this.handleError(error, 1);
        });
    },
    sendOwnerBanks() {
      const payload = JSON.stringify({
        owner_id: this.sessionInfo.id,
        account_no: this.account,
        account_name: this.name,
        bank_branch: this.branch,
        owner_bank_account_id: this.recordId,
        payment_bank_id: this.bankid,
      });
      if (this.editStatus === 0) {
        axios
          .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/add_owner_bank_account`, payload, this.config)
          .then(response => {
            if (response.data.status) {
              this.notify(3, 1, response.data.message);
              this.TrackBankAddition(payload);
            } else {
              this.notify(3, 0, response.data.message);
            }
          })
          .catch(error => {
            this.errorObj = error.response;
            this.handleError(error, 1);
          });
      } else {
        axios
          .post(`${process.env.VUE_APP_AUTH}partner/v1/partner_portal/edit_owner_bank_account`, payload, this.config)
          .then(response => {
            if (response.data.status) {
              this.notify(3, 1, response.data.message);
            } else {
              this.notify(3, 0, response.data.message);
            }
          })
          .catch(error => {
            this.errorObj = error.response;
            this.handleError(error, 1);
          });
      }
    },
    bankNameCheckpoint() {
      this.bankDetailsCheckpoint();
    },
    bankBranchCheckpoint(id) {
      if (this.branch.charAt(0) === ' ') {
        this.branch = this.branch.replace(/^\s+|\s+$/g, '');
      }
      this.bankDetailsCheckpoint();
    },
    accountNameCheckpoint(id) {
      if (this.name.charAt(0) === ' ') {
        this.name = this.name.replace(/^\s+|\s+$/g, '');
      }
      this.bankDetailsCheckpoint();
    },
    accountNoCheckpoint(id) {
      if (this.account.charAt(0) === ' ') {
        this.account = this.account.replace(/^\s+|\s+$/g, '');
      }
      this.bankDetailsCheckpoint();
    },
    bankDetailsCheckpoint() {
      if (this.bankid !== null && this.bankid !== 'null' && this.branch && this.name && this.account && this.account.length >= 5) {
        this.submitStatus = true;
      } else {
        this.submitStatus = false;
      }
    },
    TrackBankAddition(payload) {
      const data = JSON.parse(payload);
      if (process.env.DOCKER_ENV === 'production') {
        mixpanel.track('Owner Bank Addition', data);
      }
    },
  },
};
</script>

<style></style>
