<template>
    <div class="header">
        <a-row type="flex" class="header-row" justify="space-between">
            <a-col>LOGO</a-col>
            <a-col class="header-right">
                <a-space>
                    <a-button @click="save">保存</a-button>
                    <a-button type="primary" icon="download">下载</a-button>
                </a-space>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { mapState } from "vuex"
export default {
    computed: {
        ...mapState({
            pageStage: (state) => state.pageStage,
            pageGroup: (state) => state.pageGroup,

        }),
    },
    methods: {
        save() {
            const scale = Number((1 / this.pageGroup.scaleX()).toFixed(3));
            const url = this.pageStage.toDataURL({
                width: Number((this.pageGroup.clipWidth() * this.pageGroup.scaleX()).toFixed(0)),
                height: Number((this.pageGroup.clipHeight() * this.pageGroup.scaleX()).toFixed(0)),
                x: this.pageGroup.x(),
                y: this.pageGroup.y(),
                pixelRatio: scale
            });
            this.download(url)
        },
        download(url) {
            this.downloadFile('测试.png', url);
        },
        downloadFile(fileName, content) {
            let aLink = document.createElement('a');
            let blob = this.base64ToBlob(content); //new Blob([content]);
            let evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
            aLink.download = fileName;
            aLink.href = URL.createObjectURL(blob);
            aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));//兼容火狐
        },
        //base64转blob
        base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;
            let uInt8Array = new Uint8Array(rawLength);
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], { type: contentType });
        },
    }
}
</script>
<style lang="scss" scoped>
.header {
    position: relative;
    padding: 10px;
    .header-row {
        height: 100%;
        .header-right {
            .ant-space {
                height: 100%;
            }
        }
    }
}
</style>