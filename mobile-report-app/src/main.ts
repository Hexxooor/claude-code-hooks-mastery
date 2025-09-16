import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import './style.css';
import App from './App.vue';
import seedService from './services/seed.service';

const app = createApp(App);

// Use Pinia for state management
app.use(createPinia());

// Use Vue Router
app.use(router);

// Initialize database with seed data if needed
seedService.seedAll().catch(console.error);

// Mount the app
app.mount('#app');
