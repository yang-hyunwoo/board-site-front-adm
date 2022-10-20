<template>
<qrcode-stream @decode='decode' :track='drawOutline'></qrcode-stream>
</template>

<script>
import {QrcodeStream} from 'vue3-qrcode-reader'
export default {
  components: {
    QrcodeStream
  },
  methods:{
      decode(decodeString){   //QR 값 받아오기
          this.$emit("qrEmit",decodeString);
      },
      
  // drawOutline(decodeData,context){    //QR 테두리 
  //   console.log(decodeData);
  //   // console.log("1111");
  //       let points=[];
  //       points[0]=decodeData.bottomLeftCorner;
  //       points[1]=decodeData.bottomRightCorner;
  //       points[2]=decodeData.topLeftCorner;
  //       points[3]=decodeData.topRightCorner;
  //       context.lineWidth=3      //qr코드 사각형 크기
  //       context.strokeStyle='red'; //qr코드 사각형 색상
  //       context.beginPath();
  //       context.moveTo(points[0].x , points[0].y)
  //       for(const {x,y} of points)
  //       {
  //           context.lineTo(x,y);
  //       }
  //       context.lineTo(points[0].x , points[0].y)
  //       context.closePath();
  //       context.stroke();
  //    },
  },
};
</script>

