
<template>
    <div class="page-tabs">
        <h2>Tabs 标签页</h2>
          <Tabs v-model="activeName" @tab-click="handleClick">
            <TabPane label="用户管理" name="first">用户管理</TabPane>
            <TabPane label="配置管理" name="second">配置管理</TabPane>
            <TabPane label="角色管理" name="third">角色管理</TabPane>
            <TabPane label="定时任务补偿" name="fourth">定时任务补偿</TabPane>
        </Tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { Tabs } from "@/ele";

const TabPane = Tabs.TabPane;

export default defineComponent({
    name: 'PageTabs',
    components: { Tabs, TabPane },
    setup(props, { emit, slots }) {
        const activeName = ref("second")

        const handleClick = (tab, event) => {
            console.log(tab, event)
        }

        return {
            activeName,
            handleClick,
        }
    }
});
</script>

<style lang="scss" scoped>
</style>
