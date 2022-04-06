<template>
    <div class="templateList">
        <a-row :gutter="16">
            <a-col class="templateList-row" :span="12">
                <div class="templateList-box">模板</div>
            </a-col>
            <a-col class="templateList-row" :span="12">
                <div class="templateList-box">12</div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import mixins from '../mixin'
export default {
    name: "templateList",
    mixins: [mixins],

    mounted() {
        this.$nextTick(() => {
            console.log(this.pageGroup, 'pageGroup')
        })
    },
}
</script>
<style lang="scss" scoped>
.templateList {
    .templateList-box {
        background: #00a0e9;
    }
}
</style>