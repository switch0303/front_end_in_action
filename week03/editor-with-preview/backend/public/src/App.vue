<template>
  <div>
    <div>我是vue文件</div>
    <p class="info">{{ info }}</p>
    <component-a></component-a>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import ComponentA from "./ComponentA.vue";

export default defineComponent({
  components: {
    ComponentA,
  },
  setup() {
    const info = ref("编辑左边的vue文件试试");
    return {
      info,
    };
  },
});
</script>
<style scoped>
p.info {
  color: tomato;
}
</style>