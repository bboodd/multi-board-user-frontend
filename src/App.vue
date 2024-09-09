<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
//
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 5px;
}

#nav a {
  font-weight: bold;
  font-size: 20px;
  color: #2c3e50;
  margin-left: 15px;
  margin-right: 3px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
