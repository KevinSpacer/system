import mlDialog from './ml-dialog'
import mlForm from './ml-form.vue'
import mlTable from './ml-table.vue'
import mlPage from './ml-page.vue'
import mlSwitch from './ml-switch.vue'
import mlSelect from './ml-select.vue'
import mlImage from './ml-image.vue'
import mlBtn from './ml-btn.vue'

import secondInput from '../components/second-input.vue'
import secondInputModel from '../components/second-input-model.vue'
import detailHeaderPanel from '../components/detail-header-panel.vue'
import layzSelect from '../components/layz-select.vue'
import secondLanguage from '../components/second-language.vue'

const coms = {
  mlDialog,
  mlForm,
  mlTable,
  mlPage,
  mlSwitch,
  mlSelect,
  mlBtn,
  mlImage,
  
  secondInput,
  secondInputModel,
  detailHeaderPanel,
  layzSelect,
  secondLanguage
}

export default {
  install(Vue) {
    for (let i in coms) {
      Vue.component(i, coms[i])
    }
  }
}