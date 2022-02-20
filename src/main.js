import { createApp } from 'vue';
import { createStore } from 'vuex';

import storeConfig from './store/index';

import App from './App.vue';
import './assets/index.css';

const store = createStore(storeConfig);

const app = createApp(App);
app.use(store);
app.mount('#app');
