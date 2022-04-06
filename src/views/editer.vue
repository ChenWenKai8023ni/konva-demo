<template>
  <div>
    <div class="head">
      <button v-show="show" @click="unfasten">解开</button>
      <button v-show="show" @click="toGroup">还原</button>
      <button @click="toUp">加一层</button>
      <button @click="toDown">减一层</button>
      <button @click="toJson">导出json</button>
    </div>
    <div class="main">
      <div class="left"></div>
      <div class="right">
        <div ref="container" id="container"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      color: "red",
      // canvas宽度
      canWidth: 0,
      // 页面canvas
      pageStage: null,
      // canvas的图层列表
      pageLayerList: [],
      pageLayer: null,
      pageTransformer: null,
      bgFill: "#ccc",
      selectionRectangle: null,
      // 开似乎位置
      starPosition: {
        x1: "",
        x2: "",
        y1: "",
        y2: "",
      },
      activeShape: null,
      show: false,
      GUIDELINE_OFFSET: 5,
    };
  },
  created() {
    // 初始化--创建画布并创建一个图层
    this.$nextTick(() => {
      this.init();
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.addElem();
      this.addgroupElem();
    });
  },
  methods: {
    init() {
      const main = this.$refs.container;
      this.canWidth = main.offsetWidth;
      this.pageStage = new Konva.Stage({
        container: "container",
        width: main.offsetWidth,
        height: 440,
      });
      this.addBgLayer();
      this.addLayer();
    },
    addLayer() {
      const name = this.getTimestamp("l");
      this.pageLayer = new Konva.Layer();
      this.pageStage.add(this.pageLayer);
      this.pageLayerList.push({ name, layer: this.pageLayer });
    },
    addBgLayer() {
      const name = this.getTimestamp("bg");
      const bgLayer = new Konva.Layer({});
      let bgreact = new Konva.Rect({
        width: this.pageStage.width(),
        height: this.pageStage.height(),
        x: 0,
        y: 0,
        fill: this.bgFill,
        name: "background",
      });
      bgLayer.add(bgreact);
      this.pageStage.add(bgLayer);
      this.pageLayerList.push({ name, layer: bgLayer });
    },
    addElem() {
      var imageObj = new Image();
      imageObj.src = require("../assets/logo.png");
      imageObj.onload = () => {
        var image = new Konva.Image({
          x: 200,
          y: 50,
          image: imageObj,
          src: require("../assets/logo.png"),
          width: 100,
          height: 100,
          draggable: true,
          name: "Image",
        });
        this.pageLayer.add(image);
      };

      this.selectionRectangle = new Konva.Rect({
        fill: "rgba(0,0,255,0.5)",
        visible: false, // 默认不显示
        name: "selectionRectangle",
      });
      this.pageLayer.add(this.selectionRectangle);
      this.pageLayer.draw();
      // 选中框
      this.pageTransformer = new Konva.Transformer({
        nodes: [],
        centeredScaling: false,
        keepRatio: true,
        name: "Transformer",
      });

      this.pageLayer.add(this.pageTransformer);
      // 鼠标按下或屏幕触摸
      this.mousedownTouchstart(
        this.pageStage,
        this.selectionRectangle,
        this.pageLayer
      );
      // 鼠标移动或屏幕触摸移动
      this.mousemoveTouchmove(
        this.pageStage,
        this.selectionRectangle,
        this.pageLayer
      );
      // 鼠标放开或屏幕触摸结束
      this.mouseupTouchend(
        this.pageStage,
        this.pageLayer,
        this.selectionRectangle,
        this.pageTransformer
      );
      // 鼠标点击
      this.clickTap(
        this.pageStage,
        this.pageLayer,
        this.selectionRectangle,
        this.pageTransformer
      );
      this.dragmove(this.pageLayer);
      this.dragend(this.pageLayer);
      window.addEventListener(
        "resize",
        this.fitStageIntoParentContainer(this.pageStage)
      );
    },
    addgroupElem() {
      let group = new Konva.Group({
        x: 120,
        y: 40,
        rotation: 0,
        draggable: true,
        name: "Group",
      });
      let colors = ["red", "orange"];

      for (var i = 0; i < 2; i++) {
        var box = new Konva.Rect({
          x: i * 50,
          y: i * 60,
          width: 100,
          height: 50,
          name: colors[i],
          fill: colors[i],
          stroke: "black",
          strokeWidth: 4,
          name: "Rect",
        });

        group.add(box);
      }
      var simpleText = new Konva.Text({
        x: 50,
        y: 15,
        text: "Simple Text",
        fontSize: 30,
        fill: "green",
        name: "Text",
      });
      group.add(simpleText);
      this.pageLayer.add(group);
    },
    getTimestamp(prefix = "") {
      const timestamp = new Date().getTime().toString();
      if (prefix) {
        return prefix + timestamp;
      } else {
        return timestamp;
      }
    },
    /**
     * 监听--鼠标按下或屏幕触摸
     * @param stage
     * @param layer
     * @param selectionRectangle
     */
    mousedownTouchstart(stage, selectionRectangle, layer) {
      stage.on("mousedown touchstart", (e) => {
        //点击的不是stage和背景就不执行
        if (e.target !== stage && e.target.getName() !== "background") {
          return;
        }

        const x1 = stage.getPointerPosition().x;
        const y1 = stage.getPointerPosition().y;
        const x2 = stage.getPointerPosition().x;
        const y2 = stage.getPointerPosition().y;
        this.starPosition = {
          x1,
          x2,
          y1,
          y2,
        };

        selectionRectangle.visible(true);
        selectionRectangle.width(0);
        selectionRectangle.height(0);
        layer.draw();
      });
    },
    /**
     * 监听--鼠标移动或屏幕触摸移动
     * @param stage
     * @param layer
     * @param selectionRectangle
     */
    mousemoveTouchmove(stage, selectionRectangle, layer) {
      stage.on("mousemove touchmove", (e) => {
        if (!selectionRectangle.visible()) {
          return;
        }
        const { x1, y1 } = this.starPosition;
        const x2 = stage.getPointerPosition().x;
        const y2 = stage.getPointerPosition().y;
        selectionRectangle.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });

        layer.batchDraw();
      });
    },
    /**
     * 监听--鼠标松开或屏幕触摸结束
     * @param stage
     * @param layer
     * @param selectionRectangle
     * @param tr
     */
    mouseupTouchend(stage, layer, selectionRectangle, tr) {
      stage.on("mouseup touchend", () => {
        if (!selectionRectangle.visible()) {
          return;
        }
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionRectangle.visible(false);
          layer.batchDraw();
        });

        // var shapes = stage.find('.rect').toArray()
        const shapes = [];
        layer.children.forEach((item) => {
          if (
            item.getName().indexOf("selectionRectangle") == -1 &&
            item.getName().indexOf("Transformer") == -1
          )
            shapes.push(item); // 选中所有不包含框选器
        });
        const box = selectionRectangle.getClientRect();
        const selected = shapes.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );
        this.pageTransformer.moveToTop();
        console.log(selected, 'selected')

        tr.nodes(selected);
        layer.batchDraw();
      });
    },
    /**
     * 监听--点击事件
     * @param stage
     * @param layer
     * @param selectionRectangle
     * @param tr
     */
    clickTap(stage, layer, selectionRectangle, tr) {
      stage.on("click tap", (e) => {
        this.show = false;
        // if we are selecting with rect, do nothing
        // 如果我们用rect进行选择，什么都不做
        if (
          selectionRectangle.visible() ||
          e.target.getName() == "background"
        ) {
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
            e.target.setAttrs({
              width: Math.max(e.target.width() * e.target.scaleX(), 40),
              fontSize: Math.max(e.target.fontSize() * e.target.scaleY(), 20),
              scaleX: 1,
              scaleY: 1,
            });
          });
        }
        if (e.target.getParent().getType() == "Group") {
          this.show = true;
        }
        this.pageTransformer.moveToTop();
        tr.nodes([e.target]);
        this.activeShape = e.target;
        layer.draw();
      });
    },

    // 解开组一起移动的限制
    unfasten() {
      //   this.activeShape.draggable(true);
      this.activeShape.getParent().draggable(false);
      let children = this.activeShape.getParent().getChildren();
      for (let item of children) {
        item.draggable(true);
      }
    },
    toGroup() {
      this.activeShape.getParent().draggable(true);
      let children = this.activeShape.getParent().getChildren();
      for (let item of children) {
        item.draggable(false);
      }
    },
    toUp() {
      if (this.activeShape != null) {
        this.activeShape.moveUp();
      }
    },
    toDown() {
      if (this.activeShape != null) {
        this.activeShape.moveDown();
      }
    },
    toJson() {
      console.log(JSON.parse(this.pageStage.toJSON()));
    },
    dragmove(layer) {
      let that = this;
      layer.on("dragmove", function (e) {
        // clear all previous lines on the screen
        // layer.find(".guid-line").destroy ()
        layer.find(".guid-line").forEach((item) => {
          item.destroy();
        });
        // find possible snapping lines
        var lineGuideStops = that.getLineGuideStops(e.target);
        // find snapping points of current object
        // 找到当前对象的接合点
        var itemBounds = that.getObjectSnappingEdges(e.target);
        // now find where can we snap current object
        // 现在找到我们可以捕捉当前对象的地方
        var guides = that.getGuides(lineGuideStops, itemBounds);

        // do nothing of no snapping
        // 什么都不做吗
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
    dragend(layer) {
      layer.on("dragend", function (e) {
        layer.find(".guid-line").forEach((item) => {
          item.destroy();
        });
        layer.batchDraw();
      });
    },

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
    fitStageIntoParentContainer(stage) {
      var container = document.querySelector("#container");
      var containerWidth = container.offsetWidth;
      // var scale = containerWidth / sceneWidth;
      // stage.width(sceneWidth * scale);
      // stage.height(sceneHeight * scale);
      // stage.scale({ x: scale, y: scale });
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
// .head {
//   height: 80px;
//   border: 1px solid #000;
// }
.main {
  display: flex;
  flex-wrap: nowrap;
  .left {
    flex-basis: 240px;
    border: 1px solid #000;
  }
  .right {
    flex: 1;
    border: 1px solid #000;
    #container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>