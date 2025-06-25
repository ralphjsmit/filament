// packages/forms/resources/js/components/checkbox-list.js
function checkboxListFormComponent({ livewireId }) {
  return {
    areAllCheckboxesChecked: false,
    checkboxListOptions: [],
    search: "",
    visibleCheckboxListOptions: [],
    init() {
      this.checkboxListOptions = Array.from(
        this.$root.querySelectorAll(".fi-fo-checkbox-list-option")
      );
      this.updateVisibleCheckboxListOptions();
      this.$nextTick(() => {
        this.checkIfAllCheckboxesAreChecked();
      });
      Livewire.hook(
        "commit",
        ({ component, commit, succeed, fail, respond }) => {
          succeed(({ snapshot, effect }) => {
            this.$nextTick(() => {
              if (component.id !== livewireId) {
                return;
              }
              this.checkboxListOptions = Array.from(
                this.$root.querySelectorAll(
                  ".fi-fo-checkbox-list-option"
                )
              );
              this.updateVisibleCheckboxListOptions();
              this.checkIfAllCheckboxesAreChecked();
            });
          });
        }
      );
      this.$watch("search", () => {
        this.updateVisibleCheckboxListOptions();
        this.checkIfAllCheckboxesAreChecked();
      });
    },
    checkIfAllCheckboxesAreChecked() {
      this.areAllCheckboxesChecked = this.visibleCheckboxListOptions.length === this.visibleCheckboxListOptions.filter(
        (checkboxLabel) => checkboxLabel.querySelector("input[type=checkbox]:checked")
      ).length;
    },
    toggleAllCheckboxes() {
      this.checkIfAllCheckboxesAreChecked();
      const inverseAreAllCheckboxesChecked = !this.areAllCheckboxesChecked;
      this.visibleCheckboxListOptions.forEach((checkboxLabel) => {
        const checkbox = checkboxLabel.querySelector(
          "input[type=checkbox]"
        );
        if (checkbox.disabled) {
          return;
        }
        checkbox.checked = inverseAreAllCheckboxesChecked;
        checkbox.dispatchEvent(new Event("change"));
      });
      this.areAllCheckboxesChecked = inverseAreAllCheckboxesChecked;
    },
    updateVisibleCheckboxListOptions() {
      this.visibleCheckboxListOptions = this.checkboxListOptions.filter(
        (checkboxListItem) => {
          if (["", null, void 0].includes(this.search)) {
            return true;
          }
          if (checkboxListItem.querySelector(".fi-fo-checkbox-list-option-label")?.innerText.toLowerCase().includes(this.search.toLowerCase())) {
            return true;
          }
          return checkboxListItem.querySelector(
            ".fi-fo-checkbox-list-option-description"
          )?.innerText.toLowerCase().includes(this.search.toLowerCase());
        }
      );
    }
  };
}
export {
  checkboxListFormComponent as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vcmVzb3VyY2VzL2pzL2NvbXBvbmVudHMvY2hlY2tib3gtbGlzdC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2hlY2tib3hMaXN0Rm9ybUNvbXBvbmVudCh7IGxpdmV3aXJlSWQgfSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFyZUFsbENoZWNrYm94ZXNDaGVja2VkOiBmYWxzZSxcblxuICAgICAgICBjaGVja2JveExpc3RPcHRpb25zOiBbXSxcblxuICAgICAgICBzZWFyY2g6ICcnLFxuXG4gICAgICAgIHZpc2libGVDaGVja2JveExpc3RPcHRpb25zOiBbXSxcblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja2JveExpc3RPcHRpb25zID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICB0aGlzLiRyb290LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maS1mby1jaGVja2JveC1saXN0LW9wdGlvbicpLFxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVDaGVja2JveExpc3RPcHRpb25zKClcblxuICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tJZkFsbENoZWNrYm94ZXNBcmVDaGVja2VkKClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIExpdmV3aXJlLmhvb2soXG4gICAgICAgICAgICAgICAgJ2NvbW1pdCcsXG4gICAgICAgICAgICAgICAgKHsgY29tcG9uZW50LCBjb21taXQsIHN1Y2NlZWQsIGZhaWwsIHJlc3BvbmQgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZWVkKCh7IHNuYXBzaG90LCBlZmZlY3QgfSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuaWQgIT09IGxpdmV3aXJlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja2JveExpc3RPcHRpb25zID0gQXJyYXkuZnJvbShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kcm9vdC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJy5maS1mby1jaGVja2JveC1saXN0LW9wdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlQ2hlY2tib3hMaXN0T3B0aW9ucygpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrSWZBbGxDaGVja2JveGVzQXJlQ2hlY2tlZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIHRoaXMuJHdhdGNoKCdzZWFyY2gnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlQ2hlY2tib3hMaXN0T3B0aW9ucygpXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0lmQWxsQ2hlY2tib3hlc0FyZUNoZWNrZWQoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICBjaGVja0lmQWxsQ2hlY2tib3hlc0FyZUNoZWNrZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmFyZUFsbENoZWNrYm94ZXNDaGVja2VkID1cbiAgICAgICAgICAgICAgICB0aGlzLnZpc2libGVDaGVja2JveExpc3RPcHRpb25zLmxlbmd0aCA9PT1cbiAgICAgICAgICAgICAgICB0aGlzLnZpc2libGVDaGVja2JveExpc3RPcHRpb25zLmZpbHRlcigoY2hlY2tib3hMYWJlbCkgPT5cbiAgICAgICAgICAgICAgICAgICAgY2hlY2tib3hMYWJlbC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPWNoZWNrYm94XTpjaGVja2VkJyksXG4gICAgICAgICAgICAgICAgKS5sZW5ndGhcbiAgICAgICAgfSxcblxuICAgICAgICB0b2dnbGVBbGxDaGVja2JveGVzKCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0lmQWxsQ2hlY2tib3hlc0FyZUNoZWNrZWQoKVxuXG4gICAgICAgICAgICBjb25zdCBpbnZlcnNlQXJlQWxsQ2hlY2tib3hlc0NoZWNrZWQgPSAhdGhpcy5hcmVBbGxDaGVja2JveGVzQ2hlY2tlZFxuXG4gICAgICAgICAgICB0aGlzLnZpc2libGVDaGVja2JveExpc3RPcHRpb25zLmZvckVhY2goKGNoZWNrYm94TGFiZWwpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGVja2JveCA9IGNoZWNrYm94TGFiZWwucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgICAgICAgJ2lucHV0W3R5cGU9Y2hlY2tib3hdJyxcbiAgICAgICAgICAgICAgICApXG5cbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tib3guZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IGludmVyc2VBcmVBbGxDaGVja2JveGVzQ2hlY2tlZFxuICAgICAgICAgICAgICAgIGNoZWNrYm94LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2UnKSlcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHRoaXMuYXJlQWxsQ2hlY2tib3hlc0NoZWNrZWQgPSBpbnZlcnNlQXJlQWxsQ2hlY2tib3hlc0NoZWNrZWRcbiAgICAgICAgfSxcblxuICAgICAgICB1cGRhdGVWaXNpYmxlQ2hlY2tib3hMaXN0T3B0aW9ucygpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZUNoZWNrYm94TGlzdE9wdGlvbnMgPSB0aGlzLmNoZWNrYm94TGlzdE9wdGlvbnMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChjaGVja2JveExpc3RJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChbJycsIG51bGwsIHVuZGVmaW5lZF0uaW5jbHVkZXModGhpcy5zZWFyY2gpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tib3hMaXN0SXRlbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKCcuZmktZm8tY2hlY2tib3gtbGlzdC1vcHRpb24tbGFiZWwnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8uaW5uZXJUZXh0LnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaW5jbHVkZXModGhpcy5zZWFyY2gudG9Mb3dlckNhc2UoKSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoZWNrYm94TGlzdEl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICcuZmktZm8tY2hlY2tib3gtbGlzdC1vcHRpb24tZGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgPy5pbm5lclRleHQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmluY2x1ZGVzKHRoaXMuc2VhcmNoLnRvTG93ZXJDYXNlKCkpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIClcbiAgICAgICAgfSxcbiAgICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWUsU0FBUiwwQkFBMkMsRUFBRSxXQUFXLEdBQUc7QUFDOUQsU0FBTztBQUFBLElBQ0gseUJBQXlCO0FBQUEsSUFFekIscUJBQXFCLENBQUM7QUFBQSxJQUV0QixRQUFRO0FBQUEsSUFFUiw0QkFBNEIsQ0FBQztBQUFBLElBRTdCLE9BQU87QUFDSCxXQUFLLHNCQUFzQixNQUFNO0FBQUEsUUFDN0IsS0FBSyxNQUFNLGlCQUFpQiw2QkFBNkI7QUFBQSxNQUM3RDtBQUVBLFdBQUssaUNBQWlDO0FBRXRDLFdBQUssVUFBVSxNQUFNO0FBQ2pCLGFBQUssK0JBQStCO0FBQUEsTUFDeEMsQ0FBQztBQUVELGVBQVM7QUFBQSxRQUNMO0FBQUEsUUFDQSxDQUFDLEVBQUUsV0FBVyxRQUFRLFNBQVMsTUFBTSxRQUFRLE1BQU07QUFDL0Msa0JBQVEsQ0FBQyxFQUFFLFVBQVUsT0FBTyxNQUFNO0FBQzlCLGlCQUFLLFVBQVUsTUFBTTtBQUNqQixrQkFBSSxVQUFVLE9BQU8sWUFBWTtBQUM3QjtBQUFBLGNBQ0o7QUFFQSxtQkFBSyxzQkFBc0IsTUFBTTtBQUFBLGdCQUM3QixLQUFLLE1BQU07QUFBQSxrQkFDUDtBQUFBLGdCQUNKO0FBQUEsY0FDSjtBQUVBLG1CQUFLLGlDQUFpQztBQUV0QyxtQkFBSywrQkFBK0I7QUFBQSxZQUN4QyxDQUFDO0FBQUEsVUFDTCxDQUFDO0FBQUEsUUFDTDtBQUFBLE1BQ0o7QUFFQSxXQUFLLE9BQU8sVUFBVSxNQUFNO0FBQ3hCLGFBQUssaUNBQWlDO0FBQ3RDLGFBQUssK0JBQStCO0FBQUEsTUFDeEMsQ0FBQztBQUFBLElBQ0w7QUFBQSxJQUVBLGlDQUFpQztBQUM3QixXQUFLLDBCQUNELEtBQUssMkJBQTJCLFdBQ2hDLEtBQUssMkJBQTJCO0FBQUEsUUFBTyxDQUFDLGtCQUNwQyxjQUFjLGNBQWMsOEJBQThCO0FBQUEsTUFDOUQsRUFBRTtBQUFBLElBQ1Y7QUFBQSxJQUVBLHNCQUFzQjtBQUNsQixXQUFLLCtCQUErQjtBQUVwQyxZQUFNLGlDQUFpQyxDQUFDLEtBQUs7QUFFN0MsV0FBSywyQkFBMkIsUUFBUSxDQUFDLGtCQUFrQjtBQUN2RCxjQUFNLFdBQVcsY0FBYztBQUFBLFVBQzNCO0FBQUEsUUFDSjtBQUVBLFlBQUksU0FBUyxVQUFVO0FBQ25CO0FBQUEsUUFDSjtBQUVBLGlCQUFTLFVBQVU7QUFDbkIsaUJBQVMsY0FBYyxJQUFJLE1BQU0sUUFBUSxDQUFDO0FBQUEsTUFDOUMsQ0FBQztBQUVELFdBQUssMEJBQTBCO0FBQUEsSUFDbkM7QUFBQSxJQUVBLG1DQUFtQztBQUMvQixXQUFLLDZCQUE2QixLQUFLLG9CQUFvQjtBQUFBLFFBQ3ZELENBQUMscUJBQXFCO0FBQ2xCLGNBQUksQ0FBQyxJQUFJLE1BQU0sTUFBUyxFQUFFLFNBQVMsS0FBSyxNQUFNLEdBQUc7QUFDN0MsbUJBQU87QUFBQSxVQUNYO0FBRUEsY0FDSSxpQkFDSyxjQUFjLG1DQUFtQyxHQUNoRCxVQUFVLFlBQVksRUFDdkIsU0FBUyxLQUFLLE9BQU8sWUFBWSxDQUFDLEdBQ3pDO0FBQ0UsbUJBQU87QUFBQSxVQUNYO0FBRUEsaUJBQU8saUJBQ0Y7QUFBQSxZQUNHO0FBQUEsVUFDSixHQUNFLFVBQVUsWUFBWSxFQUN2QixTQUFTLEtBQUssT0FBTyxZQUFZLENBQUM7QUFBQSxRQUMzQztBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUNKOyIsCiAgIm5hbWVzIjogW10KfQo=
