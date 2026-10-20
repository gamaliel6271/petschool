import { createRouter, createWebHistory } from 'vue-router'

import TutoresView from '../views/TutoresView.vue'
import AddTutorView from '../views/AddTutorView.vue'
import TutorDetailsView from '../views/TutorDetailsView.vue'
import PetsView from '../views/PetsView.vue'
import PetDetailsView from '../views/PetDetailsView.vue'

const routes = [
  {
    path: '/',
    redirect: '/tutores'
  },
  {
    path: '/tutores',
    name: 'tutores',
    component: TutoresView
  },
  {
    path: '/tutores/novo',
    name: 'tutor-novo',
    component: AddTutorView
  },
  {
    path: '/tutores/:id',
    name: 'tutor-detalhes',
    component: TutorDetailsView
  },
  {
    path: '/pets',
    name: 'pets',
    component: PetsView
  },
  {
    path: '/pets/:id',
    name: 'pet-detalhes',
    component: PetDetailsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
