import { createRouter, createWebHistory } from 'vue-router'
import Payment from '../views/Payment.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
// import AssetsView from '../views/AssetsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Payment,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresAuth: false
      }
    },
    
  ],  
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  if(to.meta.requiresAuth && !token) return {name : "login" }
  if(!to.meta.requiresAuth && token) return {name: "home"}
  return true 
})
export default router
