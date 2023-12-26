
// 集合

import main from './mainModule'
import publics from './publicsModule'
import system from './systemModule'
import restaurant from './restaurantModule'
import product from './productModule'
import condiment from './condimentModule'
import active from './activeModule'
import device from './deviceModule'


const stores = {
  main,
  publics,
  system,
  restaurant,
  product,
  condiment,
  active,
  device
}

// 集合
const piniaStore = {}

// 挂载注册
export const registerStore = ()=>{
  for(let i in stores){
    piniaStore[i+'Store'] = stores[i]()
  }
}

// 抛出集合
export default piniaStore