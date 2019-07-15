<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div class="banks__container">
      <!--notification messages-->
      <div :class="`notification-popup pop-up-${notificationType} ${notificationName}`">
        <p class="no-margin color-white">{{ notificationMessage }}</p>
        <div class="loader" v-if="sendingCodeStatus"></div>
      </div>
      <!--confirm bank details tab-->
      <div class="banks__confirm-banks-blinder">
        <div class="banks__confirm-banks-withdraw-popup banks__confirm-banks-row">
          <div class="popup-row banks__confirm-banks-row">
            <span class="banks__heavy-font">Confirm Details</span>
            <span>
              <i
                class="material-icons banks__confirm-banks-cancel-icon"
                @click="confirmDetails()"
              >cancel</i>
            </span>
          </div>
          <div class="confirm-details-section">
            <p class="banks__heavy-font no-margin font-16 color-black">Bank name</p>
            <p class="font-16">{{ getBankName(bankid) }}</p>
            <p class="banks__heavy-font no-margin font-16 color-black">Bank branch</p>
            <p class="font-16">{{ branch }}</p>
            <p class="banks__heavy-font no-margin font-16 color-black">Account name</p>
            <p class="font-16">{{ name }}</p>
            <p class="banks__heavy-font no-margin font-16 color-black">Account number</p>
            <p class="font-16">{{ account }}</p>
          </div>
          <p
            class="banks__edit-details banks__confirm-banks-last-row banks__heavy-font font-16 color-black"
            @click="confirmDetails()"
          >edit</p>
          <button
            class="full-width input-height submit banks__confirm-banks-last-row banks__active-buttons"
            v-if="!sendingCodeStatus"
            @click="sendCode();"
          >submit</button>
          <button
            class="full-width input-height submit banks__confirm-banks-last-row"
            disabled
            v-else
          >submit</button>
        </div>
      </div>
      <!--Show existing owner bank accounts tab-->
      <div class="banks__existing-accounts">
        <p class="banks__bank-text-head">Bank Account</p>
        <button class="banks__add-account-button" @click="addAccount()">Add bank account</button>
        <div class="banks__banks-table" v-if="!Mobile">
          <div class="banks__table-head">
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16">Bank</p>
            </div>
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16">Bank branch</p>
            </div>
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16">Account name</p>
            </div>
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16">Account number</p>
            </div>
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16">Status</p>
            </div>
            <div class="banks__table-head-col">
              <p class="no-margin color-white font-16">Action</p>
            </div>
          </div>
          <div class="banks__loader" v-if="accounts.length === 0 && !recievedResponse"></div>
          <div class="banks__no-banks-par" v-if="accounts.length === 0 && recievedResponse">
            <p>No banks found</p>
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
              <p
                class="no-margin small-font color-black"
                v-if="account1.admin_approval === 0"
              >Not Approved</p>
              <p
                class="no-margin small-font color-black"
                v-if="account1.admin_approval === 1"
              >Approved</p>
              <p
                class="no-margin small-font color-black"
                v-if="account1.admin_approval === 2"
              >Declined</p>
            </div>
            <div class="banks__table-col">
              <p
                class="no-margin banks__edit-bank-details"
                @click="addAccount(account1.id)"
                v-if="account1.admin_approval === 0"
              >Edit</p>
              <p
                class="no-margin banks__no-edit-bank-details"
                v-if="account1.admin_approval === 1 || account1.admin_approval === 2"
              >Edit</p>
            </div>
          </div>
        </div>
        <div class="banks__table--mobi" v-if="Mobile">
          <div class="banks__table-head--mobi">
            <p class="banks__table-header--mobi">Banks</p>
          </div>
          <div class="banks__loader" v-if="accounts.length === 0 && !recievedResponse"></div>
          <div class="banks__no-banks-par" v-if="accounts.length === 0 && recievedResponse">
            <p>No banks found</p>
          </div>
          <div
            class="banks__table-rows--mobi"
            v-for="account1 in accounts"
            :key="account1.account_no"
          >
            <div class="banks__table-col--mobi">
              <p class="bolded">Bank Name</p>
              <p class="no-margin small-font">{{ account1.bank_name }}</p>
            </div>
            <div class="banks__table-col--mobi">
              <p class="bolded">Bank Branch</p>
              <p class="no-margin small-font">{{ account1.bank_branch }}</p>
            </div>
            <div class="banks__table-col--mobi">
              <p class="bolded">Account Name</p>
              <p class="no-margin small-font">{{ account1.account_name }}</p>
            </div>
            <div class="banks__table-col--mobi">
              <p class="bolded">Account Number</p>
              <p class="no-margin small-font">{{ account1.account_no }}</p>
            </div>
            <div class="banks__table-col--mobi">
              <p class="bolded">Status</p>
              <p class="no-margin small-font" v-if="account1.admin_approval === 0">Not Approved</p>
              <p class="no-margin small-font" v-if="account1.admin_approval === 1">Approved</p>
              <p class="no-margin small-font" v-if="account1.admin_approval === 2">Declined</p>
            </div>
            <div class="banks__table-col--mobi">
              <p class="bolded">Action</p>
              <p
                class="no-margin banks__edit-bank-details--mobi"
                v-if="account1.admin_approval === 0"
                @click="addAccount(account1.id)"
              >Edit</p>
              <p
                class="no-margin banks__no-edit-bank-details"
                v-if="account1.admin_approval === 1 || account1.admin_approval === 2"
              >Edit</p>
            </div>
          </div>
        </div>
      </div>
      <!--check verification code section-->
      <div class="banks__verify-code-section">
        <i class="material-icons arrow" @click="verifyDetails()">arrow_back</i>
        <div class="banks__verify-tab">
          <p
            class="banks__verify-text font-16"
          >For your security, Sendy wants to make sure it’s really you. An SMS with your verification code was sent to your phone. Resend code</p>
          <input class="banks__verify-inputs" maxlength="4" type="text" v-model="inputCode" />
          <button
            class="banks__verify-inputs banks__active-buttons"
            v-if="verifyCodeStatus"
            @click="verifyCode()"
          >verify</button>
          <button class="banks__verify-inputs" disabled v-else>verify</button>
        </div>
      </div>
      <!--add new bank account tab-->
      <div class="banks__new-accounts">
        <i class="material-icons arrow" @click="addAccount(); fetchOwnerBanks()">arrow_back</i>
        <div class="banks__new-bank-account">
          <div class="banks__new-bank-account-head no-margin">
            <p class="banks__new-bank-account-par no-margin font-16">New Bank Account</p>
          </div>
          <div class="banks__new-bank-account-body">
            <p class="banks__input-width font-16">
              <span class="margin-right">Bank name</span>
              <span>
                <select
                  class="banks__new-account-input"
                  @change="bankNameCheckpoint()"
                  v-model="bankid"
                >
                  <option selected value="null">Select Bank</option>
                  <option
                    class
                    :value="bank.payment_bank_id"
                    v-for="bank in banks"
                    :key="bank.bankid"
                  >{{ bank.name }}</option>
                </select>
              </span>
            </p>
            <p class="banks__input-width font-16">
              <span class="margin-right">Bank Branch</span>
              <span>
                <input
                  class="banks__new-account-input"
                  type="text"
                  v-model="branch"
                  @input="bankBranchCheckpoint()"
                />
              </span>
            </p>
            <p class="banks__input-width font-16">
              <span class="margin-right">Account name</span>
              <span>
                <input
                  class="banks__new-account-input"
                  type="text"
                  v-model="name"
                  @input="accountNameCheckpoint()"
                />
              </span>
            </p>
            <p class="banks__input-width font-16">
              <span class="margin-right">Account number</span>
              <span>
                <input
                  class="banks__new-account-input"
                  type="text"
                  v-model="account"
                  @input="accountNoCheckpoint()"
                />
              </span>
            </p>
            <button
              class="banks__input-button submit banks__active-buttons"
              v-if="submitStatus"
              @click="confirmDetails()"
            >Submit</button>
            <button class="banks__input-button submit" disabled v-else>Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';

