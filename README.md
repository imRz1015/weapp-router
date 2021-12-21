# weapp-router

## 专门为微信小程序设计的路由管理器

### Usage

#### 定义路由

    // src/router/routes.ts
    import { Route } from 'WeappRouter/type'

    const routes: Route[] = [
      {
        label: '首页',
        name: 'home',
        path: 'pages/home/index',
        isTabBar: true,
      },
      {
        label: '会员中心',
        name: 'member-center',
        path: 'pages/member-center/index',
        isTabBar: true,
      },
    ]

    export default routes
    
   
   
#### 初始化

    // src/router/index.ts
    import routes from './routes'
    import WeappRouter from 'WeappRouter'
    
    export default new WeappRouter({
      // 注册路由表
      routes,
      // 注册导航守卫
      beforeEach(to,from,next){
        next()
      }
    })
    
#### 在页面中使用

    // src/pages/home/index.ts
    import router from 'src/router'
    
    Page({
    
      onClick(){
        router.push({name:'member-center',query:{someQuery:'abc',someType:2}})
      }
    
    })
    
   
