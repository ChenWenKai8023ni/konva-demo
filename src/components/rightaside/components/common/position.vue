<template>
    <a-row :gutter="[10, 10]">
        <a-col :span="24">
            <div class="fontStyle">
                <a-popover>
                    <template slot="content">
                        <div style="width:240px">
                            <a-slider
                                @change="opacityChange"
                                v-model="attrs.opacity"
                                :min="0"
                                :max="1"
                                :step="0.1"
                            />
                        </div>
                    </template>
                    <icon-mosaic theme="outline" size="24" fill="#333" />
                </a-popover>
                <icon-lock
                    @click="lockChange(true)"
                    v-show="!attrs.draggable"
                    theme="outline"
                    size="24"
                    fill="#333"
                />
                <icon-unlock
                    @click="lockChange(false)"
                    v-show="attrs.draggable"
                    theme="outline"
                    size="24"
                    fill="#333"
                />
                <icon-delete @click="delActive" theme="outline" size="24" fill="#333" />
            </div>
        </a-col>
        <a-col :span="24">
            <div class="fontStyle">
                <icon-align-bottom
                    @click="locationChange('yb')"
                    theme="outline"
                    size="24"
                    fill="#333"
                />
                <icon-align-vertically
                    @click="locationChange('yc')"
                    theme="outline"
                    size="24"
                    fill="#333"
                />
                <icon-align-top
                    @click="locationChange('yt')"
                    theme="outline"
                    size="24"
                    fill="#333"
                />
            </div>
        </a-col>
        <a-col :span="24">
            <div class="fontStyle">
                <icon-align-left
                    @click="locationChange('xl')"
                    theme="outline"
                    size="24"
                    fill="#333"
                />
                <icon-align-horizontally
                    @click="locationChange('xc')"
                    theme="outline"
                    size="24"
                    fill="#333"
                />
                <icon-align-right
                    @click="locationChange('xr')"
                    theme="outline"
                    size="24"
                    fill="#333"
                />
            </div>
        </a-col>
        <a-col :span="24">
            <div class="fontStyle">
                <icon-to-top theme="outline" size="24" fill="#333" />
                <icon-to-top-one theme="outline" size="24" fill="#333" />
                <icon-to-bottom theme="outline" size="24" fill="#333" />
                <icon-to-bottom-one theme="outline" size="24" fill="#333" />
            </div>
        </a-col>
    </a-row>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
export default {
    name: "positionControl",
    data() {
        return {
        }
    },
    props: {
        attrs: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    computed: {
        ...mapState({
            pageGroup: (state) => state.pageGroup,
            activeElment: (state) => state.activeElment,
            pageTransformer: (state) => state.pageTransformer,
        }),
    },
    methods: {
        ...mapActions([
            'SetActive'
        ]),
        opacityChange(val) {
            this.activeElment.opacity(val);
            this.$forceUpdate()

        },
        lockChange(val) {
            this.activeElment.draggable(val);
            this.pageTransformer.rotateEnabled(val)
            if (!val) {
                this.pageTransformer.enabledAnchors([]);
            } else {
                this.pageTransformer.enabledAnchors(['top-left', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-right']);
            }
            this.$forceUpdate()

        },
        delActive() {
            this.activeElment.destroy();
            this.SetActive(null);
            this.pageTransformer.nodes([]);
            this.$forceUpdate()

        },
        locationChange(type) {
            let allHeight = this.pageGroup.getAttrs().clipHeight;
            let allWidth = this.pageGroup.getAttrs().clipWidth;
            let thisHeight = this.activeElment.height();
            let thisWidth = this.activeElment.width();
            switch (type) {
                case 'yt':
                    this.activeElment.y(0);
                    break;
                case 'yc':
                    let yc = Number((allHeight / 2) - (thisHeight / 2))
                    this.activeElment.y(yc);
                    break;
                case 'yb':
                    let yb = Number(allHeight - thisHeight)
                    this.activeElment.y(yb);
                    break;
                case 'xl':
                    this.activeElment.x(0);
                    break;
                case 'xc':
                    let xc = Number((allWidth / 2) - (thisWidth / 2))
                    this.activeElment.x(xc);
                    break;
                case 'xr':
                    let xr = Number(allWidth - thisWidth)
                    this.activeElment.x(xr);
                    break;
                default:
                    break;
            }
            this.$forceUpdate()

        }
    }
}
</script>
<style lang="scss" scoped>
.textwrap {
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    background: #f6f7f9;
    font-size: 24px;
    line-height: 1;
}
.fontStyle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24px;
    padding: 8px 12px;
    line-height: 1;
    background: #f6f7f9;
    ::v-deep {
        span {
            display: inline-flex;
        }
    }
    .fontStyleItem {
        padding: 0 10px;
        flex: 1;
    }
}
</style>