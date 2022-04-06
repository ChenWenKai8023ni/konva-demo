<template>
    <div class="leftaside">
        <a-tabs v-model="tabActive" tab-position="left">
            <a-tab-pane v-for="item in tabList" :key="item.name">
                <div slot="tab" class="tab-button">
                    <div class="icon">
                        <a-icon :type="item.icon" />
                    </div>
                    <div class="name">{{ item.name }}</div>
                </div>
                <div v-if="tabActive == item.name" class="leftaside-tab-content">
                    <component v-bind:is="item.template"></component>
                </div>
            </a-tab-pane>
        </a-tabs>
        <div class="close" v-show="tabActive != ''" @click="tabActive = ''">
            <a-icon type="left" />
        </div>
    </div>
</template>
<script>
import templateList from './components/templateList.vue'
import materialList from './components/materialList.vue'
import textList from './components/textList.vue'
import imgList from './components/imgList.vue'
import backgroundList from './components/backgroundList.vue'
export default {
    components: {
        templateList,
        materialList,
        textList,
        imgList,
        backgroundList,
    },
    data() {
        return {
            tabActive: '',
            tabList: [
                {
                    name: "模板",
                    icon: "appstore",
                    template: templateList
                },
                {
                    name: "素材",
                    icon: "book",
                    template: materialList
                },
                {
                    name: "文字",
                    icon: "file-text",
                    template: textList
                },
                {
                    name: "图片",
                    icon: "picture",
                    template: imgList
                },
                {
                    name: "背景",
                    icon: "menu",
                    template: backgroundList
                },
            ],
        }
    },
}
</script>

<style lang="scss" scoped>
.leftaside {
    position: relative;
    .close {
        position: absolute;
        cursor: pointer;
        left: 100%;
        top: 50%;
        width: 20px;
        height: 50px;
        background: #fff;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    // padding-right: 17px;
    height: 100%;
    ::v-deep {
        .ant-tabs {
            height: 100%;
            .ant-tabs-tab {
                width: 60px;
                padding: 12px 0px !important;
                margin: 0 !important;
                display: flex;
                justify-content: center;
                align-content: center;
                .tab-button {
                    text-align: center;
                    .icon {
                        display: block;
                        font-size: 20px;
                        line-height: 1;
                        .anticon {
                            margin: 0;
                        }
                    }
                    .name {
                        font-size: 12px;
                    }
                }
            }

            .ant-tabs-content {
                height: 100%;
                overflow: hidden;
                .ant-tabs-tabpane {
                    max-height: 100%;
                    overflow-x: hidden;
                    overflow-y: auto;
                }
            }
        }
        .ant-tabs-content {
            padding: 0;
        }
    }
    .leftaside-tab-content {
        width: 320px;
        padding: 12px 20px;
        height: 100%;

        position: relative;
    }
}
</style>