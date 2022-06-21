import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router'
const app = createApp(App)
app.provide("BASE_URL", "https://caitex.net/api/v1/")
// app.provide("BASE_URL", "http://localhost:8000/api/v1/")
app.use(router)
app.use(Antd).mount('#app');

// Security key:  fabb31757cb4815707a19b5a181a601e