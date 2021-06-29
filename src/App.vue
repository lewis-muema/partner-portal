<template>
  <div id="app">
    <loginHeader v-if="this.$route.name === 'logIn' || this.$route.name === 'driverRequest' || this.$route.name === 'driverRequestBlank' || this.$route.name === 'externalTrackingAll' || this.$route.name === 'externalTrackingId' || this.$route.name === 'externalTrackingFrom' || this.$route.name === 'externalTrackingBlank' || this.$route.name === 'externallogin' || this.$route.name === 'authlogin' || this.$route.name === 'signature' || this.$route.name === 'bidding' || this.$route.name === 'webform' || this.$route.name === 'recipient'" />
    <appHeader v-else />
    <router-view />
  </div>
</template>
<script>
import appHeader from './components/headers/appHeader';
import loginHeader from './components/headers/logInHeader';

export default {
  components: {
    appHeader,
    loginHeader,
  },
  watch: {
    $route(to, from) {
      if ((from.path === '/login' && to.path === '/') || to.path === '/login') {
        this.initializeFreshChat();
      }
    },
  },
  mounted() {
    this.initializeFreshChat();
  },
  methods: {
    initializeFreshChat() {
      let session = null;
      if (localStorage.sessionData) {
        session = JSON.parse(localStorage.sessionData).payload;
      }
      const restoreIds = localStorage.userRestoreIds ? JSON.parse(localStorage.userRestoreIds) : [];
      if (document.getElementById('Freshchat-js-sdk')) {
        window.fcWidget.user.clear();
        window.fcWidget.destroy();
        document.getElementById('Freshchat-js-sdk').remove();
      }
      setTimeout(() => {
        if (session && this.$route.path !== '/login') {
          const idArray = restoreIds.filter(data => data.email === session.email);
          const id = idArray.length > 0 ? idArray[0].id : null;
          this.createFreshChatScript(session.email, id, session);
        } else {
          this.createFreshChatScript();
        }
      }, 1000);
    },
    createFreshChatScript(userEmail, restoreID, session) {
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
          if (this.$route.path === '/login') {
            window.fcWidget.init(payload);
          } else {
            window.fcWidget.init(payload);
            this.setFreshChatRestoreIds(session, restoreID);
          }
        };
        script.src = 'https://wchat.freshchat.com/js/widget.js';
        document.head.appendChild(script);
    },
    setFreshChatRestoreIds(session, restoreID) {
      if (!restoreID && session) {
        window.fcWidget.user.setProperties({
          firstName: session.name,
          email: session.email,
          phone: session.phone,
        });
      }
      window.fcWidget.on('user:created', (resp) => {
        const status = resp && resp.status;
            const data = resp && resp.data;
        if (status === 200) {
          if (data.restoreId) {
            if (localStorage.userRestoreIds) {
              const ids = JSON.parse(localStorage.userRestoreIds);
              const states = ids.filter(info => info.id === data.restoreId);
              if (states.length === 0) {
                ids.push({
                  email: session.email,
                  id: data.restoreId,
                });
              }
              localStorage.userRestoreIds = JSON.stringify(ids);
            } else {
              localStorage.userRestoreIds = JSON.stringify([{
                email: session.email,
                id: data.restoreId,
              }]);
            }
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
