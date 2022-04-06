<template>
    <div ref="work" class="canvas-work-container">
        <div ref="canvas-container" class="canvas-container" id="canvas-container"></div>
    </div>
</template>
<script>
export default {
    name: "KonvaCanvas",
    data() {
        return {
            stageOpation: {
                container: "canvas-container",
                width: 0,
                height: 0,
            },
            layerOpation: {
                width: 500,
                height: 500,
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
            },
            OFFSETNUM: 20,
            pageStage: null,
            pageLayer: null,
            pageTransformer: null,
            selectionElement: null,
            bgrShape: null,
            starPosition: {
                x1: "",
                x2: "",
                y1: "",
                y2: "",
            },
            activeShape: null,
            pageLayerList: [],

        };
    },
    created() {
        this.$nextTick(() => {
            this.init();
            this.$nextTick(() => {
                this.addLayer();
                window.addEventListener(
                    "resize",
                    this.fitStageIntoParentContainer
                );
            })
        });
    },
    mounted() {

    },
    methods: {
        init() {
            const main = this.$refs.work;
            // this.stageOpation.width =
            //   main.offsetWidth < this.layerOpation.width
            //     ? this.layerOpation.width
            //     : main.offsetWidth;
            // this.stageOpation.height =
            //   main.offsetHeight < this.layerOpation.height
            //     ? this.layerOpation.height
            //     : main.offsetHeight;
            this.stageOpation.width = main.offsetWidth;
            this.stageOpation.height = main.offsetHeight;
            this.pageStage = new Konva.Stage(this.stageOpation);
        },
        addLayer() {
            const name = this.getTimestamp("l");
            let scaleX = this.layerOpation.width > this.stageOpation.width ? Number((this.stageOpation.width / this.layerOpation.width).toFixed(2)) : 1;
            let scaleY = this.layerOpation.height > this.stageOpation.height ? Number((this.stageOpation.height / this.layerOpation.height).toFixed(2)) : 1;
            this.layerOpation.scaleX = scaleX;
            this.layerOpation.scaleY = scaleY;
            let x = scaleX == 1 ? ((this.stageOpation.width * scaleX) / 2 - (this.layerOpation.width * scaleX * 0.5)) : 0;
            let y = scaleY == 1 ? ((this.stageOpation.height * scaleY) / 2 - (this.layerOpation.height * scaleY * 0.5)) : 0;
            this.layerOpation.x = x;
            this.layerOpation.y = y;
            this.pageLayer = new Konva.Layer(this.layerOpation);
            this.pageStage.add(this.pageLayer);
            this.addBgLayer()
            this.addText();
            this.addTransformer();
            this.$nextTick(() => {
                // 鼠标按下或屏幕触摸
                this.mousedownTouchstart(this.pageStage, this.selectionElement, this.pageLayer)
                // 鼠标移动或屏幕触摸移动
                this.mousemoveTouchmove(this.pageStage, this.selectionElement, this.pageLayer);
                // 鼠标放开或屏幕触摸结束
                this.mouseupTouchend(this.pageStage, this.pageLayer, this.selectionElement, this.pageTransformer);
                // 鼠标点击
                this.clickTap(this.pageStage, this.pageLayer, this.selectionElement, this.pageTransformer);
            })
        },
        // 添加背景颜色 
        addBgLayer() {
            // const bgLayer = new Konva.Layer(this.layerOpation);
            // bgLayer.add(bgreact)
            this.bgrShape = new Konva.Rect({
                width: this.layerOpation.width,
                height: this.layerOpation.height,
                x: 0,
                y: 0,
                fill: '#fff',
                name: "background",
            });
            this.pageLayer.add(this.bgrShape);
        },
        //添加 元素框选 元素变形器
        addTransformer() {
            //元素框选
            this.selectionElement = new Konva.Rect({
                fill: "rgba(0,0,255,0.5)",
                visible: false, // 默认不显示
                name: "selectionElement",
            });
            //元素变形器
            this.pageTransformer = new Konva.Transformer({
                nodes: [],
                centeredScaling: false,
                keepRatio: true,
                name: "Transformer",
            });
            this.pageLayer.add(this.selectionElement);
            this.pageLayer.draw();
            this.pageLayer.add(this.pageTransformer);

        },

        addText() {
            var simpleText = new Konva.Text({
                x: 50,
                y: 15,
                text: "Simple Text",
                fontSize: 30,
                fill: "green",
                name: "Text",
                draggable: true,
            });
            this.pageLayer.add(simpleText);
        },

        //计算画布缩放
        fitStageIntoParentContainer() {
            const main = this.$refs.work;
            this.$nextTick(() => {
                this.stageOpation.width = main.offsetWidth;
                this.stageOpation.height = main.offsetHeight;
                //重新赋值宽度高度
                this.pageStage.width(main.offsetWidth)
                this.pageStage.height(main.offsetHeight)
                // 重新计算
                let scaleX = this.layerOpation.width > this.stageOpation.width ? Number((this.stageOpation.width / this.layerOpation.width).toFixed(2)) : 1;
                let scaleY = this.layerOpation.height > this.stageOpation.height ? Number((this.stageOpation.height / this.layerOpation.height).toFixed(2)) : 1;
                let scale = Math.min(scaleX, scaleY);
                let x = scaleX == 1 ? (((this.stageOpation.width * scaleX) / 2) - (this.layerOpation.width * scale * 0.5)) : 0;
                let y = scaleY == 1 ? (((this.stageOpation.height * scaleY) / 2) - (this.layerOpation.height * scale * 0.5)) : 0;
                this.layerOpation.x = x;
                this.layerOpation.y = y;
                this.pageLayer.scaleX(scale)
                this.pageLayer.scaleY(scale)
                if (scaleX < 1) {
                    this.pageLayer.x(0)
                } if (scaleY < 1) {
                    this.pageLayer.y(0)
                }
                if (scaleX == 1 || scaleY == 1) {
                    this.pageLayer.x(x)
                    this.pageLayer.y(y)
                }
            });
        },
        //画布按下和触摸
        mousedownTouchstart(stage, selectionElement, layer) {
            stage.on("mousedown touchstart", (e) => {
                //点击的不是stage和背景就不执行
                if (e.target !== stage && e.target.getName() !== "background") {
                    return;
                }
                // - (layer.x() * layer.scaleX())
                const x1 = stage.getPointerPosition().x
                const y1 = stage.getPointerPosition().y
                const x2 = stage.getPointerPosition().x
                const y2 = stage.getPointerPosition().y
                console.log(layer.x(), layer.y())
                this.starPosition = {
                    x1,
                    x2,
                    y1,
                    y2,
                };
                console.log(this.starPosition)

                selectionElement.visible(true);
                selectionElement.width(0);
                selectionElement.height(0);
                layer.draw();
            });
        },
        //画布元素移动
        mousemoveTouchmove(stage, selectionElement, layer) {
            stage.on("mousemove touchmove", (e) => {
                if (!selectionElement.visible()) {
                    return;
                }
                const { x1, y1 } = this.starPosition;
                const x2 = stage.getPointerPosition().x
                const y2 = stage.getPointerPosition().y
                selectionElement.setAttrs({
                    x: Math.min(x1, x2),
                    y: Math.min(y1, y2),
                    width: Math.abs(x2 - x1),
                    height: Math.abs(y2 - y1),
                });
                layer.batchDraw();
            });
        },

        mouseupTouchend(stage, layer, selectionElement, tr) {
            stage.on("mouseup touchend", () => {
                if (!selectionElement.visible()) {
                    return;
                }
                // 在timeout中更新可视性，这样我们可以在click event中检查它
                setTimeout(() => {
                    selectionElement.visible(false);
                    layer.batchDraw();
                });


                // var shapes = stage.find('.rect').toArray()
                const shapes = [];
                layer.children.forEach((item) => {
                    if (
                        item.getName().indexOf("selectionElement") == -1 &&
                        item.getName().indexOf("Transformer") == -1 &&
                        item.getName().indexOf("background") == -1
                    )
                        shapes.push(item); // 选中所有不包含框选器
                });
                const box = selectionElement.getClientRect();
                console.log(box, 'boxbox')
                console.log(shapes, 'shapes')
                const selected = shapes.filter((shape) =>
                    Konva.Util.haveIntersection(box, shape.getClientRect())
                );
                this.pageTransformer.moveToTop();
                tr.nodes(selected);
                layer.batchDraw();
            });
        },
        clickTap(stage, layer, selectionElement, tr) {
            stage.on("click tap", (e) => {
                // this.show = false;
                if (
                    selectionElement.visible() ||
                    e.target.getName() == "background"
                ) {
                    tr.nodes([]);
                    return;
                }
                // if click on empty area - remove all selections
                // 如果单击空白区域-删除所有选择
                if (e.target === stage || e.target.getName() == "background") {
                    tr.nodes([]);
                    layer.draw();
                    return;
                }
                // do nothing if clicked NOT on our rectangles
                // 如果点击不在矩形上，什么都不做
                // if (e.target.getName().indexOf("background") === -1) {
                //   return;
                // }

                if (e.target.getClassName() == "Text") {
                    e.target.on("transform", () => {
                        // with enabled anchors we can only change scaleX
                        // so we don't need to reset height
                        // just width
                        //如果启用了锚，我们只能改变scaleX  
                        //所以我们不需要重置高度  
                        //只是宽度
                        e.target.setAttrs({
                            width: Math.max(e.target.width() * e.target.scaleX(), 40),
                            fontSize: Math.max(e.target.fontSize() * e.target.scaleY(), 20),
                            scaleX: 1,
                            scaleY: 1,
                        });
                    });
                }
                if (e.target.getParent().getType() == "Group") {
                    // this.show = true;
                }
                this.pageTransformer.moveToTop();
                tr.nodes([e.target]);
                this.activeShape = e.target;
                layer.draw();
            });
        },
        getTimestamp(prefix = "") {
            const timestamp = new Date().getTime().toString();
            if (prefix) {
                return prefix + timestamp;
            } else {
                return timestamp;
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.canvas-work-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>