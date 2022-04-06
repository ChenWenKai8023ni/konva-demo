<template>
    <div class="image-type">
        <a-row :gutter="[10, 10]">
            <PositionControl :attrs="attrs" />
        </a-row>
    </div>
</template>
<script>
import mixins from "../mixin"
export default {
    mixins: [mixins],
}
</script>
<style lang="scss" scoped>
</style>