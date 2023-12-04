<template>
  <div>
<!--    &lt;!&ndash; 顶部 card  &ndash;&gt;-->
<!--    <top-panel class="row-container" />-->
<!--    &lt;!&ndash; 中部图表  &ndash;&gt;-->
<!--    <middle-chart class="row-container" />-->
<!--    &lt;!&ndash; 列表排名 &ndash;&gt;-->
<!--    <rank-list class="row-container" />-->
<!--    &lt;!&ndash; 出入库概览 &ndash;&gt;-->
<!--    <output-overview class="row-container" />-->
  </div>
</template>

<script lang="ts">
export default {
  name: 'DashboardBase',
};
</script>

<script setup lang="ts">
import MiddleChart from './components/MiddleChart.vue';
import OutputOverview from './components/OutputOverview.vue';
import RankList from './components/RankList.vue';
import TopPanel from './components/TopPanel.vue';
</script>

<style scoped>
.row-container:not(:last-child) {
  margin-bottom: 16px;
}
</style>
