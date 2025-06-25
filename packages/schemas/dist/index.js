(() => {
  // packages/schemas/resources/js/components/actions.js
  var actions_default = () => ({
    isSticky: false,
    init() {
      this.evaluatePageScrollPosition();
    },
    evaluatePageScrollPosition() {
      const rect = this.$el.getBoundingClientRect();
      const isBelowViewport = rect.top > window.innerHeight;
      const isPartiallyVisible = rect.top < window.innerHeight && rect.bottom > window.innerHeight;
      this.isSticky = isBelowViewport || isPartiallyVisible;
    }
  });

  // packages/schemas/resources/js/index.js
  var resolveRelativeStatePath = function(containerPath, path, isAbsolute) {
    let containerPathCopy = containerPath;
    if (path.startsWith("/")) {
      isAbsolute = true;
      path = path.slice(1);
    }
    if (isAbsolute) {
      return path;
    }
    while (path.startsWith("../")) {
      containerPathCopy = containerPathCopy.includes(".") ? containerPathCopy.slice(0, containerPathCopy.lastIndexOf(".")) : null;
      path = path.slice(3);
    }
    if (["", null, void 0].includes(containerPathCopy)) {
      return path;
    }
    return `${containerPathCopy}.${path}`;
  };
  var findClosestLivewireComponent = (el) => {
    let closestRoot = Alpine.findClosest(el, (i) => i.__livewire);
    if (!closestRoot) {
      throw "Could not find Livewire component in DOM tree.";
    }
    return closestRoot.__livewire;
  };
  document.addEventListener("alpine:init", () => {
    window.Alpine.data("filamentSchema", ({ livewireId }) => ({
      handleFormValidationError(event) {
        if (event.detail.livewireId !== livewireId) {
          return;
        }
        this.$nextTick(() => {
          let error = this.$el.querySelector("[data-validation-error]");
          if (!error) {
            return;
          }
          let elementToExpand = error;
          while (elementToExpand) {
            elementToExpand.dispatchEvent(new CustomEvent("expand"));
            elementToExpand = elementToExpand.parentNode;
          }
          setTimeout(
            () => error.closest("[data-field-wrapper]").scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "start"
            }),
            200
          );
        });
      }
    }));
    window.Alpine.data(
      "filamentSchemaComponent",
      ({ path, containerPath, isLive, $wire }) => ({
        $statePath: path,
        $get: (path2, isAbsolute) => {
          return $wire.$get(
            resolveRelativeStatePath(containerPath, path2, isAbsolute)
          );
        },
        $set: (path2, state, isAbsolute, isUpdateLive = null) => {
          isUpdateLive ?? (isUpdateLive = isLive);
          return $wire.$set(
            resolveRelativeStatePath(containerPath, path2, isAbsolute),
            state,
            isUpdateLive
          );
        },
        get $state() {
          return $wire.$get(path);
        }
      })
    );
    window.Alpine.data("filamentActionsSchemaComponent", actions_default);
    Livewire.hook("commit", ({ component, commit, respond, succeed, fail }) => {
      succeed(({ snapshot, effects }) => {
        effects.dispatches?.forEach((dispatch) => {
          if (!dispatch.params?.awaitSchemaComponent) {
            return;
          }
          let els = Array.from(
            component.el.querySelectorAll(
              `[wire\\:partial="schema-component::${dispatch.params.awaitSchemaComponent}"]`
            )
          ).filter((el) => findClosestLivewireComponent(el) === component);
          if (els.length === 1) {
            return;
          }
          if (els.length > 1) {
            throw `Multiple schema components found with key [${dispatch.params.awaitSchemaComponent}].`;
          }
          window.addEventListener(
            `schema-component-${component.id}-${dispatch.params.awaitSchemaComponent}-loaded`,
            () => {
              window.dispatchEvent(
                new CustomEvent(dispatch.name, {
                  detail: dispatch.params
                })
              );
            },
            { once: true }
          );
        });
      });
    });
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcmVzb3VyY2VzL2pzL2NvbXBvbmVudHMvYWN0aW9ucy5qcyIsICIuLi9yZXNvdXJjZXMvanMvaW5kZXguanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBkZWZhdWx0ICgpID0+ICh7XG4gICAgaXNTdGlja3k6IGZhbHNlLFxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5ldmFsdWF0ZVBhZ2VTY3JvbGxQb3NpdGlvbigpXG4gICAgfSxcblxuICAgIGV2YWx1YXRlUGFnZVNjcm9sbFBvc2l0aW9uKCkge1xuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgICBjb25zdCBpc0JlbG93Vmlld3BvcnQgPSByZWN0LnRvcCA+IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICBjb25zdCBpc1BhcnRpYWxseVZpc2libGUgPVxuICAgICAgICAgICAgcmVjdC50b3AgPCB3aW5kb3cuaW5uZXJIZWlnaHQgJiYgcmVjdC5ib3R0b20gPiB3aW5kb3cuaW5uZXJIZWlnaHRcblxuICAgICAgICB0aGlzLmlzU3RpY2t5ID0gaXNCZWxvd1ZpZXdwb3J0IHx8IGlzUGFydGlhbGx5VmlzaWJsZVxuICAgIH0sXG59KVxuIiwgImltcG9ydCBhY3Rpb25zIGZyb20gJy4vY29tcG9uZW50cy9hY3Rpb25zLmpzJ1xuXG5jb25zdCByZXNvbHZlUmVsYXRpdmVTdGF0ZVBhdGggPSBmdW5jdGlvbiAoY29udGFpbmVyUGF0aCwgcGF0aCwgaXNBYnNvbHV0ZSkge1xuICAgIGxldCBjb250YWluZXJQYXRoQ29weSA9IGNvbnRhaW5lclBhdGhcblxuICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgICAgICBpc0Fic29sdXRlID0gdHJ1ZVxuICAgICAgICBwYXRoID0gcGF0aC5zbGljZSgxKVxuICAgIH1cblxuICAgIGlmIChpc0Fic29sdXRlKSB7XG4gICAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgd2hpbGUgKHBhdGguc3RhcnRzV2l0aCgnLi4vJykpIHtcbiAgICAgICAgY29udGFpbmVyUGF0aENvcHkgPSBjb250YWluZXJQYXRoQ29weS5pbmNsdWRlcygnLicpXG4gICAgICAgICAgICA/IGNvbnRhaW5lclBhdGhDb3B5LnNsaWNlKDAsIGNvbnRhaW5lclBhdGhDb3B5Lmxhc3RJbmRleE9mKCcuJykpXG4gICAgICAgICAgICA6IG51bGxcblxuICAgICAgICBwYXRoID0gcGF0aC5zbGljZSgzKVxuICAgIH1cblxuICAgIGlmIChbJycsIG51bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXMoY29udGFpbmVyUGF0aENvcHkpKSB7XG4gICAgICAgIHJldHVybiBwYXRoXG4gICAgfVxuXG4gICAgcmV0dXJuIGAke2NvbnRhaW5lclBhdGhDb3B5fS4ke3BhdGh9YFxufVxuXG5jb25zdCBmaW5kQ2xvc2VzdExpdmV3aXJlQ29tcG9uZW50ID0gKGVsKSA9PiB7XG4gICAgbGV0IGNsb3Nlc3RSb290ID0gQWxwaW5lLmZpbmRDbG9zZXN0KGVsLCAoaSkgPT4gaS5fX2xpdmV3aXJlKVxuXG4gICAgaWYgKCFjbG9zZXN0Um9vdCkge1xuICAgICAgICB0aHJvdyAnQ291bGQgbm90IGZpbmQgTGl2ZXdpcmUgY29tcG9uZW50IGluIERPTSB0cmVlLidcbiAgICB9XG5cbiAgICByZXR1cm4gY2xvc2VzdFJvb3QuX19saXZld2lyZVxufVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdhbHBpbmU6aW5pdCcsICgpID0+IHtcbiAgICB3aW5kb3cuQWxwaW5lLmRhdGEoJ2ZpbGFtZW50U2NoZW1hJywgKHsgbGl2ZXdpcmVJZCB9KSA9PiAoe1xuICAgICAgICBoYW5kbGVGb3JtVmFsaWRhdGlvbkVycm9yKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLmxpdmV3aXJlSWQgIT09IGxpdmV3aXJlSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBlcnJvciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXZhbGlkYXRpb24tZXJyb3JdJylcblxuICAgICAgICAgICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnRUb0V4cGFuZCA9IGVycm9yXG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoZWxlbWVudFRvRXhwYW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRUb0V4cGFuZC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnZXhwYW5kJykpXG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFRvRXhwYW5kID0gZWxlbWVudFRvRXhwYW5kLnBhcmVudE5vZGVcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IuY2xvc2VzdCgnW2RhdGEtZmllbGQtd3JhcHBlcl0nKS5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrOiAnc3RhcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlubGluZTogJ3N0YXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAyMDAsXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICB9KSlcblxuICAgIHdpbmRvdy5BbHBpbmUuZGF0YShcbiAgICAgICAgJ2ZpbGFtZW50U2NoZW1hQ29tcG9uZW50JyxcbiAgICAgICAgKHsgcGF0aCwgY29udGFpbmVyUGF0aCwgaXNMaXZlLCAkd2lyZSB9KSA9PiAoe1xuICAgICAgICAgICAgJHN0YXRlUGF0aDogcGF0aCxcbiAgICAgICAgICAgICRnZXQ6IChwYXRoLCBpc0Fic29sdXRlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICR3aXJlLiRnZXQoXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmVSZWxhdGl2ZVN0YXRlUGF0aChjb250YWluZXJQYXRoLCBwYXRoLCBpc0Fic29sdXRlKSxcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJHNldDogKHBhdGgsIHN0YXRlLCBpc0Fic29sdXRlLCBpc1VwZGF0ZUxpdmUgPSBudWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgaXNVcGRhdGVMaXZlID8/PSBpc0xpdmVcblxuICAgICAgICAgICAgICAgIHJldHVybiAkd2lyZS4kc2V0KFxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlUmVsYXRpdmVTdGF0ZVBhdGgoY29udGFpbmVyUGF0aCwgcGF0aCwgaXNBYnNvbHV0ZSksXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLFxuICAgICAgICAgICAgICAgICAgICBpc1VwZGF0ZUxpdmUsXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldCAkc3RhdGUoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICR3aXJlLiRnZXQocGF0aClcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgIClcblxuICAgIHdpbmRvdy5BbHBpbmUuZGF0YSgnZmlsYW1lbnRBY3Rpb25zU2NoZW1hQ29tcG9uZW50JywgYWN0aW9ucylcblxuICAgIExpdmV3aXJlLmhvb2soJ2NvbW1pdCcsICh7IGNvbXBvbmVudCwgY29tbWl0LCByZXNwb25kLCBzdWNjZWVkLCBmYWlsIH0pID0+IHtcbiAgICAgICAgc3VjY2VlZCgoeyBzbmFwc2hvdCwgZWZmZWN0cyB9KSA9PiB7XG4gICAgICAgICAgICBlZmZlY3RzLmRpc3BhdGNoZXM/LmZvckVhY2goKGRpc3BhdGNoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFkaXNwYXRjaC5wYXJhbXM/LmF3YWl0U2NoZW1hQ29tcG9uZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBlbHMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuZWwucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgICAgICAgICAgIGBbd2lyZVxcXFw6cGFydGlhbD1cInNjaGVtYS1jb21wb25lbnQ6OiR7ZGlzcGF0Y2gucGFyYW1zLmF3YWl0U2NoZW1hQ29tcG9uZW50fVwiXWAsXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgKS5maWx0ZXIoKGVsKSA9PiBmaW5kQ2xvc2VzdExpdmV3aXJlQ29tcG9uZW50KGVsKSA9PT0gY29tcG9uZW50KVxuXG4gICAgICAgICAgICAgICAgaWYgKGVscy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGVscy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBNdWx0aXBsZSBzY2hlbWEgY29tcG9uZW50cyBmb3VuZCB3aXRoIGtleSBbJHtkaXNwYXRjaC5wYXJhbXMuYXdhaXRTY2hlbWFDb21wb25lbnR9XS5gXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICAgIGBzY2hlbWEtY29tcG9uZW50LSR7Y29tcG9uZW50LmlkfS0ke2Rpc3BhdGNoLnBhcmFtcy5hd2FpdFNjaGVtYUNvbXBvbmVudH0tbG9hZGVkYCxcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEN1c3RvbUV2ZW50KGRpc3BhdGNoLm5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiBkaXNwYXRjaC5wYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgb25jZTogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfSlcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiOztBQUFBLE1BQU8sa0JBQVEsT0FBTztBQUFBLElBQ2xCLFVBQVU7QUFBQSxJQUVWLE9BQU87QUFDSCxXQUFLLDJCQUEyQjtBQUFBLElBQ3BDO0FBQUEsSUFFQSw2QkFBNkI7QUFDekIsWUFBTSxPQUFPLEtBQUssSUFBSSxzQkFBc0I7QUFFNUMsWUFBTSxrQkFBa0IsS0FBSyxNQUFNLE9BQU87QUFDMUMsWUFBTSxxQkFDRixLQUFLLE1BQU0sT0FBTyxlQUFlLEtBQUssU0FBUyxPQUFPO0FBRTFELFdBQUssV0FBVyxtQkFBbUI7QUFBQSxJQUN2QztBQUFBLEVBQ0o7OztBQ2RBLE1BQU0sMkJBQTJCLFNBQVUsZUFBZSxNQUFNLFlBQVk7QUFDeEUsUUFBSSxvQkFBb0I7QUFFeEIsUUFBSSxLQUFLLFdBQVcsR0FBRyxHQUFHO0FBQ3RCLG1CQUFhO0FBQ2IsYUFBTyxLQUFLLE1BQU0sQ0FBQztBQUFBLElBQ3ZCO0FBRUEsUUFBSSxZQUFZO0FBQ1osYUFBTztBQUFBLElBQ1g7QUFFQSxXQUFPLEtBQUssV0FBVyxLQUFLLEdBQUc7QUFDM0IsMEJBQW9CLGtCQUFrQixTQUFTLEdBQUcsSUFDNUMsa0JBQWtCLE1BQU0sR0FBRyxrQkFBa0IsWUFBWSxHQUFHLENBQUMsSUFDN0Q7QUFFTixhQUFPLEtBQUssTUFBTSxDQUFDO0FBQUEsSUFDdkI7QUFFQSxRQUFJLENBQUMsSUFBSSxNQUFNLE1BQVMsRUFBRSxTQUFTLGlCQUFpQixHQUFHO0FBQ25ELGFBQU87QUFBQSxJQUNYO0FBRUEsV0FBTyxHQUFHLGlCQUFpQixJQUFJLElBQUk7QUFBQSxFQUN2QztBQUVBLE1BQU0sK0JBQStCLENBQUMsT0FBTztBQUN6QyxRQUFJLGNBQWMsT0FBTyxZQUFZLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVTtBQUU1RCxRQUFJLENBQUMsYUFBYTtBQUNkLFlBQU07QUFBQSxJQUNWO0FBRUEsV0FBTyxZQUFZO0FBQUEsRUFDdkI7QUFFQSxXQUFTLGlCQUFpQixlQUFlLE1BQU07QUFDM0MsV0FBTyxPQUFPLEtBQUssa0JBQWtCLENBQUMsRUFBRSxXQUFXLE9BQU87QUFBQSxNQUN0RCwwQkFBMEIsT0FBTztBQUM3QixZQUFJLE1BQU0sT0FBTyxlQUFlLFlBQVk7QUFDeEM7QUFBQSxRQUNKO0FBRUEsYUFBSyxVQUFVLE1BQU07QUFDakIsY0FBSSxRQUFRLEtBQUssSUFBSSxjQUFjLHlCQUF5QjtBQUU1RCxjQUFJLENBQUMsT0FBTztBQUNSO0FBQUEsVUFDSjtBQUVBLGNBQUksa0JBQWtCO0FBRXRCLGlCQUFPLGlCQUFpQjtBQUNwQiw0QkFBZ0IsY0FBYyxJQUFJLFlBQVksUUFBUSxDQUFDO0FBRXZELDhCQUFrQixnQkFBZ0I7QUFBQSxVQUN0QztBQUVBO0FBQUEsWUFDSSxNQUNJLE1BQU0sUUFBUSxzQkFBc0IsRUFBRSxlQUFlO0FBQUEsY0FDakQsVUFBVTtBQUFBLGNBQ1YsT0FBTztBQUFBLGNBQ1AsUUFBUTtBQUFBLFlBQ1osQ0FBQztBQUFBLFlBQ0w7QUFBQSxVQUNKO0FBQUEsUUFDSixDQUFDO0FBQUEsTUFDTDtBQUFBLElBQ0osRUFBRTtBQUVGLFdBQU8sT0FBTztBQUFBLE1BQ1Y7QUFBQSxNQUNBLENBQUMsRUFBRSxNQUFNLGVBQWUsUUFBUSxNQUFNLE9BQU87QUFBQSxRQUN6QyxZQUFZO0FBQUEsUUFDWixNQUFNLENBQUNBLE9BQU0sZUFBZTtBQUN4QixpQkFBTyxNQUFNO0FBQUEsWUFDVCx5QkFBeUIsZUFBZUEsT0FBTSxVQUFVO0FBQUEsVUFDNUQ7QUFBQSxRQUNKO0FBQUEsUUFDQSxNQUFNLENBQUNBLE9BQU0sT0FBTyxZQUFZLGVBQWUsU0FBUztBQUNwRCwwQ0FBaUI7QUFFakIsaUJBQU8sTUFBTTtBQUFBLFlBQ1QseUJBQXlCLGVBQWVBLE9BQU0sVUFBVTtBQUFBLFlBQ3hEO0FBQUEsWUFDQTtBQUFBLFVBQ0o7QUFBQSxRQUNKO0FBQUEsUUFDQSxJQUFJLFNBQVM7QUFDVCxpQkFBTyxNQUFNLEtBQUssSUFBSTtBQUFBLFFBQzFCO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFFQSxXQUFPLE9BQU8sS0FBSyxrQ0FBa0MsZUFBTztBQUU1RCxhQUFTLEtBQUssVUFBVSxDQUFDLEVBQUUsV0FBVyxRQUFRLFNBQVMsU0FBUyxLQUFLLE1BQU07QUFDdkUsY0FBUSxDQUFDLEVBQUUsVUFBVSxRQUFRLE1BQU07QUFDL0IsZ0JBQVEsWUFBWSxRQUFRLENBQUMsYUFBYTtBQUN0QyxjQUFJLENBQUMsU0FBUyxRQUFRLHNCQUFzQjtBQUN4QztBQUFBLFVBQ0o7QUFFQSxjQUFJLE1BQU0sTUFBTTtBQUFBLFlBQ1osVUFBVSxHQUFHO0FBQUEsY0FDVCxzQ0FBc0MsU0FBUyxPQUFPLG9CQUFvQjtBQUFBLFlBQzlFO0FBQUEsVUFDSixFQUFFLE9BQU8sQ0FBQyxPQUFPLDZCQUE2QixFQUFFLE1BQU0sU0FBUztBQUUvRCxjQUFJLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQUEsVUFDSjtBQUVBLGNBQUksSUFBSSxTQUFTLEdBQUc7QUFDaEIsa0JBQU0sOENBQThDLFNBQVMsT0FBTyxvQkFBb0I7QUFBQSxVQUM1RjtBQUVBLGlCQUFPO0FBQUEsWUFDSCxvQkFBb0IsVUFBVSxFQUFFLElBQUksU0FBUyxPQUFPLG9CQUFvQjtBQUFBLFlBQ3hFLE1BQU07QUFDRixxQkFBTztBQUFBLGdCQUNILElBQUksWUFBWSxTQUFTLE1BQU07QUFBQSxrQkFDM0IsUUFBUSxTQUFTO0FBQUEsZ0JBQ3JCLENBQUM7QUFBQSxjQUNMO0FBQUEsWUFDSjtBQUFBLFlBQ0EsRUFBRSxNQUFNLEtBQUs7QUFBQSxVQUNqQjtBQUFBLFFBQ0osQ0FBQztBQUFBLE1BQ0wsQ0FBQztBQUFBLElBQ0wsQ0FBQztBQUFBLEVBQ0wsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
