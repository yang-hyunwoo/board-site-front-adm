<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',

  beforeMount() {
    window.addEventListener("load", this.onLoad);
    window.addEventListener("beforeunload", this.onUnload);
  },
  beforeDestroy() {
    window.removeEventListener("load", this.onLoad);
    window.removeEventListener("beforeunload", this.onUnload);
  },
  methods: {
    onLoad(event) {
      if(sessionStorage.getItem("token")!=null){
        console.log("::::"+sessionStorage.getItem("token"));
        window.localStorage.setItem("token", sessionStorage.getItem("token"));
      }
    },
    onUnload(event) {
      window.localStorage.removeItem("token");
    }
  }

}

</script>
<style>
::-webkit-scrollbar{
  width:0;
}
::-webkit-scrollbar-thumb{
  background :transparent;
  border-radius:5px;
}
::-webkit-scrollbar-track{
  background: transparent;
}</style>