import { createStore } from 'vuex'
import app from './modules/app'
import main from './modules/main'

const store = createStore({
  modules: {
    app,
    main
  }
})

export default store