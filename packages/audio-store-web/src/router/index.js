import { createRouter, createWebHistory } from 'vue-router';
import Collection from '../views/Collection.vue';
import Settings from '../views/Settings.vue';
import Tracks from '../components/Tracks.vue';
import Load from '../views/Load.vue';

const routes = [
  {
    path: '/load',
    name: 'Load',
    component: Load,
  },
  {
    path: '/collection',
    name: 'Collection',
    component: Collection,
    // children: [
    //   {
    //     path: '',
    //     name: 'Tracks',
    //     component: Tracks,
    //   },
    // ],
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/collection',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
