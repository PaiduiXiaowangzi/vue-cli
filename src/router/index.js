import {createRouter, createWebHistory} from "vue-router"

const Home = () => import("../views/Home")
const About = () => import('../views/About')

export default createRouter({
    history: createWebHistory(),
    routes:[
        {
            path:'/',
            redirect:'/home'
        },
        {
            path:'/home',
            component:Home,
        },
        {
            path:'/about',
            component:About
        }
    ]
})