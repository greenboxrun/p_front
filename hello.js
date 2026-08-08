const { createApp, ref } = Vue;

createApp({
  setup() {
    const message = ref("Hello Worldㅎㄷㄷㄷㄷㄷㅎㅎㅎㅎ👋");
    return { message };
  },
}).mount("#app");
