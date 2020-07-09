<template>
  <div id="app">
    <loginHeader v-if="this.$route.name === 'logIn' || this.$route.name === 'driverRequest' || this.$route.name === 'driverRequestBlank' || this.$route.name === 'externalTrackingAll' || this.$route.name === 'externalTrackingId' || this.$route.name === 'externalTrackingFrom' || this.$route.name === 'externalTrackingBlank' || this.$route.name === 'externallogin' || this.$route.name === 'authlogin' || this.$route.name === 'signature'" />
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
};
</script>

<style>
@font-face {
  font-family: 'HelveticaNeue';
  src: url('../src/assets/fonts/SegoeUI.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}
#app {
  font-family: 'HelveticaNeue';
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
