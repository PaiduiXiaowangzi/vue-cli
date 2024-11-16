import {createApp} from 'vue'
import App from './App'
import router from './router/index'
// import 'element-plus/dist/index.css'
// import './styles/element/index.scss'
import ElementPlus from 'element-plus'
createApp(App).use(router).use(ElementPlus).mount(document.getElementById("app"))