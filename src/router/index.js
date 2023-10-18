import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import authMiddleware from './middleware/auth-middleware'
// import clearValidationErrors from './middleware/clear-validation-errors'
import product from './product'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: false,
        title: 'Home',
        description: 'Home'
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        requiresAuth: false,
        title: 'About',
        description: 'About'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Auth/LoginView.vue'),
      meta: {
        requiresGuest: true,
        title: 'Login',
        description: 'Login'
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: {
        requiresAuth: true,
        title: 'Profile',
        description: 'Profile'
      }
    },
    ...product
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ?? 'Home'
  next()
})

router.beforeEach(authMiddleware)
// router.beforeEach(clearValidationErrors)

export default router
