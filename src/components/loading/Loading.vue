<template>
  <div>
    <transition name="fade">
      <BlackBg v-if="Loading"></BlackBg>
    </transition>
    <transition name="center">
      <SlidePopup v-if="Loading" :Arrow="'clear'" class="loading">
        <span class="loading__dot"></span>
        <span class="loading__dot"></span>
        <span class="loading__dot"></span>
        <p class="loading__txt">Loading...</p>
      </SlidePopup>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    Loading: Boolean
  }
};
</script>

<style lang="scss" scoped>
.loading {
  width: 90px;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  &__dot {
    display: inline-block;
    width: 20px;
    height: 20px;
    box-shadow: 0 0 10px 5px rgba(224, 149, 149, 0.3);
    background: blue;
    border-radius: 50%;
    animation: pop 2s infinite;
    animation-fill-mode: forwards;

    $aniDelay: 0s 0.5s 1s;

    @for $i from 1 through length($aniDelay) {
      &:nth-child(#{$i}) {
        animation-delay: nth($aniDelay, $i);
      }
    }
  }
  &__txt {
    width: 100%;
    text-align: center;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
  @keyframes pop {
    0% {
      opacity: 0;
      background: #fff;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      background: blue;
      transform: translateY(-10px);
    }
  }
}
</style>
