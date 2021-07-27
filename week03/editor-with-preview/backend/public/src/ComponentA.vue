<template>
  <p>我是{{ name }}</p>
</template>
<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const name = ref("组件A");
    return {
      name,
    };
  },
});
</script>
<style scoped>
p {
  font-size: 2em;
  text-align: center;
  color: aquamarine;
}
</style>