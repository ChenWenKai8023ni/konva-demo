<template>
  <div class="Index">
    <div class="header">
      <HeaderIndex />
    </div>
    <div class="main">
      <div class="left-container">
        <LeftAsideIndex />
      </div>
      <div class="center-container">
        <div class="operation-container"></div>
        <div class="canvas-container">
          <CanvaIndex />
        </div>
      </div>
      <div class="right-container">
        <RightAsideIndex />
      </div>
    </div>
  </div>
</template>

<script>
import CanvaIndex from '@/components/canvas/index'
import HeaderIndex from '@/components/header/index'
import LeftAsideIndex from '@/components/leftaside/index'
import RightAsideIndex from '@/components/rightaside/index'
import { mapState } from 'vuex';
export default {
  components: {
    CanvaIndex,
    HeaderIndex,
    LeftAsideIndex,
    RightAsideIndex
  },
  computed: {
    ...mapState({
    })
  }
};
</script>
<style lang="scss" scoped>
.Index {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .header {
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #eef2f8;
  }
  .main {
    display: flex;
    height: calc(100vh - 60px);
    width: 100vw;
    .left-container {
      // flex-basis: 390px;
      flex-shrink: 0;
    }
    .right-container {
      flex-basis: 280px;
      flex-shrink: 0;
    }
    .center-container {
      flex: 1;
      background: #eef2f8;
      position: relative;
      width: 100%;
      height: 100%;
      // overflow-y: auto;
      .operation-container {
        height: 60px;
        position: sticky;
        top: 0;
        background: white;
        z-index: 1;
      }
      .canvas-container {
        position: relative;
        width: 100%;
        height: calc(100% - 60px);
      }
    }
  }
}
</style>
