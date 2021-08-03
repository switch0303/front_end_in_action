<template>
  <div class="home">
    <News
      msg="奥运之星 | 苏炳添半决赛9秒83一战封神，百米飞人大战迎亚洲之光"
    />
    <img src="../assets/subingtian.jpeg" alt="">
    <p>
      2021年8月1日，在东京奥运会男子100米预赛及半决赛中，中国短跑名将苏炳添分别以10.05秒、9.83秒的成绩晋级，最终创造历史，闯入决赛。
    </p>
    <p>
      1989年8月29日出生于广东省中山市的苏炳添，是中国乃至亚洲本土短跑第一人，在2012年伦敦奥运会及2016年里约奥运会都闯入男子100米半决赛，同时也是首位跑进10秒大关的黄种人选手。
    </p>
    <p>
      此前苏炳添赛季最佳成绩为9.98秒，这与他本人的9.91秒亚洲纪录仍有差距，而他在东京奥运会的目标则是闯入决赛，并挑战9.85秒这一黄种人的“理论极限”。
    </p>
  </div>
</template>

<script>
// @ is an alias to /src
import News from '@/components/News.vue'

export default {
  name: 'Home',
  components: {
    News
  }
}
</script>
<style scoped>
  .home {
    padding: 0 80px;
  }
  .home p {
    font-size: 20px;
  }
</style>
