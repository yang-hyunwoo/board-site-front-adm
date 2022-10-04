import mitt from 'mitt'
const emitter = mitt();

export default {
    install(Vue) {
        Vue.config.globalProperties.emitter = emitter
    }
}