<template>
  <div>
    <verifier />
    <errorHandler :error="errorObj" v-if="errorObj" />
    <div v-if="phase === 1">
      <p class="signature--intro__header">Welcome to Sendy</p>
      <p class="signature--body__par">Welcome to Sendy! Before you get started here are the terms and conditions for <br />using our service. It is important to us that both partners(you) and customers <br />have the best possible experience</p>
      <p class="signature--body__par">By checking on the boxes you acknowledge you have <br />read and agree with the following terms:</p>
      <div class="signature--terms">
        <div class="signature--options">
          <input type="checkbox" class="signature--checkbox" name="" value="false" v-model="partnerStatus" />
          <span class="doc-link"><a class="doc-title" target="”_blank”" href="https://www.sendyit.com/partner-contract/service-agreement-ke">Partner Contract</a> This states the driver responsibilities, Payment terms and penalties</span>
        </div>
        <div class="signature--options">
          <input type="checkbox" class="signature--checkbox" name="" value="false" v-model="termStatus" />
          <span class="doc-link"><a class="doc-title" target="”_blank”" href="https://www.sendyit.com/terms">Terms and conditions</a></span>
        </div>
        <div class="signature--options">
          <input type="checkbox" class="signature--checkbox" name="" value="false" v-model="privacyStatus" />
          <span class="doc-link"><a class="doc-title" target="”_blank”" href="https://www.sendyit.com/privacy">Data and Privacy</a></span>
        </div>
        <br />
      </div>
      <div class="signature--terms signature--buttons">
        <button class="decline-button interaction-buttons" @click="decline()">DECLINE</button>
        <button class="interaction-buttons" :class="acceptStatus ? 'accept-button' : 'accept-button-inactive'" @click="phase = 2">ACCEPT</button>
      </div>
    </div>
    <div v-else>
      <div class="back-arrow" @click="phase = 1">
        <i class="material-icons">arrow_back</i>
      </div>
      <p class="signature--body__par">Sign to acknowledge that you have read, understood and accepted the partner terms and conditions for the use of Sendy</p>
      <VueSignaturePad class="signature-pad" width="400px" height="400px" ref="signaturePad" :options="{ onEnd }" />
      <div class="signature--terms signature--buttons">
        <button class="decline-button interaction-buttons" @click="undo()">CLEAR</button>
        <button class="interaction-buttons" :class="submitStatus ? 'accept-button' : 'accept-button-inactive'" @click="save()">SUBMIT</button>
      </div>
    </div>
    <notify />
  </div>
</template>

<script>
import S3 from 'aws-s3';
import axios from 'axios';
import verifier from '../components/verifier';
import errorHandler from '../components/errorHandler';
import notify from '../components/notification';

let s3 = '';

export default {
  components: {
    verifier,
    errorHandler,
    notify,
  },
  data() {
    return {
      errorObj: '',
      sessionInfo: '',
      phase: 1,
      partnerStatus: false,
      termStatus: false,
      privacyStatus: false,
      submitStatus: false,
      config: {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        },
      },
    };
  },
  computed: {
    acceptStatus() {
      if (this.privacyStatus && this.termStatus && this.partnerStatus) {
        return true;
      }
      return false;
    },
  },
  watch: {
    phase() {
      this.submitStatus = false;
    },
  },
  created() {
    this.sessionInfo = JSON.parse(localStorage.sessionData).payload;
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
  methods: {
    notify(status, type, message) {
      this.$root.$emit('Notification', status, type, message);
    },
    decline() {
      this.$router.push({ path: '/login' });
    },
    onEnd() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      this.submitStatus = !isEmpty;
    },
    undo() {
      this.$refs.signaturePad.clearSignature();
      this.submitStatus = false;
    },
    save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      this.submitStatus = false;
      this.download(data, 'signature.png');
    },
    download(dataURL, filename) {
      const blob = this.dataURLToBlob(dataURL);
      this.upload(blob, filename);
    },
    dataURLToBlob(dataURL) {
      const parts = dataURL.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
    },
    upload(blob, name) {
      const file = blob;
      const fileType = blob.type;
      const albumPhotosKey = `${encodeURIComponent('signature')}/t&c_owner_`;
      const photoKey = `${albumPhotosKey}${this.sessionInfo.id}`;
      s3.upload(
        {
          Key: photoKey,
          Body: file,
          ACL: 'public-read',
          ContentType: fileType,
        },
        (err, data) => {
          this.submitStatus = true;
          if (err) {
            this.notify(3, 0, `There was an error uploading your photo: ${err.message}`);
          } else {
            this.notify(3, 1, 'Signature submitted');
            this.submitSignature(`t&c_owner_${this.sessionInfo.id}.png`);
          }
          // eslint-disable-next-line comma-dangle
        }
      );
    },
    submitSignature(key) {
      const payload = {
        phone_no: this.sessionInfo.phone,
        s3_key: key,
        document: 'signature',
        is_owner: true,
      };
      axios
        .post(`${process.env.VUE_APP_AUTH}partner/v1/management/post_partner_documents`, payload, this.config)
        .then(response => {
          this.notify(3, 1, 'Contract signed successfully');
          this.$router.push({ path: '/' });
        })
        .catch(error => {
          this.notify(3, 0, 'Failed to sign contract');
        });
    },
  },
};
</script>

<style>
.signature--intro__header {
  text-align: center;
  color: black;
  font-weight: bold;
  font-size: 56px;
  margin-top: 75px;
  margin-bottom: 20px;
}
.signature--body__par {
  font-size: 20px;
  line-height: 32px;
  text-align: center;
  color: black;
  padding: 10px;
}
.signature--terms {
  width: 350px;
  display: block;
  margin: auto;
}
.signature--options {
  min-height: 60px;
}
.doc-link {
  padding-left: 10px;
}
.doc-title {
  color: #EE7D00;
  font-weight: 600;
}
.accept-button {
  background: #EE7D00;
  color: white;
  float: right;
  border: 1px solid #EE7D00;
}
.accept-button-inactive {
  background: rgb(154, 172, 192);
  color: white;
  float: right;
  pointer-events: none;
  border: 1px solid rgb(154, 172, 192);
}
.decline-button {
  background: white;
  color: #EE7D00;
  border: 1px solid #EE7D00;
}
.interaction-buttons {
  border-radius: 5px;
  width: 45%;
  height: 40px;
  font-weight: 600;
  font-size: 17px !important;
}
.signature-pad {
  display: block;
  margin: auto;
  border: 1px solid;
  margin-top: 5px;
  margin-bottom: 20px;
}
.back-arrow {
  width: 60px;
  height: 60px;
  border-radius: 50px;
  box-shadow: 0px 1px 13px 0px rgba(108, 133, 159, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 23px;
  cursor: pointer;
}
.signature--buttons {
  padding-bottom: 40px;
}
.signature--checkbox {
  width: max-content !important;
  height: max-content !important;
}
</style>
