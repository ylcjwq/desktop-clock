import { app, BrowserWindow, screen } from "electron";
import path from "node:path";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 300,
    // titleBarStyle: "hidden",
    transparent: true,
    frame: false,
    movable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  // 始终置顶
  win.setAlwaysOnTop(true);

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//实现透明区域忽略鼠标事件
setInterval(() => {
  const point = screen.getCursorScreenPoint();
  const [x, y] = win!.getPosition();
  const [w, h] = win!.getSize();

  if (point.x > x && point.x < x + w && point.y > y && point.y < y + h) {
    updateIgnoreMouseEvents(point.x - x, point.y - y);
  }
}, 300);

const updateIgnoreMouseEvents = async (x: number, y: number) => {
  // 捕获鼠标所在区域1*1的像素块.
  const image = await win!.webContents.capturePage({
    x,
    y,
    width: 1,
    height: 1,
  });

  var buffer = image.getBitmap();

  // 获取鼠标所在的像素块的alpha通道值
  win!.setIgnoreMouseEvents(!buffer[3]);
  // console.log("setIgnoreMouseEvents", !buffer[3]);
};

app.whenReady().then(createWindow);
