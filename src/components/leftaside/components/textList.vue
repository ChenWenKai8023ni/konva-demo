<template>
    <div class="textList">
        <a-button @click="addtext">添加文字</a-button>
        <a-button @click="text">当前元素</a-button>
    </div>
</template>
<script>
import mixins from '../mixin'

export default {
    name: "textList",
    mixins: [mixins],
    methods: {
        addtext() {
            let newObj = Object.assign(this.textObj, { name: "Text", fontSize: 40 })
            let text = new Konva.Text(newObj);
            console.log(newObj, 'newObj')
            console.log(text, 'text')
            this.pageGroup.add(text)
            this.pageLayer.batchDraw();
        },
        text() {
            console.log(this.activeElment)
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
