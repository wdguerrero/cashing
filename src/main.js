import { createApp } from 'vue'
import App from './App.vue'

import router from '@/router'
import "@/assets/css/tailwind.css"

import filters from "@/filter";

import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

const app = createApp(App)
                    .use(router)
                    .use(VueChartkick)
                    .use(PulseLoader)

app.config.globalProperties.$filters = filters;
app.mount("#app");
              
