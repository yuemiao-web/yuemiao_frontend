import { createApp } from 'vue'
import App from './App.vue'
import installPlugin from './plugins'
import './index.css'

const app = createApp(App)
installPlugin(app)
app.mount('#app')
