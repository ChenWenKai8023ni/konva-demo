<template>
    <div class="imgList">
        图片
        <a-button @click="addimg">添加图片</a-button>
    </div>
</template>
<script>
import mixins from '../mixin'
export default {
    name: "imgList",
    mixins: [mixins],
    methods: {
        addimg() {
            var ImagePic = new Image();
            ImagePic.crossOrigin = 'Anonymous';
            ImagePic.src = this.imageObj.src;
            ImagePic.onload = () => {
                let newObj = Object.assign(this.imageObj, { name: "Image", image: ImagePic, })
                console.log(newObj, 'newObj')
                var image = new Konva.Image(newObj);
                this.pageGroup.add(image);
                this.pageLayer.batchDraw();
            };

        }
    },
}
</script>
<style lang="scss" scoped>
</style>