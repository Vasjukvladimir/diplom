import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Home from '../pages/Home';
import ChatAi from '../pages/ChatAi';
import Storage from '../pages/Storage';
import Profile from '../pages/Profile';

const rootRoute = createRootRoute();

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const chatAiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: ChatAi,
});

const storageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/storage',
  component: Storage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([
    homeRoute,
    chatAiRoute,
    storageRoute,
    profileRoute,
  ]),
});
