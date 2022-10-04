<template>
    <div>
        <Header></Header>
      <router-view></router-view>
        <Footer></Footer>
    </div>
</template>

<style>
html {
    position: relative;
    min-height: 100%;
    margin: 0;
}
body {
    min-height: 100%;
}
</style>

<script>

import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  }
}
</script>



