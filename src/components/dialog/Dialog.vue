<!-- eslint-disable vue/multi-word-component-names -->
<template>
<div>
    <div class="black-bg"  @click="$emit('close')"></div>
    <div class="c-popup">
        <slot name="cont"></slot>
    </div>
</div>
    
</template>

<script>
export default {
}
</script>

<style>

.black-bg{
    top:0;
    left:0;
    position:fixed;
    width:100vw;
    height:100vh;
    background: rgba(0,0,0,0.3);
    z-index: 100;
    overflow: hidden;
}
.c-popup{
    background: #fff;
    position: fixed;
    z-index: 200;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
</style>