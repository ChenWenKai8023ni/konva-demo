<template>
    <div v-resize="fitStageIntoParentContainer" ref="work" class="canvas-work-container">
        <div
            :ref="`canvas-container${canvasId}`"
            class="canvas-container"
            :id="`canvas-container${canvasId}`"
        ></div>
    </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
    name: "CanvaIndex",
    props: {
        canvasId: {
            type: [String, Number],
            default: '0'
        }
    },
    data() {
        return {
            GUIDELINE_OFFSET: 20,
            stageOpation: {
                container: "canvas-container",
                width: 0,
                height: 0,
            },
            groupOpation: {
                clip: {
                    width: 500,
                    height: 500,
                    x: 0,
                    y: 0,
                },
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                name: "InitGroup",
            },
            pageStage: null,
            pageLayer: null,
            pageGroup: null,
            pageTransformer: null,
            selectionElement: null,
            bgElement: null,
            starPosition: {
                x1: "",
                x2: "",
                y1: "",
                y2: "",
            },
            activeElment: null,
            pageLayerList: [],

        };
    },
    directives: {  // 使用局部注册指令的方式
        resize: { // 指令的名称
            bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
                let width = '', height = '';
                function isReize() {
                    const style = document.defaultView.getComputedStyle(el);
                    if (width !== style.width || height !== style.height) {
                        binding.value();  // 关键
                    }
                    width = style.width;
                    height = style.height;
                }
                el.__vueSetInterval__ = setInterval(isReize, 300);
            },
            unbind(el) {
                clearInterval(el.__vueSetInterval__);
            }
        }
    },
    created() {
        this.stageOpation.container = `${this.stageOpation.container}${this.canvasId}`
        this.$nextTick(() => {
            this.init()
            // this.$nextTick(() => {
            //     window.addEventListener(
            //         "resize",
            //         this.fitStageIntoParentContainer
            //     );
            // })
        })
    },
    mounted() {
    },
    methods: {
        ...mapActions([
            "SetPreview",
            "SetPage",
            "SetActive",
            "SetbgElement"
        ]),
        //初始化stage和layer
        init() {
            const main = this.$refs.work;
            this.stageOpation.width = main.offsetWidth;
            this.stageOpation.height = main.offsetHeight;
            this.pageStage = new Konva.Stage(this.stageOpation);
            this.pageLayer = new Konva.Layer();
            this.pageStage.add(this.pageLayer);
            this.$nextTick(() => {
                this.initGroup()
            })
        },
        //创建group
        initGroup() {
            let scaleX = this.groupOpation.clip.width > this.stageOpation.width ? Number((this.stageOpation.width / this.groupOpation.clip.width).toFixed(2)) : 1;
            let scaleY = this.groupOpation.clip.height > this.stageOpation.height ? Number((this.stageOpation.height / this.groupOpation.clip.height).toFixed(2)) : 1;
            this.groupOpation.scaleX = scaleX;
            this.groupOpation.scaleY = scaleY;
            let x = scaleX == 1 ? ((this.stageOpation.width * scaleX) / 2 - (this.groupOpation.clip.width * scaleX * 0.5)) : 0;
            let y = scaleY == 1 ? ((this.stageOpation.height * scaleY) / 2 - (this.groupOpation.clip.height * scaleY * 0.5)) : 0;
            this.groupOpation.x = x;
            this.groupOpation.y = y;
            this.pageGroup = new Konva.Group(this.groupOpation);
            this.InitBackground()
            this.initTransformer();
            // this.addText()
            this.$nextTick(() => {
                let obj = {
                    pageStage: this.pageStage,
                    pageLayer: this.pageLayer,
                    pageGroup: this.pageGroup,
                    pageTransformer: this.pageTransformer,
                }
                //保存到vuex中
                this.SetPage(obj)
                // 鼠标按下或屏幕触摸
                this.mousedownTouchstart(this.pageStage, this.selectionElement, this.pageLayer)
                // 鼠标移动或屏幕触摸移动
                this.mousemoveTouchmove(this.pageStage, this.selectionElement, this.pageLayer);
                // 鼠标放开或屏幕触摸结束
                this.mouseupTouchend(this.pageStage, this.pageLayer, this.selectionElement, this.pageTransformer);
                // 鼠标点击
                this.clickTap(this.pageStage, this.pageLayer, this.selectionElement, this.pageTransformer);
                //层次移动
                this.layerDragmove(this.pageLayer);
                //层次移动结束
                this.layerDragend(this.pageLayer);
                //
                this.stageDragend(this.pageStage)
                this.stageDouble(this.pageStage)
            })
        },
        //初始化背景
        InitBackground() {
            this.bgElement = new Konva.Rect({
                width: this.groupOpation.clip.width,
                height: this.groupOpation.clip.height,
                x: 0,
                y: 0,
                fill: '#fff',
                name: "Background",
            });
            this.pageGroup.add(this.bgElement);
            this.pageLayer.add(this.pageGroup)
            this.SetbgElement(this.bgElement)
        },
        initTransformer() {
            //元素框选
            this.selectionElement = new Konva.Rect({
                fill: "rgba(0,0,255,0.5)",
                visible: false, // 默认不显示
                name: "selectionElement",
            });
            //元素变形器
            this.pageTransformer = new Konva.Transformer({
                nodes: [],
                centeredScaling: false,//是否中心扩展
                keepRatio: true,//保持比例
                name: "Transformer",
                rotationSnaps: [0, 90, 180, 270],//旋转角度吸附
            });
            this.pageLayer.add(this.selectionElement);
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
            var simpleText2 = new Konva.Text({
                x: 150,
                y: 150,
                text: "Simple Text2",
                fontSize: 30,
                fill: "green",
                name: "Text",
                draggable: true,
            });
            var imageObj = new Image();
            imageObj.src = require("../../assets/logo.png");
            imageObj.onload = () => {
                var image = new Konva.Image({
                    x: 200,
                    y: 50,
                    image: imageObj,
                    src: require("../../assets/logo.png"),
                    width: 100,
                    height: 100,
                    draggable: true,
                    name: "Image",
                });
                this.pageGroup.add(image);
            };
            this.pageGroup.add(simpleText);
            this.pageGroup.add(simpleText2);
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
                let scaleX = this.groupOpation.clip.width > this.stageOpation.width ? Number((this.stageOpation.width / this.groupOpation.clip.width).toFixed(2)) : 1;
                let scaleY = this.groupOpation.clip.height > this.stageOpation.height ? Number((this.stageOpation.height / this.groupOpation.clip.height).toFixed(2)) : 1;
                let scale = Math.min(scaleX, scaleY);
                this.groupOpation.scaleX = scale;
                this.groupOpation.scaleY = scale;
                let x = scaleX == 1 ? ((this.stageOpation.width * scaleX) / 2 - (this.groupOpation.clip.width * scale * 0.5)) : 0;
                let y = scaleY == 1 ? ((this.stageOpation.height * scaleY) / 2 - (this.groupOpation.clip.height * scale * 0.5)) : 0;
                this.groupOpation.x = x;
                this.groupOpation.y = y;
                this.pageGroup.scaleX(scale)
                this.pageGroup.scaleY(scale)
                if (scaleX < 1) {
                    this.pageGroup.x(0)
                } if (scaleY < 1) {
                    this.pageGroup.y(0)
                }
                if (scaleX == 1 || scaleY == 1) {
                    this.pageGroup.x(x)
                    this.pageGroup.y(y)
                }

            });
        },
        //按下和触摸
        mousedownTouchstart(stage, selectionElement, layer) {
            stage.on("mousedown touchstart", (e) => {
                //点击的不是stage和背景就不执行
                if (e.target !== stage && e.target.getName() !== "Background") {
                    return;
                }
                const x1 = stage.getPointerPosition().x
                const y1 = stage.getPointerPosition().y
                const x2 = stage.getPointerPosition().x
                const y2 = stage.getPointerPosition().y
                this.starPosition = {
                    x1,
                    x2,
                    y1,
                    y2,
                };

                selectionElement.visible(true);
                selectionElement.width(0);
                selectionElement.height(0);
                layer.draw();
            });
        },
        //元素按下移动
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
        //按下结束
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
                this.pageGroup.children.forEach((item) => {
                    if (
                        item.getName().indexOf("selectionElement") == -1 &&
                        item.getName().indexOf("Transformer") == -1 &&
                        item.getName().indexOf("Background") == -1 &&
                        item.draggable()
                    )
                        shapes.push(item); // 选中所有不包含框选器
                });

                const box = selectionElement.getClientRect();
                const selected = shapes.filter((shape) =>
                    Konva.Util.haveIntersection(box, shape.getClientRect())
                );
                tr.moveToTop()
                tr.rotateEnabled(true);
                tr.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right']);
                tr.nodes(selected);
                if (selected.length == 1) {
                    this.activeElment = selected[0]
                    this.SetActive(selected[0])
                }
                layer.batchDraw();
            });
        },
        //单击事件
        clickTap(stage, layer, selectionElement, tr) {
            stage.on("click tap", (e) => {
                //如果框选显示则不执行任何操作
                if (selectionElement.visible()) {
                    this.SetActive(e.target)
                    return;
                }
                //如果点击的是 stage 或者是背景则清空
                if (e.target === stage || e.target.getName() == "Background") {
                    tr.nodes([]);
                    this.SetActive(null)
                    layer.draw();
                    return;
                }
                this.pageTransformer.moveToTop();
                tr.nodes([e.target]);
                this.activeElment = e.target;
                this.SetActive(this.activeElment)
                this.shapeTransform(e, layer, tr);
                this.shapeTransformend(e, layer);
                layer.draw();
            });
        },
        stageDragend(stage) {
            // stage.on('dragend', () => {
            //     this.updatePreview(stage)
            // });
        },
        //双击事件监听
        stageDouble(stage) {
            stage.off('dblclick');
            stage.on('dblclick', (e) => {
                if (e.target.getName() == 'Image' || e.target.getName() == 'Background') {
                    console.log(e.target.getAttrs().src)
                }
            })
        },

        //层次移动
        layerDragmove(layer) {
            let that = this;
            layer.on("dragmove", function (e) {
                layer.find(".guid-line").forEach((item) => {
                    item.destroy();
                });
                var lineGuideStops = that.getLineGuideStops(e.target);
                // 找到当前对象的接合点
                var itemBounds = that.getObjectSnappingEdges(e.target);
                // 现在找到我们可以捕捉当前对象的地方
                var guides = that.getGuides(lineGuideStops, itemBounds);

                // 什么都不做
                if (!guides.length) {
                    return;
                }
                that.drawGuides(guides);

                // now force object position
                // 现在来看力物体的位置
                // guides.forEach(lg => {
                //     switch (lg.snap) {
                //         case 'start': {
                //             switch (lg.orientation) {
                //                 case 'V': {
                //                     e.target.x(lg.lineGuide + lg.offset);
                //                     break;
                //                 }
                //                 case 'H': {
                //                     e.target.y(lg.lineGuide + lg.offset);
                //                     break;
                //                 }
                //             }
                //             break;
                //         }
                //         case 'center': {
                //             switch (lg.orientation) {
                //                 case 'V': {
                //                     e.target.x(lg.lineGuide + lg.offset);
                //                     break;
                //                 }
                //                 case 'H': {
                //                     e.target.y(lg.lineGuide + lg.offset);
                //                     break;
                //                 }
                //             }
                //             break;
                //         }
                //         case 'end': {
                //             switch (lg.orientation) {
                //                 case 'V': {
                //                     e.target.x(lg.lineGuide + lg.offset);
                //                     break;
                //                 }
                //                 case 'H': {
                //                     e.target.y(lg.lineGuide + lg.offset);
                //                     break;
                //                 }
                //             }
                //             break;
                //         }
                //     }
                // });

            });
        },
        //层次移动结束
        layerDragend(layer) {
            layer.on("dragend", function (e) {
                layer.find(".guid-line").forEach((item) => {
                    item.destroy();
                });
                layer.batchDraw();
            });
        },
        // 获取线的点位置
        getLineGuideStops(skipShape) {
            var vertical = [0, this.pageStage.width() / 2, this.pageStage.width()];
            var horizontal = [
                0,
                this.pageStage.height() / 2,
                this.pageStage.height(),
            ];
            var AllShape = this.pageStage.find((node) => {
                return node.getType() === "Shape";
            });
            AllShape.forEach((guideItem) => {
                if (guideItem === skipShape) {
                    return;
                }
                var box = guideItem.getClientRect();
                vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
                horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
            });
            return {
                vertical: vertical.flat(),
                horizontal: horizontal.flat(),
            };
        },
        //获取捕捉的对象边缘
        getObjectSnappingEdges(node) {
            var box = node.getClientRect();
            return {
                vertical: [
                    {
                        guide: Math.round(box.x),
                        offset: Math.round(node.x() - box.x),
                        snap: "start",
                    },
                    {
                        guide: Math.round(box.x + box.width / 2),
                        offset: Math.round(node.x() - box.x - box.width / 2),
                        snap: "center",
                    },
                    {
                        guide: Math.round(box.x + box.width),
                        offset: Math.round(node.x() - box.x - box.width),
                        snap: "end",
                    },
                ],
                horizontal: [
                    {
                        guide: Math.round(box.y),
                        offset: Math.round(node.y() - box.y),
                        snap: "start",
                    },
                    {
                        guide: Math.round(box.y + box.height / 2),
                        offset: Math.round(node.y() - box.y - box.height / 2),
                        snap: "center",
                    },
                    {
                        guide: Math.round(box.y + box.height),
                        offset: Math.round(node.y() - box.y - box.height),
                        snap: "end",
                    },
                ],
            };
        },
        getGuides(lineGuideStops, itemBounds) {
            var resultV = [];
            var resultH = [];

            lineGuideStops.vertical.forEach((lineGuide) => {
                itemBounds.vertical.forEach((itemBound) => {
                    var diff = Math.abs(lineGuide - itemBound.guide);
                    // if the distance between guild line and object snap point is close we can consider this for snapping
                    //如果行线和对象的捕捉点之间的距离很近，我们可以考虑这个进行捕捉
                    if (diff < this.GUIDELINE_OFFSET) {
                        resultV.push({
                            lineGuide: lineGuide,
                            diff: diff,
                            snap: itemBound.snap,
                            offset: itemBound.offset,
                        });
                    }
                });
            });

            lineGuideStops.horizontal.forEach((lineGuide) => {
                itemBounds.horizontal.forEach((itemBound) => {
                    var diff = Math.abs(lineGuide - itemBound.guide);
                    if (diff < this.GUIDELINE_OFFSET) {
                        resultH.push({
                            lineGuide: lineGuide,
                            diff: diff,
                            snap: itemBound.snap,
                            offset: itemBound.offset,
                        });
                    }
                });
            });

            var guides = [];

            // find closest snap
            // 找到最近的
            var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
            var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
            if (minV) {
                guides.push({
                    lineGuide: minV.lineGuide,
                    offset: minV.offset,
                    orientation: "V",
                    snap: minV.snap,
                });
            }
            if (minH) {
                guides.push({
                    lineGuide: minH.lineGuide,
                    offset: minH.offset,
                    orientation: "H",
                    snap: minH.snap,
                });
            }
            return guides;
        },
        //画
        drawGuides(guides) {
            guides.forEach((lg) => {
                if (lg.orientation === "H") {
                    var line = new Konva.Line({
                        points: [-6000, lg.lineGuide, 6000, lg.lineGuide],
                        stroke: "rgb(0, 161, 255)",
                        strokeWidth: 1,
                        name: "guid-line",
                        dash: [4, 6],
                    });
                    this.pageLayer.add(line);
                    this.pageLayer.batchDraw();
                } else if (lg.orientation === "V") {
                    var line = new Konva.Line({
                        points: [lg.lineGuide, -6000, lg.lineGuide, 6000],
                        stroke: "rgb(0, 161, 255)",
                        strokeWidth: 1,
                        name: "guid-line",
                        dash: [4, 6],
                    });
                    this.pageLayer.add(line);
                    this.pageLayer.batchDraw();
                }
            });
        },
        //更新预览图
        updatePreview(stage) {
            const scale = 0.5;
            // use pixelRatio to generate smaller preview
            // this.Transformer.visible(false);
            const url = stage.toDataURL({
                width: this.groupOpation.clip.width,
                height: this.groupOpation.clip.height,
                x: this.groupOpation.x,
                y: this.groupOpation.y,
                pixelRatio: scale
            });
            this.SetPreview(url)
        },
        shapeTransformend(newActive, layer) {
            newActive.target.off('transformend');
            newActive.target.on("transformend", (ev) => {
                // this.activeElment = ev.target;
                // this.SetActive(this.activeElment)
                layer.batchDraw();
            });
        },
        shapeTransform(newActive, layer, tr) {
            newActive.target.off('transform');
            if (newActive.target.getClassName() == "Text") {
                tr.enabledAnchors(['top-left', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-right']);
                newActive.target.on("transform", () => {
                    newActive.target.setAttrs({
                        width: Math.max(newActive.target.width() * newActive.target.scaleX(), 40),
                        fontSize: Math.max((newActive.target.fontSize() * newActive.target.scaleY()).toFixed(0), 20),
                        scaleX: 1,
                        scaleY: 1,
                    });
                });
            }
            if (!newActive.target.draggable()) {
                tr.enabledAnchors([]);
                tr.rotateEnabled(false);
            } else {
                tr.rotateEnabled(true);
            }
        }
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
    // overflow: auto;
}
</style>