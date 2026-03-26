import type { IApi } from '@umijs/types'

export default (api: IApi) => {
  api.modifyRoutes(routes => {
    routes.unshift({
      path: '/liff',
      component: __dirname + '/liff-gallery.tsx',
    })
    routes.unshift({
      path: '/liff/:component',
      component: __dirname + '/liff-gallery.tsx',
    })
    return routes
  })
}
