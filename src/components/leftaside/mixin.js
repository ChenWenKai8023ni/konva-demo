import { mapState } from "vuex"
import { textObj, imageObj } from '@/util/type.js'

const mixin = {
    computed: {
        ...mapState({
            pageGroup: (state) => state.pageGroup,
            pageLayer: (state) => state.pageLayer,
            activeElment: (state) => state.activeElment,
            bgElement: (state) => state.bgElement,
        })
    },
    data() {
        return {
            textObj: textObj,
            imageObj: imageObj
        }
    },
};

export default mixin;