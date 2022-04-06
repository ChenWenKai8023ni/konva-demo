import { mapState, mapGetters, mapActions } from "vuex"
import { textObj, throttle } from '@/util/type.js'
import PositionControl from './components/common/position.vue'
const mixin = {
    components: { PositionControl },
    computed: {
        ...mapState({
            pageGroup: (state) => state.pageGroup,
            pageLayer: (state) => state.pageLayer,
            activeElment: (state) => state.activeElment,
            bgElement: (state) => state.bgElement,
            pageTransformer: (state) => state.pageTransformer,

        }),
        ...mapGetters(['activeClassName'])
    },
    watch: {
        activeElment: {
            handler(val) {
                if (val != null) {
                    this.attrs = Object.assign(this.attrs, JSON.parse(JSON.stringify(val.getAttrs())))
                } else {
                    this.attrs = {}
                }
            },
            deep: true,
        }
    },
    data() {
        return {
            attrs: {},
            textObj: textObj
        }
    },
    methods: {
        ...mapActions([
            "SetActive",
        ]),
    },
};

export default mixin;