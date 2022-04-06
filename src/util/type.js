export const textObj = {
    "name": "",
    "id": "",
    "type": "text",
    "class": 'Text',
    "x": 100,
    "y": 100,
    "rotation": 0,//角度的旋转
    "opacity": 1,//透明度 0-1
    "visible": true,//是否可见
    "draggable": true,//是否可移动
    "fontSize": 40,
    "fontFamily": "Arial",
    "text": "创建文字",
    "fill": "black",
    "align": "center",
    "fontVariant": 'small-caps',
    "fontStyle": "normal", //粗体，斜体 bold, or italic.
    "textDecoration": "",//下划线，删除线   underline ，line-through
    // "width": 60,
    // "height": 18,
    "strokeWidth": 0,//边框
    "stroke": "black",
    "lineHeight": 1.5,
    "letterSpacing": 0,
    "shadowEnabled": false,//是否启用
    "shadowBlur": 5,//阴影范围
    "shadowOffsetX": 0,
    "shadowOffsetY": 0,
    "shadowColor": "black",
}

export const imageObj = {
    "name": "",
    "id": "",
    "type": "Image",
    "class": 'Image',
    "x": 10,
    "y": 10,
    "rotation": 0,//角度的旋转
    "opacity": 1,//透明度 0-1
    "visible": true,//是否可见
    "draggable": true,//是否可移动
    // "fill": "",
    "width": 400,
    "height": 267,
    // "src": "https://s4.ax1x.com/2022/02/14/HyVNlj.png",
    "src": "https://images.unsplash.com/photo-1648817860770-dacc62d8cb18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTY5OTZ8MHwxfGFsbHwyfHx8fHx8Mnx8MTY0ODg3NTcwNw&ixlib=rb-1.2.1&q=80&w=1080",
    "cropX": 0,
    "cropY": 0,
    "cropWidth": 0,
    "cropHeight": 0,
    "borderColor": "black",
    "borderSize": 0,
    "shadowEnabled": false,//是否启用
    "shadowBlur": 5,//阴影范围
    "shadowOffsetX": 0,
    "shadowOffsetY": 0,
    "shadowColor": "black",
}


export const throttle = function (fn, delay) {
    let jieke = true;
    console.log('1212')
    return function () {
        if (!jieke) {
            return false;
        }
        jieke = false;
        setTimeOut(() => {
            fn.call(this)();
            jieke = true;
        }, delay);
    }
}
