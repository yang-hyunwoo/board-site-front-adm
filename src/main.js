import { createApp } from 'vue'
import App from './App.vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import mitt from "@/mitt/mitt"
import router from './router/router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import axios from "axios"; 
import { useCookies } from "vue3-cookies";
import common from './assets/js/common'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const app = createApp(App)
app.config.globalProperties.$axios = axios; 
app.use(BootstrapVue3)
app.use(mitt)
app.use((useCookies({ sameSite: "none", secure: true })))
app.use(router)
app.use(common)
app.use(VueSweetalert2)
app.mount('#app')
