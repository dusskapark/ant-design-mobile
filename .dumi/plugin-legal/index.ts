import type { IApi } from '@umijs/types'

export default (api: IApi) => {
  api.modifyRoutes(routes => {
    routes.unshift({
      path: '/privacy-policy',
      component: __dirname + '/privacy-policy.tsx',
    })
    routes.unshift({
      path: '/terms',
      component: __dirname + '/terms-of-service.tsx',
    })
    return routes
  })
}
