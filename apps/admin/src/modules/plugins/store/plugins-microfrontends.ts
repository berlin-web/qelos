import {computed, watch} from 'vue';
import {useRouter} from 'vue-router';
import {defineStore, storeToRefs} from 'pinia';
import {usePluginsList} from './plugins-list';
import MicroFrontendPage from '../MicroFrontendPage.vue';
import {authStore} from '@/modules/core/store/auth';
import {IMicroFrontend} from '@/services/types/plugin';

function getMfeUrl(mfe: IMicroFrontend): string {
  if (!mfe.callbackUrl) {
    return mfe.url;
  }
  return `/api/plugins/${mfe.pluginId}/callback?returnUrl=` + mfe.url;
}

export const usePluginsMicroFrontends = defineStore('plugins-micro-frontends', function usePluginsMicroFrontends() {
  const {plugins} = storeToRefs(usePluginsList());
  const router = useRouter();

  const userRoles = computed(() => authStore.user?.roles || []);

  const microFrontends = computed(() => {
    const data = {top: [], bottom: []};
    if (!plugins.value) {
      return data;
    }
    return plugins.value.reduce((routes, plugin) => {
      plugin.microFrontends?.filter(frontend =>
        frontend.active &&
        !!frontend.route &&
        (!frontend.route.roles || frontend.route.roles.some(role => role === '*' || userRoles.value.includes(role)))
      )
        .forEach(frontend => {
          frontend.callbackUrl = plugin.callbackUrl;
          frontend.pluginId = plugin._id;
          if (frontend.route.navBarPosition === 'top') {
            routes.top.push(frontend);
          } else {
            routes.bottom.push(frontend);
          }
        });
      return routes;
    }, data)
  });

  const unwatch = watch(microFrontends, ({top, bottom}) => {
    [...top, ...bottom].forEach(frontend => {
      router.addRoute('playPlugin', {
        name: `plugin.${frontend.name}`,
        path: frontend.route.path,
        meta: {
          roles: frontend.route.roles || ['*'],
          mfeUrl: getMfeUrl(frontend),
        },
        component: MicroFrontendPage
      })
    })
    router.removeRoute('defaultPluginPlaceholder');
    router.push(router.currentRoute.value.fullPath);
    unwatch();
  });

  return {
    microFrontends
  }
})
