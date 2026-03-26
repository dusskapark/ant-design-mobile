import type { IApi } from '@umijs/types'

export default (api: IApi) => {
  api.modifyRoutes(routes => {
    routes.unshift({
      path: '/grab',
      component: __dirname + '/grab-gallery.tsx',
    })
    routes.unshift({
      path: '/grab/:component',
      component: __dirname + '/grab-gallery.tsx',
    })
    return routes
  })
}
