<template>
    <div class="text-type">
        <a-row type="flex" justify="start" :gutter="[10, 10]">
            <a-col flex="4">
                <a-select style="width:100%" default-value="0" @change="fontChange">
                    <a-select-option value="0">字体一</a-select-option>
                    <a-select-option value="1">字体二</a-select-option>
                    <a-select-option value="2">字体三</a-select-option>
                </a-select>
            </a-col>
            <a-col flex="1">
                <a-input-number
                    :step="2"
                    id="inputNumber"
                    v-model="attrs.fontSize"
                    :min="6"
                    @change="fontSizeChange"
                />
            </a-col>
            <a-col :span="24">
                <a-textarea @change="TextChange" v-model="attrs.text" />
            </a-col>
            <a-col :span="24">
                <div class="fontStyle">
                    <a-icon
                        @click="fontStyleChange('bold')"
                        :style="`${isBold ? 'color:#2354f4' : ''}`"
                        type="bold"
                    />
                    <a-icon
                        @click="fontStyleChange('italic')"
                        :style="`${isItalic ? 'color:#2354f4' : ''}`"
                        type="italic"
                    />
                    <a-icon
                        @click="fontStyleChange('underline')"
                        :style="`${isUnderline ? 'color:#2354f4' : ''}`"
                        type="underline"
                    />
                    <a-icon
                        @click="fontStyleChange('line-through')"
                        :style="`${isStrikethrough ? 'color:#2354f4' : ''}`"
                        type="strikethrough"
                    />
                </div>
            </a-col>
            <a-col :span="24">
                <div class="fontStyle">
                    <a-icon
                        @click="alignChange('left')"
                        :style="`${alignValue == 'left' ? 'color:#2354f4' : ''}`"
                        type="align-left"
                    />
                    <a-icon
                        @click="alignChange('center')"
                        :style="`${alignValue == 'center' ? 'color:#2354f4' : ''}`"
                        type="align-center"
                    />
                    <a-icon
                        @click="alignChange('right')"
                        :style="`${alignValue == 'right' ? 'color:#2354f4' : ''}`"
                        type="align-right"
                    />
                </div>
            </a-col>
            <a-col :span="24">
                <div class="fontStyle">
                    <a-popover>
                        <template slot="content">
                            <div style="width:240px">
                                <a-slider
                                    v-model="attrs.lineHeight"
                                    :min="1"
                                    :max="2.5"
                                    :step="0.1"
                                    :marks="lineheightMarks"
                                    @change="lineHeightChange"
                                />
                            </div>
                        </template>
                        <a-icon type="column-height" />
                    </a-popover>
                    <a-popover>
                        <template slot="content">
                            <div style="width:240px">
                                <a-slider
                                    :marks="letterSpacingMarks"
                                    v-model="attrs.letterSpacing"
                                    :min="0"
                                    :max="100"
                                    :step="5"
                                    @change="letterSpacing"
                                />
                            </div>
                        </template>
                        <a-icon type="column-width" />
                    </a-popover>
                    <a-popover>
                        <template slot="content">
                            <SketchColor @input="colorChange" v-model="attrs.fill" />
                        </template>
                        <a-icon :style="{ background: attrs.fill }" type="font-colors" />
                    </a-popover>
                </div>
            </a-col>
            <PositionControl :attrs="attrs" />
            <!-- <a-col :span="24">
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
            </a-col>-->
        </a-row>
    </div>
</template>
<script>
import mixins from "../mixin"
export default {
    mixins: [mixins],
    data() {
        return {
            lineheightMarks: {
                1: 1,
                1.5: 1.5,
                2: 2,
                2.5: 2.5,
            },
            letterSpacingMarks: {
                0: 0,
                50: 50,
                100: 100
            }
        }
    },
    computed: {
        isBold: {
            get: function () {
                if (this.attrs.fontStyle != undefined) {
                    return this.attrs.fontStyle.indexOf('bold') != -1
                } else {
                    return this.activeElment.fontStyle().indexOf('bold') != -1
                }
            },
        },
        isItalic: {
            get: function () {
                if (this.attrs.fontStyle) {
                    return this.attrs.fontStyle.indexOf('italic') != -1
                } else {
                    return this.activeElment.fontStyle().indexOf('italic') != -1
                }
            },
        },
        isUnderline: {
            get: function () {
                if (this.attrs.textDecoration) {
                    return this.attrs.textDecoration.indexOf('underline') != -1
                } else {
                    return this.activeElment.textDecoration().indexOf('underline') != -1
                }
            },
        },
        isStrikethrough: {
            get: function () {
                if (this.attrs.textDecoration) {
                    return this.attrs.textDecoration.indexOf('line-through') != -1
                } else {
                    return this.activeElment.textDecoration().indexOf('line-through') != -1
                }
            },
        },
        alignValue: {
            get: function () {
                if (this.attrs.align != undefined) {
                    return this.attrs.align
                } else {
                    return this.activeElment.align()
                }
            },
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.attrs = JSON.parse(JSON.stringify(this.activeElment.getAttrs()))
        })
    },
    methods: {
        fontChange() {
        },
        fontSizeChange(val) {
            this.activeElment.fontSize(val);
        },
        TextChange() {
            this.activeElment.text(this.attrs.text);
        },
        fontStyleChange(val) {
            if (val == 'bold' || val == 'italic') {
                let oldStyle = this.activeElment.fontStyle();
                if (oldStyle.indexOf(val) != -1) {
                    let newStyle = oldStyle.replace(val, '')
                    this.activeElment.fontStyle(newStyle);
                } else {
                    let newStyle = oldStyle.replace('normal', '') + ' ' + val
                    this.activeElment.fontStyle(newStyle);

                }
            } else if (val == 'underline' || val == "line-through") {
                {
                    let oldStyle = this.activeElment.textDecoration();
                    if (oldStyle.indexOf(val) != -1) {
                        this.activeElment.textDecoration('');
                    } else {
                        this.activeElment.textDecoration(val);
                    }
                }

            }
        },
        alignChange(val) {
            this.activeElment.align(val);
        },
        lineHeightChange(val) {
            this.activeElment.lineHeight(val);
        },
        letterSpacing(val) {
            this.activeElment.letterSpacing(val);
        },
        colorChange(val) {
            let color = val.hex || val
            this.activeElment.fill(color);
        },
        opacityChange(val) {
            this.activeElment.opacity(val);
        },
        lockChange(val) {
            this.activeElment.draggable(val);
            this.pageTransformer.rotateEnabled(val)
            if (!val) {
                this.pageTransformer.enabledAnchors([]);
            } else {
                this.pageTransformer.enabledAnchors(['top-left', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-right']);
            }
        },
        delActive() {
            this.activeElment.destroy();
            this.SetActive(null);
            this.pageTransformer.nodes([]);
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