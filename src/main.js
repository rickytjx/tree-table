import Vue from "vue";
import App from "./App.vue";
import "./plugins/vxe";
import "vxe-table/lib/style.css";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
