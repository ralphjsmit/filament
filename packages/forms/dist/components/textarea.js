// packages/forms/resources/js/components/textarea.js
function textareaFormComponent({
  initialHeight,
  shouldAutosize,
  state
}) {
  return {
    state,
    wrapperEl: null,
    init() {
      this.wrapperEl = this.$el.parentNode;
      this.setInitialHeight();
      if (shouldAutosize) {
        this.$watch("state", () => {
          this.resize();
        });
      } else {
        this.setUpResizeObserver();
      }
    },
    setInitialHeight() {
      if (this.$el.scrollHeight <= 0) {
        return;
      }
      this.wrapperEl.style.height = initialHeight + "rem";
    },
    resize() {
      this.setInitialHeight();
      if (this.$el.scrollHeight <= 0) {
        return;
      }
      const newHeight = this.$el.scrollHeight + "px";
      if (this.wrapperEl.style.height === newHeight) {
        return;
      }
      this.wrapperEl.style.height = newHeight;
    },
    setUpResizeObserver() {
      const observer = new ResizeObserver(() => {
        this.wrapperEl.style.height = this.$el.style.height;
      });
      observer.observe(this.$el);
    }
  };
}
export {
  textareaFormComponent as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vcmVzb3VyY2VzL2pzL2NvbXBvbmVudHMvdGV4dGFyZWEuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRleHRhcmVhRm9ybUNvbXBvbmVudCh7XG4gICAgaW5pdGlhbEhlaWdodCxcbiAgICBzaG91bGRBdXRvc2l6ZSxcbiAgICBzdGF0ZSxcbn0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBzdGF0ZSxcblxuICAgICAgICB3cmFwcGVyRWw6IG51bGwsXG5cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIHRoaXMud3JhcHBlckVsID0gdGhpcy4kZWwucGFyZW50Tm9kZVxuXG4gICAgICAgICAgICB0aGlzLnNldEluaXRpYWxIZWlnaHQoKVxuXG4gICAgICAgICAgICBpZiAoc2hvdWxkQXV0b3NpemUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiR3YXRjaCgnc3RhdGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVzaXplKClcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFVwUmVzaXplT2JzZXJ2ZXIoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHNldEluaXRpYWxIZWlnaHQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy4kZWwuc2Nyb2xsSGVpZ2h0IDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy53cmFwcGVyRWwuc3R5bGUuaGVpZ2h0ID0gaW5pdGlhbEhlaWdodCArICdyZW0nXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVzaXplKCkge1xuICAgICAgICAgICAgdGhpcy5zZXRJbml0aWFsSGVpZ2h0KClcblxuICAgICAgICAgICAgaWYgKHRoaXMuJGVsLnNjcm9sbEhlaWdodCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld0hlaWdodCA9IHRoaXMuJGVsLnNjcm9sbEhlaWdodCArICdweCdcblxuICAgICAgICAgICAgaWYgKHRoaXMud3JhcHBlckVsLnN0eWxlLmhlaWdodCA9PT0gbmV3SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMud3JhcHBlckVsLnN0eWxlLmhlaWdodCA9IG5ld0hlaWdodFxuICAgICAgICB9LFxuXG4gICAgICAgIHNldFVwUmVzaXplT2JzZXJ2ZXIoKSB7XG4gICAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy53cmFwcGVyRWwuc3R5bGUuaGVpZ2h0ID0gdGhpcy4kZWwuc3R5bGUuaGVpZ2h0XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRoaXMuJGVsKVxuICAgICAgICB9LFxuICAgIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZSxTQUFSLHNCQUF1QztBQUFBLEVBQzFDO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDSixHQUFHO0FBQ0MsU0FBTztBQUFBLElBQ0g7QUFBQSxJQUVBLFdBQVc7QUFBQSxJQUVYLE9BQU87QUFDSCxXQUFLLFlBQVksS0FBSyxJQUFJO0FBRTFCLFdBQUssaUJBQWlCO0FBRXRCLFVBQUksZ0JBQWdCO0FBQ2hCLGFBQUssT0FBTyxTQUFTLE1BQU07QUFDdkIsZUFBSyxPQUFPO0FBQUEsUUFDaEIsQ0FBQztBQUFBLE1BQ0wsT0FBTztBQUNILGFBQUssb0JBQW9CO0FBQUEsTUFDN0I7QUFBQSxJQUNKO0FBQUEsSUFFQSxtQkFBbUI7QUFDZixVQUFJLEtBQUssSUFBSSxnQkFBZ0IsR0FBRztBQUM1QjtBQUFBLE1BQ0o7QUFFQSxXQUFLLFVBQVUsTUFBTSxTQUFTLGdCQUFnQjtBQUFBLElBQ2xEO0FBQUEsSUFFQSxTQUFTO0FBQ0wsV0FBSyxpQkFBaUI7QUFFdEIsVUFBSSxLQUFLLElBQUksZ0JBQWdCLEdBQUc7QUFDNUI7QUFBQSxNQUNKO0FBRUEsWUFBTSxZQUFZLEtBQUssSUFBSSxlQUFlO0FBRTFDLFVBQUksS0FBSyxVQUFVLE1BQU0sV0FBVyxXQUFXO0FBQzNDO0FBQUEsTUFDSjtBQUVBLFdBQUssVUFBVSxNQUFNLFNBQVM7QUFBQSxJQUNsQztBQUFBLElBRUEsc0JBQXNCO0FBQ2xCLFlBQU0sV0FBVyxJQUFJLGVBQWUsTUFBTTtBQUN0QyxhQUFLLFVBQVUsTUFBTSxTQUFTLEtBQUssSUFBSSxNQUFNO0FBQUEsTUFDakQsQ0FBQztBQUVELGVBQVMsUUFBUSxLQUFLLEdBQUc7QUFBQSxJQUM3QjtBQUFBLEVBQ0o7QUFDSjsiLAogICJuYW1lcyI6IFtdCn0K
