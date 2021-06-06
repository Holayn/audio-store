import { createRouter, createWebHistory } from 'vue-router';
import Collection from '../views/Collection.vue';
import CollectionView from '../views/CollectionView.vue';
import Settings from '../views/Settings.vue';
import Playlist from '../views/Playlist.vue';
import Load from '../views/Load.vue';

const routes = [
  {
    path: '/load',
    name: 'Load',
    component: Load,
  },
  {
    path: '/collection',
    name: 'CollectionView',
    component: CollectionView,
    children: [
      {
        path: '',
        name: 'Collection',
        component: Collection,
      },
      {
        path: 'playlist/:id',
        name: 'Playlist',
        component: Playlist,
        props: true,
      },
    ],
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
