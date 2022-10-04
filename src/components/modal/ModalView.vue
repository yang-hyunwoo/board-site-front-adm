<template>
    <div class="image-popup">
      <img
        tabindex="0"
        class="image-popup__small"
        :style="style()"
        :src="img"
        @click="$emit('clickEvt'), (isClick = true)"
      />
      <transition name="fade"
        ><BlackBg @close="isClick = false" v-if="isClick"></BlackBg>
      </transition>
      <transition name="center">
        <button @click="isClick = false" class="image-popup__big" v-if="isClick">
          <img :src="img" alt="이미지" class="image-popup__big__item" />
        </button>
      </transition>
    </div>
  </template>

<script>
    export default {
      props: {
        width: {
          type: String
        },
        height: {
          type: String
        },
        img: {
          type: String
        }
      },
      data() {
        return {
          isClick: false
        };
      },
      methods: {
        style() {
          return {
            width: this.width,
            height: this.height
          };
        },
      },
      mounted() {
        this.style();
      }
    };
    </script>