const axios = require('axios');
const moment = require('moment');

export default {
  components: {
    verifier,
    errorHandler,
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
      // this.trackPage();
    }
  },
  methods: {
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
        document.querySelector('.banks__new-accounts').style.display = 'none';
        document.querySelector('.banks__existing-accounts').style.display = 'block';
      } else {
        this.addAccountStatus = true;
        document.querySelector('.banks__new-accounts').style.display = 'block';
        document.querySelector('.banks__existing-accounts').style.display = 'none';
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
        document.querySelector('.banks__confirm-banks-blinder').style.display = 'none';
      } else {
        this.confirmAccountStatus = true;
        document.querySelector('.banks__confirm-banks-blinder').style.display = 'flex';
      }
    },
    verifyDetails() {
      this.verifyCodeStatus = true;
      if (this.verifyDetailsStatus) {
        this.verifyDetailsStatus = false;
        document.querySelector('.banks__confirm-banks-blinder').style.display = 'flex';
        document.querySelector('.banks__new-accounts').style.display = 'block';
        document.querySelector('.banks__verify-code-section').style.display = 'none';
      } else {
        this.verifyDetailsStatus = true;
        document.querySelector('.banks__confirm-banks-blinder').style.display = 'none';
        document.querySelector('.banks__new-accounts').style.display = 'none';
        document.querySelector('.banks__verify-code-section').style.display = 'block';
      }
    },
    verifyCode() {
      this.verifyResponseNumber = 0;
      this.notificationName = 'message-box-up';
      this.notificationType = 'sending';
      this.notificationMessage = 'Verifying code';
      this.sendingCodeStatus = true;
      this.verifyCodeStatus = false;
      const payload = JSON.stringify({
        code: this.inputCode,
        request_id: this.requestId,
      });

      axios
        .post(`${process.env.VUE_APP_AUTH}private/parcel/index.php/api/v11/check_verification`, payload, this.config)
        .then(response => {
          this.handleVerificatioResponse(response);
        })
        .catch(error => {
          this.errorObj = error.response;
          this.handleError(error, 1);
        });
    },
    handleVerificatioResponse(response) {
      const parsedResponse = response.data;
      if (parsedResponse.status) {
        this.sendOwnerBanks();
        //   this.trackBankAddition();
        setTimeout(() => {
          this.verifyDetails();
          this.confirmDetails();
          this.addAccount();
          this.fetchOwnerBanks();
        }, 2000);
        this.sendingCodeStatus = false;
        localStorage.requestId = '';
        this.requestId = '';
        setTimeout(() => {
          this.notificationName = 'message-box-down';
        }, 4000);
      } else {
        this.sendingCodeStatus = false;
        this.notificationName = 'message-box-up';
        this.notificationType = 'failed';
        this.handleNotifications(parsedResponse);
        setTimeout(() => {
          this.notificationName = 'message-box-down';
        }, 4000);
      }
    },
    handleNotifications(parsedResponse) {
      if (parsedResponse.message === 'The code provided does not match the expected value') {
        const date = new Date();
        const time = new Date(localStorage.time);
        time.setMinutes(time.getMinutes() + 20);
        if (Date() < localStorage.time && Date() > time) {
          // nothing here
        } else {
          this.notificationMessage = 'Please enter the correct verification code';
          this.verifyCodeStatus = true;
        }
      } else if (parsedResponse.message.indexOf('it has been verified already') > -1) {
        this.notificationMessage = 'Failed to verify, Please request for another code';
        localStorage.requestId = '';
        this.requestId = '';
        this.verifyCodeStatus = false;
      } else if (parsedResponse.message.indexOf('Your request is incomplete and missing the mandatory parameter') > -1) {
        this.notificationMessage = 'Please enter the full verification code';
        this.verifyCodeStatus = true;
      } else if (parsedResponse.message.indexOf('A wrong code was provided too many times') > -1) {
        this.notificationMessage = 'A wrong code was entered too many times, Please request for another';
        localStorage.requestId = '';
        this.requestId = '';
        this.verifyCodeStatus = false;
      }
    },
    sendCode() {
      if (this.requestId !== '') {
        this.verifyDetails();
        this.notificationName = 'message-box-up';
        this.notificationType = 'sending';
        this.notificationMessage = 'You have a pending verification code';
        setTimeout(() => {
          this.notificationName = 'message-box-down';
        }, 3000);
      } else {
        this.codeResponseNumber = 0;
        this.notificationName = 'message-box-up';
        this.notificationType = 'sending';
        this.notificationMessage = 'Sending Code';
        this.sendingCodeStatus = true;
        const payload = JSON.stringify({
          phone_no: this.sessionInfo.phone,
        });
        axios
          .post(`${process.env.VUE_APP_AUTH}private/parcel/index.php/api/v11/verify_phone`, payload, this.config)
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
        this.sendingCodeStatus = false;
        this.notificationType = 'success';
        this.notificationMessage = `Code has been sent to ${this.sessionInfo.phone}`;
        this.inputCode = '';
        this.verifyDetails();
        setTimeout(() => {
          this.notificationName = 'message-box-down';
        }, 3000);
      } else {
        this.sendingCodeStatus = false;
        this.notificationType = 'failed';
        this.notificationMessage = parsedResponse.message;
        setTimeout(() => {
          this.notificationName = 'message-box-down';
        }, 4000);
      }
    },
    handleError(error, i) {
      const parsedResponse = response.data;
      this.sendingCodeStatus = false;
      if (i === 1) {
        this.notificationName = 'message-box-up';
      }
      this.notificationType = 'failed';
      this.notificationMessage = parsedResponse.message;
      setTimeout(() => {
        this.notificationName = 'message-box-down';
      }, 4000);
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
              this.notificationType = 'success';
              this.notificationMessage = response.data.message;
            } else {
              this.notificationType = 'failed';
              this.notificationMessage = response.data.message;
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
              this.notificationType = 'success';
              this.notificationMessage = response.data.message;
            } else {
              this.notificationType = 'failed';
              this.notificationMessage = response.data.message;
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
    trackBankAddition() {
      const env = '<?php echo ENVIRONMENT; ?>';
      if (env === 'production') {
        mixpanel.track('Bank application submit (partner portal)');
      } else {
        mixpanel.track('Test Bank application submit (partner portal)');
      }
    },
    trackPage() {
      const env = '<?php echo ENVIRONMENT; ?>';
      if (env === 'production') {
        mixpanel.track('Bank page view (partner portal)');
      } else {
        mixpanel.track('Test Bank page view (partner portal)');
      }
    },
  },
};
</script>

<style>
</style>
