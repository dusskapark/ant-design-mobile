import type { IApi } from '@umijs/types'

export default (api: IApi) => {
  api.modifyRoutes(routes => {
    routes.unshift({
      path: '/tiktok',
      component: __dirname + '/tiktok-gallery.tsx',
    })
    routes.unshift({
      path: '/tiktok/:component',
      component: __dirname + '/tiktok-gallery.tsx',
    })
    return routes
  })
}
