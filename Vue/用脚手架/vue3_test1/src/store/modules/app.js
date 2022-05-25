/**
 * app
 */

const app = {
  namespaced: true,
  state: () => ({
    isLandscape: true, // 是否横屏
    size: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }, // 窗口大小
    config: null
  }),
}

export default app
