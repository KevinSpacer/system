import mainApi from './mainApi'
import systemApi from './systemApi'
import restaurantApi from './restaurantApi'
import productApi from './productApi'
import condimentApi from './condimentApi'
import activeApi from './activeApi'
import deviceApi from './deviceApi'


export default [
  ...mainApi,
  ...systemApi,
  ...restaurantApi,
  ...productApi,
  ...condimentApi,
  ...activeApi,
  ...deviceApi
]