<template>
  <div class="black-bg" @click="$emit('close')">
<div class="customdis">
  <div class="spinner-border text-secondary" style="width: 3rem; height: 3rem;" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>

  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
//배경
// 수정추가된부분===============================================>
.black-bg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
}
.customdis{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50% , -50%);
}
</style>
