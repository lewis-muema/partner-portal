<template>
  <div id="app">
    <router-view/>
  </div>
</template>

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
</style>
