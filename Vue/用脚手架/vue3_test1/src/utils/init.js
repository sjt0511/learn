/**
 *
 */

const App = {
  isLandscape: true,
  /* 初始化 */
  initialize() {
    this.setRootFont()
  },
  /* 设置根元素的大小 */
  setRootFont() {
    // 默认横屏
    const designWidth_l = 1024; // 横屏设计宽度
    const designWidth_p = 750; // 竖屏设计宽度
    const width = window.innerWidth;// 屏幕宽度
    const height = window.innerHeight;// 屏幕高度
    const isLandscape = width > height;// 是否横屏
    const designWidth = isLandscape ? designWidth_l : designWidth_p
    const fontSize = width * 100 / designWidth
    document.querySelector('html').style.fontSize = fontSize + 'px';
  },
}

App.initialize()

export default App
