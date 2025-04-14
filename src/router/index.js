import { createRouter, createWebHistory } from 'vue-router'
import { useDealsStore } from '@/stores/deals'

export const routes = [
  {
    path: '/',
    name: 'deals',
    component: () => import('@/views/DealsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/LoginForm.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const dealsStore = useDealsStore()

  if (to.meta.requiresAuth && !dealsStore.sid) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  if (to.meta.requiresGuest && dealsStore.sid) {
    return { name: 'deals' }
  }

  return true
})

export default router
