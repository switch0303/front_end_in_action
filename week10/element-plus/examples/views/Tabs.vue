
<template>
    <div class="page-tabs">
        <h2>Tabs 标签页</h2>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, computed, h } from "vue";
import type { PropType } from 'vue';
import { ElTabs, ElTabPane } from "@/ele";

export default defineComponent({
    name: 'PageTabs',
    components: { ElTabs, ElTabPane },
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
