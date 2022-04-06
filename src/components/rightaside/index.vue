<template>
    <div class="rightaside">
        <div>{{ activeClassName }}</div>
        <textType v-if="activeClassName == 'Text'" />
        <imgType v-else-if="activeClassName == 'Image'" />
    </div>
</template>
<script>
import textType from './components/text.vue'
import imgType from './components/image.vue'
import mixins from "./mixin"
export default {
    name: 'rightaside',
    mixins: [mixins],
    components: {
        textType, imgType
    },
    data() {
        return {
        }
    },
    mounted() {
    }
}
</script>
<style lang="scss" scoped>
.rightaside {
    height: 100%;
    padding: 20px;
}
</style>