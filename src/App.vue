<template>
  <div id="app">
    <loginHeader v-if="this.$route.name === 'logIn' || this.$route.name === 'driverRequest' || this.$route.name === 'driverRequestBlank' || this.$route.name === 'externalTrackingAll' || this.$route.name === 'externalTrackingId' || this.$route.name === 'externalTrackingFrom' || this.$route.name === 'externalTrackingBlank' || this.$route.name === 'externallogin' || this.$route.name === 'authlogin' || this.$route.name === 'signature' || this.$route.name === 'bidding' || this.$route.name === 'webform' || this.$route.name === 'recipient'" />
    <appHeader v-else />
    <router-view />
  </div>
</template>
<script>
import axios from 'axios';
import appHeader from './components/headers/appHeader';
import loginHeader from './components/headers/logInHeader';

let session = null;

export default {
  components: {
    appHeader,
    loginHeader,
  },
  watch: {
    $route(to, from) {
      if ((from.path === '/login' && to.path === '/') || (from.path === '/login' && to.path === '/signature') || to.path === '/login') {
        this.initializeFreshChat();
      }
    },
  },
  mounted() {
    this.initializeFreshChat();
  },
  methods: {
    initializeFreshChat() {
      if (document.getElementById('Freshchat-js-sdk')) {
        window.fcWidget.user.clear();
        window.fcWidget.destroy();
        document.getElementById('Freshchat-js-sdk').remove();
      }
      setTimeout(() => {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.token,
            'Accept-Language': localStorage.getItem('language'),
          },
        };
        if (localStorage.sessionData) {
          session = JSON.parse(localStorage.sessionData).payload;
        }
        if (session && this.$route.path !== '/login') {
        axios
          .get(`${process.env.ADONIS_PRIVATE_API}user-preferences?owner_id=${session.owner_id}`, config)
          .then(response => {
            if (response.data.preferences.data[0].freshchat_id) {
              this.createFreshChatScript(
                session.email,
                response.data.preferences.data[0].freshchat_id,
              );
            } else {
              this.createFreshChatScript(session.email);
            }
          })
          .catch(error => {
            this.errorObj = error.response;
            this.createFreshChatScript(session.email);
          });
        } else {
          this.createFreshChatScript();
        }
      }, 1000);
    },
    createFreshChatScript(userEmail, restoreID) {
      const script = document.createElement('script');
        script.id = 'Freshchat-js-sdk';
        script.onload = () => {
          const payload = {
            token: '88605441-3539-4e90-9e64-0fb1e4b1736f',
            host: 'https://wchat.freshchat.com',
            ...(userEmail && { externalId: userEmail }),
            ...(restoreID && { restoreId: restoreID }),
            config: {
              headerProperty: {
                backgroundColor: '#EE7D00',
                foregroundColor: '#FFFFFF',
              },
            },
          };
          if (session) {
            window.fcWidget.init(payload);
            this.setFreshChatRestoreIds(restoreID);
          } else {
            window.fcWidget.init(payload);
          }
        };
        script.src = 'https://wchat.freshchat.com/js/widget.js';
        document.head.appendChild(script);
    },
    setFreshChatRestoreIds(restoreID) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
          'Accept-Language': localStorage.getItem('language'),
        },
      };
      if (localStorage.sessionData) {
        session = JSON.parse(localStorage.sessionData).payload;
      }
      window.fcWidget.user.setProperties({
        firstName: session.name,
        email: session.email,
        phone: session.phone,
      });
      window.fcWidget.on('user:created', (resp) => {
        const status = resp && resp.status;
        const data = resp && resp.data;
        if (status === 200) {
          if (data.restoreId && restoreID !== data.restoreId) {
            const payload = {
              owner_id: session.owner_id,
              freshchat_id: data.restoreId,
            };
            axios
              .post(`${process.env.ADONIS_PRIVATE_API}user-preferences`, payload, config)
              .then(response => response)
              .catch(err => err);
          }
        }
      });
    },
  },
};
</script>

<style>
@font-face {
  font-family: 'HelveticaNeue';
  src: url('../src/assets/fonts/SegoeUI.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Nunito';
  src: url('../src/assets/fonts/Nunito-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}
#app {
  font-family: 'Nunito';
  height: 100%;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.el-message-box__headerbtn {
  text-align: end !important;
  border-style: none !important;
}
.el-button--small {
  width: 30% !important;
}
.el-dialog__headerbtn {
  text-align: end !important;
  border-style: none !important;
}
.el-dialog {
  max-height: 75%;
  overflow-y: auto;
  overflow-x: hidden;
}
.el-dialog__headerbtn :focus {
  outline: none !important ;
}
</style>
