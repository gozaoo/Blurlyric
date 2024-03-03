<template>
    <teleport to="body">
      <div
        v-show="visible"
        :style="styles"
        ref="popover"
        @mouseleave="onMouseLeave"
        @mouseenter="onMouseEnter"
      >
        <slot></slot>
      </div>
    </teleport>
  </template>
  
  <script>
  import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue';
  
  // PositionType 类型定义
  const PositionType = {
    COORDINATE: 'coordinate',
    FOLLOW_MOUSE: 'followMouse',
    FOLLOW_ELEMENT: 'followElement',
  };
  
  // CloseMethod 类型定义
  const CloseMethod = {
    BLUR: 'blur',
    CLICK_OUTSIDE: 'clickOutside',
  };
  
  export default {
    name: 'Popover',
    props: {
      position: {
        type: String,
        default: PositionType.FOLLOW_MOUSE,
        validator: (value) => Object.values(PositionType).includes(value),
      },
      targetElements: {
        type: Array,
        default: () => [],
      },
      closeMethod: {
        type: String,
        default: CloseMethod.CLICK_OUTSIDE,
        validator: (value) => Object.values(CloseMethod).includes(value),
      },
    },
    emits: ['update:visible'],
    setup(props, { emit }) {
      const visible = ref(false);
      const styles = ref({});
      const popover = ref(null);
  
      // 计算位置
      function calculatePosition() {
        const { position, targetElements } = props;
        const { left, top, width, height } = popover.value.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
  
        let style = {};
  
        if (position === PositionType.COORDINATE) {
          // 坐标定位
          style = {
            position: 'fixed',
            bottom: `${screenHeight - top}px`,
            right: `${screenWidth - left}px`,
          };
        } else if (position === PositionType.FOLLOW_MOUSE) {
          // 鼠标跟随
          style = {
            position: 'fixed',
            top: `${top + window.scrollY}px`,
            left: `${left + window.scrollX}px`,
          };
        } else if (position === PositionType.FOLLOW_ELEMENT) {
          // 元素跟随
          const targetRect = targetElements[0].getBoundingClientRect();
          style = {
            position: 'fixed',
            bottom: `${targetRect.bottom + window.scrollY}px`,
            right: `${targetRect.right + window.scrollX}px`,
          };
        }
  
        // 确保不超出浏览器显示区域
        if (left + width > screenWidth || top + height > screenHeight) {
          style.bottom = `${screenHeight - height}px`;
          style.right = `${screenWidth - width}px`;
        }
  
        return style;
      }
  
      // 更新样式
      function updateStyles() {
        styles.value = calculatePosition();
      }
  
      // 显示悬浮框
      function show() {
        visible.value = true;
        updateStyles();
      }
  
      // 隐藏悬浮框
      function hide() {
        visible.value = false;
      }
  
      // 鼠标移入事件
      function onMouseEnter() {
        if (props.closeMethod === CloseMethod.BLUR) {
          emit('update:visible', true);
        }
      }
  
      // 鼠标移出事件
      function onMouseLeave() {
        if (props.closeMethod === CloseMethod.BLUR) {
          emit('update:visible', false);
        }
      }
  
      // 组件挂载后，初始化位置
      onMounted(() => {
        updateStyles();
      });
  
      // 组件卸载前，清除事件监听
      onUnmounted(() => {
        window.removeEventListener('resize', updateStyles);
        document.removeEventListener('mousemove', updateStyles);
      });
  
      // 激活时更新位置
      onActivated(() => {
        updateStyles();
      });
  
      // 停用时移除位置更新
      onDeactivated(() => {
        window.removeEventListener('resize', updateStyles);
        document.removeEventListener('mousemove', updateStyles);
      });
  
      // 返回关闭方法
      function close() {
        hide();
      }
  
      // 根据关闭方法类型添加事件监听
      if (props.closeMethod === CloseMethod.CLICK_OUTSIDE) {
        window.addEventListener('resize', updateStyles);
        document.addEventListener('mousemove', updateStyles);
        document.addEventListener('click', (e) => {
          if (!popover.value.contains(e.target) && !props.targetElements.some(el => el.contains(e.target))) {
            close();
          }
        });
      }
  
      return {
        visible,
        styles,
        popover,
        show,
        hide,
        close,
      };
    },
  };
  </script>
  
  <style scoped>
  /* 这里可以添加悬浮框的样式 */
  .popover {
    /* 样式 */
  }
  </style>