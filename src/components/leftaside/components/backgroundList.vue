<template>
    <div class="backgroundList">
        <div class="colorList">
            <div :style="`background:${background}`" class="firstItem colorItem">
                <a-popover>
                    <template slot="content">
                        <SketchColor @input="bgChange" v-model="background" />
                    </template>
                    <a-icon type="highlight" theme="filled" />
                </a-popover>
            </div>
            <div
                :style="`background:${item}`"
                class="colorItem"
                v-for="item in colorList"
                :key="item"
                @click="bgChange(item)"
            ></div>
        </div>
    </div>
</template>
<script>
import mixins from '../mixin'

export default {
    name: "backgroundList",
    mixins: [mixins],
    data() {
        return {
            background: '#ffffff',
            colorList: [
                'white',
                '#FF6900',
                '#FCB900',
                '#00D084',
                '#0693E3',
                '#EB144C',
            ]
        }
    },
    mounted() {
        this.background = this.bgElement.getAttrs().fill;
        console.log(this.bgElement, 'bgElement')
    },
    methods: {
        bgChange(val) {
            let color = val.hex || val
            this.bgElement.fill(color)
            this.background = color;
        }
    }
}
</script>
<style lang="scss" scoped>
.backgroundList {
    min-height: 60vh;
    .colorList {
        display: flex;
        flex-wrap: wrap;
        .firstItem {
            font-size: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            .plate {
                position: absolute;
                top: 0;
                left: 100%;
            }
        }
        .colorItem {
            width: 30px;
            height: 30px;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid #e0e5ea;
            margin: 5px;
        }
    }
}
</style>