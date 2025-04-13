import { createRouter, createWebHistory } from 'vue-router'
import DealsView from './views/DealsView.vue'
import { useDealsStore } from './stores/deals'

const routes = [
  {
    path: '/',
    name: 'deals',
    component: DealsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./components/LoginForm.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const dealsStore = useDealsStore()
  if (to.meta.requiresAuth && !dealsStore.sid) {
    next('/login')
  } else {
    next()
  }
})

export default router
