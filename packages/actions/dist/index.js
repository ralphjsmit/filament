(() => {
  // packages/actions/resources/js/components/modals.js
  var modals_default = ({ livewireId }) => ({
    actionNestingIndex: null,
    init() {
      window.addEventListener("sync-action-modals", (event) => {
        if (event.detail.id !== livewireId) {
          return;
        }
        this.syncActionModals(event.detail.newActionNestingIndex);
      });
    },
    syncActionModals(newActionNestingIndex) {
      if (this.actionNestingIndex === newActionNestingIndex) {
        this.actionNestingIndex !== null && this.$nextTick(() => this.openModal());
        return;
      }
      if (this.actionNestingIndex !== null) {
        this.closeModal();
      }
      this.actionNestingIndex = newActionNestingIndex;
      if (this.actionNestingIndex === null) {
        return;
      }
      if (!this.$el.querySelector(
        `#${this.generateModalId(newActionNestingIndex)}`
      )) {
        this.$nextTick(() => this.openModal());
        return;
      }
      this.openModal();
    },
    generateModalId(actionNestingIndex) {
      return `fi-${livewireId}-action-` + actionNestingIndex;
    },
    openModal() {
      const id = this.generateModalId(this.actionNestingIndex);
      this.$dispatch("open-modal", { id });
    },
    closeModal() {
      const id = this.generateModalId(this.actionNestingIndex);
      this.$dispatch("close-modal-quietly", { id });
    }
  });

  // packages/actions/resources/js/index.js
  document.addEventListener("alpine:init", () => {
    window.Alpine.data("filamentActionModals", modals_default);
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcmVzb3VyY2VzL2pzL2NvbXBvbmVudHMvbW9kYWxzLmpzIiwgIi4uL3Jlc291cmNlcy9qcy9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGRlZmF1bHQgKHsgbGl2ZXdpcmVJZCB9KSA9PiAoe1xuICAgIGFjdGlvbk5lc3RpbmdJbmRleDogbnVsbCxcblxuICAgIGluaXQoKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzeW5jLWFjdGlvbi1tb2RhbHMnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChldmVudC5kZXRhaWwuaWQgIT09IGxpdmV3aXJlSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zeW5jQWN0aW9uTW9kYWxzKGV2ZW50LmRldGFpbC5uZXdBY3Rpb25OZXN0aW5nSW5kZXgpXG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIHN5bmNBY3Rpb25Nb2RhbHMobmV3QWN0aW9uTmVzdGluZ0luZGV4KSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGlvbk5lc3RpbmdJbmRleCA9PT0gbmV3QWN0aW9uTmVzdGluZ0luZGV4KSB7XG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmlsYW1lbnRwaHAvZmlsYW1lbnQvaXNzdWVzLzE2NDc0XG4gICAgICAgICAgICB0aGlzLmFjdGlvbk5lc3RpbmdJbmRleCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHRoaXMub3Blbk1vZGFsKCkpXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYWN0aW9uTmVzdGluZ0luZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlTW9kYWwoKVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY3Rpb25OZXN0aW5nSW5kZXggPSBuZXdBY3Rpb25OZXN0aW5nSW5kZXhcblxuICAgICAgICBpZiAodGhpcy5hY3Rpb25OZXN0aW5nSW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgICAgYCMke3RoaXMuZ2VuZXJhdGVNb2RhbElkKG5ld0FjdGlvbk5lc3RpbmdJbmRleCl9YCxcbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB0aGlzLm9wZW5Nb2RhbCgpKVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3Blbk1vZGFsKClcbiAgICB9LFxuXG4gICAgZ2VuZXJhdGVNb2RhbElkKGFjdGlvbk5lc3RpbmdJbmRleCkge1xuICAgICAgICAvLyBIVE1MIElEcyBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIsIHNvIGlmIHRoZSBMaXZld2lyZSBjb21wb25lbnQgSUQgc3RhcnRzXG4gICAgICAgIC8vIHdpdGggYSBudW1iZXIsIHdlIG5lZWQgdG8gbWFrZSBzdXJlIGl0IGRvZXMgbm90IGZhaWwgYnkgcHJlcGVuZGluZyBgZmktYC5cbiAgICAgICAgcmV0dXJuIGBmaS0ke2xpdmV3aXJlSWR9LWFjdGlvbi1gICsgYWN0aW9uTmVzdGluZ0luZGV4XG4gICAgfSxcblxuICAgIG9wZW5Nb2RhbCgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmdlbmVyYXRlTW9kYWxJZCh0aGlzLmFjdGlvbk5lc3RpbmdJbmRleClcblxuICAgICAgICB0aGlzLiRkaXNwYXRjaCgnb3Blbi1tb2RhbCcsIHsgaWQgfSlcbiAgICB9LFxuXG4gICAgY2xvc2VNb2RhbCgpIHtcbiAgICAgICAgY29uc3QgaWQgPSB0aGlzLmdlbmVyYXRlTW9kYWxJZCh0aGlzLmFjdGlvbk5lc3RpbmdJbmRleClcblxuICAgICAgICB0aGlzLiRkaXNwYXRjaCgnY2xvc2UtbW9kYWwtcXVpZXRseScsIHsgaWQgfSlcbiAgICB9LFxufSlcbiIsICJpbXBvcnQgbW9kYWxzIGZyb20gJy4vY29tcG9uZW50cy9tb2RhbHMuanMnXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2FscGluZTppbml0JywgKCkgPT4ge1xuICAgIHdpbmRvdy5BbHBpbmUuZGF0YSgnZmlsYW1lbnRBY3Rpb25Nb2RhbHMnLCBtb2RhbHMpXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFBQSxNQUFPLGlCQUFRLENBQUMsRUFBRSxXQUFXLE9BQU87QUFBQSxJQUNoQyxvQkFBb0I7QUFBQSxJQUVwQixPQUFPO0FBQ0gsYUFBTyxpQkFBaUIsc0JBQXNCLENBQUMsVUFBVTtBQUNyRCxZQUFJLE1BQU0sT0FBTyxPQUFPLFlBQVk7QUFDaEM7QUFBQSxRQUNKO0FBRUEsYUFBSyxpQkFBaUIsTUFBTSxPQUFPLHFCQUFxQjtBQUFBLE1BQzVELENBQUM7QUFBQSxJQUNMO0FBQUEsSUFFQSxpQkFBaUIsdUJBQXVCO0FBQ3BDLFVBQUksS0FBSyx1QkFBdUIsdUJBQXVCO0FBRW5ELGFBQUssdUJBQXVCLFFBQ3hCLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxDQUFDO0FBRXpDO0FBQUEsTUFDSjtBQUVBLFVBQUksS0FBSyx1QkFBdUIsTUFBTTtBQUNsQyxhQUFLLFdBQVc7QUFBQSxNQUNwQjtBQUVBLFdBQUsscUJBQXFCO0FBRTFCLFVBQUksS0FBSyx1QkFBdUIsTUFBTTtBQUNsQztBQUFBLE1BQ0o7QUFFQSxVQUNJLENBQUMsS0FBSyxJQUFJO0FBQUEsUUFDTixJQUFJLEtBQUssZ0JBQWdCLHFCQUFxQixDQUFDO0FBQUEsTUFDbkQsR0FDRjtBQUNFLGFBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxDQUFDO0FBRXJDO0FBQUEsTUFDSjtBQUVBLFdBQUssVUFBVTtBQUFBLElBQ25CO0FBQUEsSUFFQSxnQkFBZ0Isb0JBQW9CO0FBR2hDLGFBQU8sTUFBTSxVQUFVLGFBQWE7QUFBQSxJQUN4QztBQUFBLElBRUEsWUFBWTtBQUNSLFlBQU0sS0FBSyxLQUFLLGdCQUFnQixLQUFLLGtCQUFrQjtBQUV2RCxXQUFLLFVBQVUsY0FBYyxFQUFFLEdBQUcsQ0FBQztBQUFBLElBQ3ZDO0FBQUEsSUFFQSxhQUFhO0FBQ1QsWUFBTSxLQUFLLEtBQUssZ0JBQWdCLEtBQUssa0JBQWtCO0FBRXZELFdBQUssVUFBVSx1QkFBdUIsRUFBRSxHQUFHLENBQUM7QUFBQSxJQUNoRDtBQUFBLEVBQ0o7OztBQzVEQSxXQUFTLGlCQUFpQixlQUFlLE1BQU07QUFDM0MsV0FBTyxPQUFPLEtBQUssd0JBQXdCLGNBQU07QUFBQSxFQUNyRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
