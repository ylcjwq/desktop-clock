import { useEffect, useRef } from "react";

//定义时钟组件
const DesktopClock: React.FC = () => {
  //创建一个ref对象，用于存储canvas元素
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //用useEffect来更新时钟状态
  useEffect(() => {
    //获取canvas元素
    const canvas = canvasRef.current as HTMLCanvasElement;
    //获取2D绘图上下文ctx
    const ctx = canvas.getContext("2d");

    //如果上下文存在，进行绘制
    if (ctx) {
      //绘制表盘
      const drawPanel = () => {
        //绘制表盘圆心
        ctx.translate(100, 100);
        ctx.beginPath();
        ctx.arc(0, 0, 98, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      };

      //绘制小时数字
      const hourNumbers = () => {
        const hourArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        ctx.beginPath();
        ctx.font = "20px fangsong";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";
        for (let i = 0; i < hourArr.length; i++) {
          ctx.fillText(
            hourArr[i].toString(),
            80 * Math.cos(((i * 30 - 60) * Math.PI) / 180),
            80 * Math.sin(((i * 30 - 60) * Math.PI) / 180)
          );
        }

        for (let i = 0; i < 60; i++) {
          if (i % 5 === 0) {
            ctx.beginPath();
            ctx.arc(
              94 * Math.cos(((i * 6 - 300) * Math.PI) / 180),
              94 * Math.sin(((i * 6 - 300) * Math.PI) / 180),
              2,
              0,
              2 * Math.PI,
              true
            );
            ctx.fillStyle = "#000";
            ctx.fill();
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(
              94 * Math.cos(((i * 6 - 300) * Math.PI) / 180),
              94 * Math.sin(((i * 6 - 300) * Math.PI) / 180),
              1,
              0,
              2 * Math.PI,
              true
            );
            ctx.fillStyle = "#ccc";
            ctx.fill();
            ctx.stroke();
          }
        }
      };

      //绘制表盘的中心点
      const centerDot = () => {
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.arc(0, 0, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "gray";
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fill();
      };

      //绘制小时指针
      const hourHand = (hours: number, minutes: number) => {
        const radius =
          ((2 * Math.PI) / 12) * hours + (((1 / 6) * Math.PI) / 60) * minutes;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
        ctx.rotate(radius);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -50);
        ctx.stroke();
        ctx.restore();
      };

      //绘制分钟指针
      const minuteHand = (minutes: number) => {
        const radius = ((2 * Math.PI) / 60) * minutes;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
        ctx.rotate(radius);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -70);
        ctx.stroke();
        ctx.restore();
      };

      //绘制秒指针
      const secondHand = (seconds: number) => {
        const radius = ((2 * Math.PI) / 60) * seconds;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.strokeStyle = "red";
        ctx.rotate(radius);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -90);
        ctx.stroke();
        ctx.restore();
      };

      //更新表盘
      const update = () => {
        const time = new Date();
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        ctx.save();
        drawPanel();
        hourNumbers();
        centerDot();
        secondHand(seconds);
        minuteHand(minutes);
        hourHand(hours, minutes);
        ctx.restore();
      };

      //更新表盘
      const runFrame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        update();
        requestAnimationFrame(runFrame);
      };
      runFrame();
    }
  }, []);

  return <canvas ref={canvasRef} width={200} height={200} id="canvas"></canvas>;
};

export default DesktopClock;
