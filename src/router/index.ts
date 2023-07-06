import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import HomeView from '../views/HomeView.vue'
import createRouteGuard from './guard'

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue')
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  },
})

createRouteGuard(router);

export default router
