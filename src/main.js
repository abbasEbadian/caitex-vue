import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App)
app.use(Antd).mount('#app');

// Security key:  fabb31757cb4815707a19b5a181a601e