(() => {
  // packages/tables/resources/js/components/table.js
  var table_default = ({
    canSelectMultipleRecords,
    canTrackDeselectedRecords,
    currentSelectionLivewireProperty,
    $wire
  }) => ({
    checkboxClickController: null,
    collapsedGroups: [],
    isLoading: false,
    selectedRecords: /* @__PURE__ */ new Set(),
    deselectedRecords: /* @__PURE__ */ new Set(),
    isTrackingDeselectedRecords: false,
    shouldCheckUniqueSelection: true,
    lastCheckedRecord: null,
    livewireId: null,
    entangledSelectedRecords: currentSelectionLivewireProperty ? $wire.$entangle(currentSelectionLivewireProperty) : null,
    init() {
      this.livewireId = this.$root.closest("[wire\\:id]").attributes["wire:id"].value;
      $wire.$on("deselectAllTableRecords", () => this.deselectAllRecords());
      if (currentSelectionLivewireProperty) {
        if (canSelectMultipleRecords) {
          this.selectedRecords = new Set(this.entangledSelectedRecords);
        } else {
          this.selectedRecords = new Set(
            this.entangledSelectedRecords ? [this.entangledSelectedRecords] : []
          );
        }
      }
      this.$nextTick(() => this.watchForCheckboxClicks());
      Livewire.hook("element.init", ({ component }) => {
        if (component.id === this.livewireId) {
          this.watchForCheckboxClicks();
        }
      });
    },
    mountAction(...args) {
      $wire.set(
        "isTrackingDeselectedTableRecords",
        this.isTrackingDeselectedRecords,
        false
      );
      $wire.set("selectedTableRecords", [...this.selectedRecords], false);
      $wire.set("deselectedTableRecords", [...this.deselectedRecords], false);
      $wire.mountAction(...args);
    },
    toggleSelectRecordsOnPage() {
      const keys = this.getRecordsOnPage();
      if (this.areRecordsSelected(keys)) {
        this.deselectRecords(keys);
        return;
      }
      this.selectRecords(keys);
    },
    async toggleSelectRecordsInGroup(group) {
      this.isLoading = true;
      if (this.areRecordsSelected(this.getRecordsInGroupOnPage(group))) {
        this.deselectRecords(
          await $wire.getGroupedSelectableTableRecordKeys(group)
        );
      } else {
        this.selectRecords(
          await $wire.getGroupedSelectableTableRecordKeys(group)
        );
      }
      this.isLoading = false;
    },
    getRecordsInGroupOnPage(group) {
      const keys = [];
      for (let checkbox of this.$root?.getElementsByClassName(
        "fi-ta-record-checkbox"
      ) ?? []) {
        if (checkbox.dataset.group !== group) {
          continue;
        }
        keys.push(checkbox.value);
      }
      return keys;
    },
    getSelectedRecordsCount() {
      if (this.isTrackingDeselectedRecords) {
        return (this.$refs.allSelectableRecordsCount?.value ?? this.deselectedRecords.size) - this.deselectedRecords.size;
      }
      return this.selectedRecords.size;
    },
    getRecordsOnPage() {
      const keys = [];
      for (let checkbox of this.$root?.getElementsByClassName(
        "fi-ta-record-checkbox"
      ) ?? []) {
        keys.push(checkbox.value);
      }
      return keys;
    },
    selectRecords(keys) {
      if (!canSelectMultipleRecords) {
        this.deselectAllRecords();
        keys = keys.slice(0, 1);
      }
      for (let key of keys) {
        if (this.isRecordSelected(key)) {
          continue;
        }
        if (this.isTrackingDeselectedRecords) {
          this.deselectedRecords.delete(key);
          continue;
        }
        this.selectedRecords.add(key);
      }
      this.updatedSelectedRecords();
    },
    deselectRecords(keys) {
      for (let key of keys) {
        if (this.isTrackingDeselectedRecords) {
          this.deselectedRecords.add(key);
          continue;
        }
        this.selectedRecords.delete(key);
      }
      this.updatedSelectedRecords();
    },
    updatedSelectedRecords() {
      if (canSelectMultipleRecords) {
        this.entangledSelectedRecords = [...this.selectedRecords];
        return;
      }
      this.entangledSelectedRecords = [...this.selectedRecords][0] ?? null;
    },
    toggleSelectedRecord(key) {
      if (this.isRecordSelected(key)) {
        this.deselectRecords([key]);
        return;
      }
      this.selectRecords([key]);
    },
    async selectAllRecords() {
      if (!canTrackDeselectedRecords) {
        this.isLoading = true;
        this.selectedRecords = new Set(
          await $wire.getAllSelectableTableRecordKeys()
        );
        this.updatedSelectedRecords();
        this.isLoading = false;
        return;
      }
      this.isTrackingDeselectedRecords = true;
      this.selectedRecords = /* @__PURE__ */ new Set();
      this.deselectedRecords = /* @__PURE__ */ new Set();
      this.updatedSelectedRecords();
    },
    deselectAllRecords() {
      this.isTrackingDeselectedRecords = false;
      this.selectedRecords = /* @__PURE__ */ new Set();
      this.deselectedRecords = /* @__PURE__ */ new Set();
      this.updatedSelectedRecords();
    },
    isRecordSelected(key) {
      if (this.isTrackingDeselectedRecords) {
        return !this.deselectedRecords.has(key);
      }
      return this.selectedRecords.has(key);
    },
    areRecordsSelected(keys) {
      return keys.every((key) => this.isRecordSelected(key));
    },
    toggleCollapseGroup(group) {
      if (this.isGroupCollapsed(group)) {
        this.collapsedGroups.splice(this.collapsedGroups.indexOf(group), 1);
        return;
      }
      this.collapsedGroups.push(group);
    },
    isGroupCollapsed(group) {
      return this.collapsedGroups.includes(group);
    },
    resetCollapsedGroups() {
      this.collapsedGroups = [];
    },
    watchForCheckboxClicks() {
      if (this.checkboxClickController) {
        this.checkboxClickController.abort();
      }
      this.checkboxClickController = new AbortController();
      const { signal } = this.checkboxClickController;
      this.$root?.addEventListener(
        "click",
        (event) => event.target?.matches(".fi-ta-record-checkbox") && this.handleCheckboxClick(event, event.target),
        { signal }
      );
    },
    handleCheckboxClick(event, checkbox) {
      if (!this.lastChecked) {
        this.lastChecked = checkbox;
        return;
      }
      if (event.shiftKey) {
        let checkboxes = Array.from(
          this.$root?.getElementsByClassName("fi-ta-record-checkbox") ?? []
        );
        if (!checkboxes.includes(this.lastChecked)) {
          this.lastChecked = checkbox;
          return;
        }
        let start = checkboxes.indexOf(this.lastChecked);
        let end = checkboxes.indexOf(checkbox);
        let range = [start, end].sort((a, b) => a - b);
        let values = [];
        for (let i = range[0]; i <= range[1]; i++) {
          checkboxes[i].checked = checkbox.checked;
          values.push(checkboxes[i].value);
        }
        if (checkbox.checked) {
          this.selectRecords(values);
        } else {
          this.deselectRecords(values);
        }
      }
      this.lastChecked = checkbox;
    }
  });

  // packages/tables/resources/js/components/column-manager.js
  function filamentTableColumnManager({ columns, isLive }) {
    return {
      error: void 0,
      isLoading: false,
      columns,
      isLive,
      init() {
        if (!this.columns || this.columns.length === 0) {
          this.columns = [];
          return;
        }
      },
      get groupedColumns() {
        const groupedColumns = {};
        this.columns.filter((column) => column.type === "group").forEach((column) => {
          groupedColumns[column.name] = this.calculateGroupedColumns(column);
        });
        return groupedColumns;
      },
      calculateGroupedColumns(group) {
        if (!group?.columns) {
          return { checked: false, disabled: true, indeterminate: false };
        }
        const toggleableChildren = group.columns.filter(
          (column) => column.isToggleable !== false
        );
        if (toggleableChildren.length === 0) {
          return { checked: true, disabled: true, indeterminate: false };
        }
        const toggledChildren = toggleableChildren.filter(
          (column) => column.isToggled
        ).length;
        const nonToggleableChildren = group.columns.filter(
          (column) => column.isToggleable === false
        );
        if (toggledChildren === 0 && nonToggleableChildren.length > 0) {
          return { checked: true, disabled: false, indeterminate: true };
        }
        if (toggledChildren === 0) {
          return { checked: false, disabled: false, indeterminate: false };
        }
        if (toggledChildren === toggleableChildren.length) {
          return { checked: true, disabled: false, indeterminate: false };
        }
        return { checked: true, disabled: false, indeterminate: true };
      },
      getColumn(name, groupName = null) {
        if (groupName) {
          const group = this.columns.find(
            (group2) => group2.type === "group" && group2.name === groupName
          );
          return group?.columns?.find((column) => column.name === name);
        }
        return this.columns.find((column) => column.name === name);
      },
      toggleGroup(groupName) {
        const group = this.columns.find(
          (group2) => group2.type === "group" && group2.name === groupName
        );
        if (!group?.columns) {
          return;
        }
        const groupedColumns = this.calculateGroupedColumns(group);
        if (groupedColumns.disabled) {
          return;
        }
        const toggleableChildren = group.columns.filter(
          (column) => column.isToggleable !== false
        );
        const anyChildOn = toggleableChildren.some(
          (column) => column.isToggled
        );
        const newValue = groupedColumns.indeterminate ? true : !anyChildOn;
        group.columns.filter((column) => column.isToggleable !== false).forEach((column) => {
          column.isToggled = newValue;
        });
        this.columns = [...this.columns];
        if (this.isLive) {
          this.applyTableColumnManager();
        }
      },
      toggleColumn(name, groupName = null) {
        const column = this.getColumn(name, groupName);
        if (!column || column.isToggleable === false) {
          return;
        }
        column.isToggled = !column.isToggled;
        this.columns = [...this.columns];
        if (this.isLive) {
          this.applyTableColumnManager();
        }
      },
      reorderColumns(sortedIds) {
        const newOrder = sortedIds.map((id) => id.split("::"));
        this.reorderTopLevel(newOrder);
        if (this.isLive) {
          this.applyTableColumnManager();
        }
      },
      reorderGroupColumns(sortedIds, groupName) {
        const group = this.columns.find(
          (column) => column.type === "group" && column.name === groupName
        );
        if (!group) {
          return;
        }
        const newOrder = sortedIds.map((id) => id.split("::"));
        const reordered = [];
        newOrder.forEach(([type, name]) => {
          const item = group.columns.find(
            (column) => column.name === name
          );
          if (item) {
            reordered.push(item);
          }
        });
        group.columns = reordered;
        this.columns = [...this.columns];
        if (this.isLive) {
          this.applyTableColumnManager();
        }
      },
      reorderTopLevel(newOrder) {
        const cloned = this.columns;
        const reordered = [];
        newOrder.forEach(([type, name]) => {
          const item = cloned.find((column) => {
            if (type === "group") {
              return column.type === "group" && column.name === name;
            } else if (type === "column") {
              return column.type !== "group" && column.name === name;
            }
            return false;
          });
          if (item) {
            reordered.push(item);
          }
        });
        this.columns = reordered;
      },
      async applyTableColumnManager() {
        this.isLoading = true;
        try {
          await this.$wire.call("applyTableColumnManager", this.columns);
          this.error = void 0;
        } catch (error) {
          this.error = "Failed to update column visibility";
          console.error("Table toggle columns error:", error);
        } finally {
          this.isLoading = false;
        }
      }
    };
  }

  // packages/tables/resources/js/index.js
  document.addEventListener("alpine:init", () => {
    window.Alpine.data("filamentTable", table_default);
    window.Alpine.data("filamentTableColumnManager", filamentTableColumnManager);
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vcmVzb3VyY2VzL2pzL2NvbXBvbmVudHMvdGFibGUuanMiLCAiLi4vcmVzb3VyY2VzL2pzL2NvbXBvbmVudHMvY29sdW1uLW1hbmFnZXIuanMiLCAiLi4vcmVzb3VyY2VzL2pzL2luZGV4LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgZGVmYXVsdCAoe1xuICAgIGNhblNlbGVjdE11bHRpcGxlUmVjb3JkcyxcbiAgICBjYW5UcmFja0Rlc2VsZWN0ZWRSZWNvcmRzLFxuICAgIGN1cnJlbnRTZWxlY3Rpb25MaXZld2lyZVByb3BlcnR5LFxuICAgICR3aXJlLFxufSkgPT4gKHtcbiAgICBjaGVja2JveENsaWNrQ29udHJvbGxlcjogbnVsbCxcblxuICAgIGNvbGxhcHNlZEdyb3VwczogW10sXG5cbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuXG4gICAgc2VsZWN0ZWRSZWNvcmRzOiBuZXcgU2V0KCksXG5cbiAgICBkZXNlbGVjdGVkUmVjb3JkczogbmV3IFNldCgpLFxuXG4gICAgaXNUcmFja2luZ0Rlc2VsZWN0ZWRSZWNvcmRzOiBmYWxzZSxcblxuICAgIHNob3VsZENoZWNrVW5pcXVlU2VsZWN0aW9uOiB0cnVlLFxuXG4gICAgbGFzdENoZWNrZWRSZWNvcmQ6IG51bGwsXG5cbiAgICBsaXZld2lyZUlkOiBudWxsLFxuXG4gICAgZW50YW5nbGVkU2VsZWN0ZWRSZWNvcmRzOiBjdXJyZW50U2VsZWN0aW9uTGl2ZXdpcmVQcm9wZXJ0eVxuICAgICAgICA/ICR3aXJlLiRlbnRhbmdsZShjdXJyZW50U2VsZWN0aW9uTGl2ZXdpcmVQcm9wZXJ0eSlcbiAgICAgICAgOiBudWxsLFxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5saXZld2lyZUlkID1cbiAgICAgICAgICAgIHRoaXMuJHJvb3QuY2xvc2VzdCgnW3dpcmVcXFxcOmlkXScpLmF0dHJpYnV0ZXNbJ3dpcmU6aWQnXS52YWx1ZVxuXG4gICAgICAgICR3aXJlLiRvbignZGVzZWxlY3RBbGxUYWJsZVJlY29yZHMnLCAoKSA9PiB0aGlzLmRlc2VsZWN0QWxsUmVjb3JkcygpKVxuXG4gICAgICAgIGlmIChjdXJyZW50U2VsZWN0aW9uTGl2ZXdpcmVQcm9wZXJ0eSkge1xuICAgICAgICAgICAgaWYgKGNhblNlbGVjdE11bHRpcGxlUmVjb3Jkcykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSZWNvcmRzID0gbmV3IFNldCh0aGlzLmVudGFuZ2xlZFNlbGVjdGVkUmVjb3JkcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFJlY29yZHMgPSBuZXcgU2V0KFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVudGFuZ2xlZFNlbGVjdGVkUmVjb3Jkc1xuICAgICAgICAgICAgICAgICAgICAgICAgPyBbdGhpcy5lbnRhbmdsZWRTZWxlY3RlZFJlY29yZHNdXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFtdLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHRoaXMud2F0Y2hGb3JDaGVja2JveENsaWNrcygpKVxuXG4gICAgICAgIExpdmV3aXJlLmhvb2soJ2VsZW1lbnQuaW5pdCcsICh7IGNvbXBvbmVudCB9KSA9PiB7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LmlkID09PSB0aGlzLmxpdmV3aXJlSWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndhdGNoRm9yQ2hlY2tib3hDbGlja3MoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICBtb3VudEFjdGlvbiguLi5hcmdzKSB7XG4gICAgICAgICR3aXJlLnNldChcbiAgICAgICAgICAgICdpc1RyYWNraW5nRGVzZWxlY3RlZFRhYmxlUmVjb3JkcycsXG4gICAgICAgICAgICB0aGlzLmlzVHJhY2tpbmdEZXNlbGVjdGVkUmVjb3JkcyxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICApXG4gICAgICAgICR3aXJlLnNldCgnc2VsZWN0ZWRUYWJsZVJlY29yZHMnLCBbLi4udGhpcy5zZWxlY3RlZFJlY29yZHNdLCBmYWxzZSlcbiAgICAgICAgJHdpcmUuc2V0KCdkZXNlbGVjdGVkVGFibGVSZWNvcmRzJywgWy4uLnRoaXMuZGVzZWxlY3RlZFJlY29yZHNdLCBmYWxzZSlcblxuICAgICAgICAkd2lyZS5tb3VudEFjdGlvbiguLi5hcmdzKVxuICAgIH0sXG5cbiAgICB0b2dnbGVTZWxlY3RSZWNvcmRzT25QYWdlKCkge1xuICAgICAgICBjb25zdCBrZXlzID0gdGhpcy5nZXRSZWNvcmRzT25QYWdlKClcblxuICAgICAgICBpZiAodGhpcy5hcmVSZWNvcmRzU2VsZWN0ZWQoa2V5cykpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RSZWNvcmRzKGtleXMpXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZWxlY3RSZWNvcmRzKGtleXMpXG4gICAgfSxcblxuICAgIGFzeW5jIHRvZ2dsZVNlbGVjdFJlY29yZHNJbkdyb3VwKGdyb3VwKSB7XG4gICAgICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZVxuXG4gICAgICAgIGlmICh0aGlzLmFyZVJlY29yZHNTZWxlY3RlZCh0aGlzLmdldFJlY29yZHNJbkdyb3VwT25QYWdlKGdyb3VwKSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RSZWNvcmRzKFxuICAgICAgICAgICAgICAgIGF3YWl0ICR3aXJlLmdldEdyb3VwZWRTZWxlY3RhYmxlVGFibGVSZWNvcmRLZXlzKGdyb3VwKSxcbiAgICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0UmVjb3JkcyhcbiAgICAgICAgICAgICAgICBhd2FpdCAkd2lyZS5nZXRHcm91cGVkU2VsZWN0YWJsZVRhYmxlUmVjb3JkS2V5cyhncm91cCksXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgfSxcblxuICAgIGdldFJlY29yZHNJbkdyb3VwT25QYWdlKGdyb3VwKSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBbXVxuXG4gICAgICAgIGZvciAobGV0IGNoZWNrYm94IG9mIHRoaXMuJHJvb3Q/LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXG4gICAgICAgICAgICAnZmktdGEtcmVjb3JkLWNoZWNrYm94JyxcbiAgICAgICAgKSA/PyBbXSkge1xuICAgICAgICAgICAgaWYgKGNoZWNrYm94LmRhdGFzZXQuZ3JvdXAgIT09IGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAga2V5cy5wdXNoKGNoZWNrYm94LnZhbHVlKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGtleXNcbiAgICB9LFxuXG4gICAgZ2V0U2VsZWN0ZWRSZWNvcmRzQ291bnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVHJhY2tpbmdEZXNlbGVjdGVkUmVjb3Jkcykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAodGhpcy4kcmVmcy5hbGxTZWxlY3RhYmxlUmVjb3Jkc0NvdW50Py52YWx1ZSA/P1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2VsZWN0ZWRSZWNvcmRzLnNpemUpIC0gdGhpcy5kZXNlbGVjdGVkUmVjb3Jkcy5zaXplXG4gICAgICAgICAgICApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFJlY29yZHMuc2l6ZVxuICAgIH0sXG5cbiAgICBnZXRSZWNvcmRzT25QYWdlKCkge1xuICAgICAgICBjb25zdCBrZXlzID0gW11cblxuICAgICAgICBmb3IgKGxldCBjaGVja2JveCBvZiB0aGlzLiRyb290Py5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgICAgICAgJ2ZpLXRhLXJlY29yZC1jaGVja2JveCcsXG4gICAgICAgICkgPz8gW10pIHtcbiAgICAgICAgICAgIGtleXMucHVzaChjaGVja2JveC52YWx1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBrZXlzXG4gICAgfSxcblxuICAgIHNlbGVjdFJlY29yZHMoa2V5cykge1xuICAgICAgICBpZiAoIWNhblNlbGVjdE11bHRpcGxlUmVjb3Jkcykge1xuICAgICAgICAgICAgdGhpcy5kZXNlbGVjdEFsbFJlY29yZHMoKVxuXG4gICAgICAgICAgICBrZXlzID0ga2V5cy5zbGljZSgwLCAxKVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUmVjb3JkU2VsZWN0ZWQoa2V5KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzVHJhY2tpbmdEZXNlbGVjdGVkUmVjb3Jkcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RlZFJlY29yZHMuZGVsZXRlKGtleSlcblxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRSZWNvcmRzLmFkZChrZXkpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZWRTZWxlY3RlZFJlY29yZHMoKVxuICAgIH0sXG5cbiAgICBkZXNlbGVjdFJlY29yZHMoa2V5cykge1xuICAgICAgICBmb3IgKGxldCBrZXkgb2Yga2V5cykge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNUcmFja2luZ0Rlc2VsZWN0ZWRSZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNlbGVjdGVkUmVjb3Jkcy5hZGQoa2V5KVxuXG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFJlY29yZHMuZGVsZXRlKGtleSlcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlZFNlbGVjdGVkUmVjb3JkcygpXG4gICAgfSxcblxuICAgIHVwZGF0ZWRTZWxlY3RlZFJlY29yZHMoKSB7XG4gICAgICAgIGlmIChjYW5TZWxlY3RNdWx0aXBsZVJlY29yZHMpIHtcbiAgICAgICAgICAgIHRoaXMuZW50YW5nbGVkU2VsZWN0ZWRSZWNvcmRzID0gWy4uLnRoaXMuc2VsZWN0ZWRSZWNvcmRzXVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW50YW5nbGVkU2VsZWN0ZWRSZWNvcmRzID0gWy4uLnRoaXMuc2VsZWN0ZWRSZWNvcmRzXVswXSA/PyBudWxsXG4gICAgfSxcblxuICAgIHRvZ2dsZVNlbGVjdGVkUmVjb3JkKGtleSkge1xuICAgICAgICBpZiAodGhpcy5pc1JlY29yZFNlbGVjdGVkKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzZWxlY3RSZWNvcmRzKFtrZXldKVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VsZWN0UmVjb3Jkcyhba2V5XSlcbiAgICB9LFxuXG4gICAgYXN5bmMgc2VsZWN0QWxsUmVjb3JkcygpIHtcbiAgICAgICAgaWYgKCFjYW5UcmFja0Rlc2VsZWN0ZWRSZWNvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLmlzTG9hZGluZyA9IHRydWVcblxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFJlY29yZHMgPSBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIGF3YWl0ICR3aXJlLmdldEFsbFNlbGVjdGFibGVUYWJsZVJlY29yZEtleXMoKSxcbiAgICAgICAgICAgIClcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVkU2VsZWN0ZWRSZWNvcmRzKClcblxuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSBmYWxzZVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNUcmFja2luZ0Rlc2VsZWN0ZWRSZWNvcmRzID0gdHJ1ZVxuICAgICAgICB0aGlzLnNlbGVjdGVkUmVjb3JkcyA9IG5ldyBTZXQoKVxuICAgICAgICB0aGlzLmRlc2VsZWN0ZWRSZWNvcmRzID0gbmV3IFNldCgpXG5cbiAgICAgICAgdGhpcy51cGRhdGVkU2VsZWN0ZWRSZWNvcmRzKClcbiAgICB9LFxuXG4gICAgZGVzZWxlY3RBbGxSZWNvcmRzKCkge1xuICAgICAgICB0aGlzLmlzVHJhY2tpbmdEZXNlbGVjdGVkUmVjb3JkcyA9IGZhbHNlXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSZWNvcmRzID0gbmV3IFNldCgpXG4gICAgICAgIHRoaXMuZGVzZWxlY3RlZFJlY29yZHMgPSBuZXcgU2V0KClcblxuICAgICAgICB0aGlzLnVwZGF0ZWRTZWxlY3RlZFJlY29yZHMoKVxuICAgIH0sXG5cbiAgICBpc1JlY29yZFNlbGVjdGVkKGtleSkge1xuICAgICAgICBpZiAodGhpcy5pc1RyYWNraW5nRGVzZWxlY3RlZFJlY29yZHMpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5kZXNlbGVjdGVkUmVjb3Jkcy5oYXMoa2V5KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0ZWRSZWNvcmRzLmhhcyhrZXkpXG4gICAgfSxcblxuICAgIGFyZVJlY29yZHNTZWxlY3RlZChrZXlzKSB7XG4gICAgICAgIHJldHVybiBrZXlzLmV2ZXJ5KChrZXkpID0+IHRoaXMuaXNSZWNvcmRTZWxlY3RlZChrZXkpKVxuICAgIH0sXG5cbiAgICB0b2dnbGVDb2xsYXBzZUdyb3VwKGdyb3VwKSB7XG4gICAgICAgIGlmICh0aGlzLmlzR3JvdXBDb2xsYXBzZWQoZ3JvdXApKSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlZEdyb3Vwcy5zcGxpY2UodGhpcy5jb2xsYXBzZWRHcm91cHMuaW5kZXhPZihncm91cCksIDEpXG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb2xsYXBzZWRHcm91cHMucHVzaChncm91cClcbiAgICB9LFxuXG4gICAgaXNHcm91cENvbGxhcHNlZChncm91cCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsYXBzZWRHcm91cHMuaW5jbHVkZXMoZ3JvdXApXG4gICAgfSxcblxuICAgIHJlc2V0Q29sbGFwc2VkR3JvdXBzKCkge1xuICAgICAgICB0aGlzLmNvbGxhcHNlZEdyb3VwcyA9IFtdXG4gICAgfSxcblxuICAgIHdhdGNoRm9yQ2hlY2tib3hDbGlja3MoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrYm94Q2xpY2tDb250cm9sbGVyKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrYm94Q2xpY2tDb250cm9sbGVyLmFib3J0KClcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hlY2tib3hDbGlja0NvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKClcblxuICAgICAgICBjb25zdCB7IHNpZ25hbCB9ID0gdGhpcy5jaGVja2JveENsaWNrQ29udHJvbGxlclxuXG4gICAgICAgIHRoaXMuJHJvb3Q/LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAnY2xpY2snLFxuICAgICAgICAgICAgKGV2ZW50KSA9PlxuICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldD8ubWF0Y2hlcygnLmZpLXRhLXJlY29yZC1jaGVja2JveCcpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDaGVja2JveENsaWNrKGV2ZW50LCBldmVudC50YXJnZXQpLFxuICAgICAgICAgICAgeyBzaWduYWwgfSxcbiAgICAgICAgKVxuICAgIH0sXG5cbiAgICBoYW5kbGVDaGVja2JveENsaWNrKGV2ZW50LCBjaGVja2JveCkge1xuICAgICAgICBpZiAoIXRoaXMubGFzdENoZWNrZWQpIHtcbiAgICAgICAgICAgIHRoaXMubGFzdENoZWNrZWQgPSBjaGVja2JveFxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgICAgbGV0IGNoZWNrYm94ZXMgPSBBcnJheS5mcm9tKFxuICAgICAgICAgICAgICAgIHRoaXMuJHJvb3Q/LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2ZpLXRhLXJlY29yZC1jaGVja2JveCcpID8/XG4gICAgICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICBpZiAoIWNoZWNrYm94ZXMuaW5jbHVkZXModGhpcy5sYXN0Q2hlY2tlZCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RDaGVja2VkID0gY2hlY2tib3hcblxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc3RhcnQgPSBjaGVja2JveGVzLmluZGV4T2YodGhpcy5sYXN0Q2hlY2tlZClcbiAgICAgICAgICAgIGxldCBlbmQgPSBjaGVja2JveGVzLmluZGV4T2YoY2hlY2tib3gpXG5cbiAgICAgICAgICAgIGxldCByYW5nZSA9IFtzdGFydCwgZW5kXS5zb3J0KChhLCBiKSA9PiBhIC0gYilcbiAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBbXVxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gcmFuZ2VbMF07IGkgPD0gcmFuZ2VbMV07IGkrKykge1xuICAgICAgICAgICAgICAgIGNoZWNrYm94ZXNbaV0uY2hlY2tlZCA9IGNoZWNrYm94LmNoZWNrZWRcblxuICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKGNoZWNrYm94ZXNbaV0udmFsdWUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjaGVja2JveC5jaGVja2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RSZWNvcmRzKHZhbHVlcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNlbGVjdFJlY29yZHModmFsdWVzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYXN0Q2hlY2tlZCA9IGNoZWNrYm94XG4gICAgfSxcbn0pXG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmlsYW1lbnRUYWJsZUNvbHVtbk1hbmFnZXIoeyBjb2x1bW5zLCBpc0xpdmUgfSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGVycm9yOiB1bmRlZmluZWQsXG5cbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcblxuICAgICAgICBjb2x1bW5zLFxuXG4gICAgICAgIGlzTGl2ZSxcblxuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNvbHVtbnMgfHwgdGhpcy5jb2x1bW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29sdW1ucyA9IFtdXG5cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBnZXQgZ3JvdXBlZENvbHVtbnMoKSB7XG4gICAgICAgICAgICBjb25zdCBncm91cGVkQ29sdW1ucyA9IHt9XG5cbiAgICAgICAgICAgIHRoaXMuY29sdW1uc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGNvbHVtbikgPT4gY29sdW1uLnR5cGUgPT09ICdncm91cCcpXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBncm91cGVkQ29sdW1uc1tjb2x1bW4ubmFtZV0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVHcm91cGVkQ29sdW1ucyhjb2x1bW4pXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcmV0dXJuIGdyb3VwZWRDb2x1bW5zXG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FsY3VsYXRlR3JvdXBlZENvbHVtbnMoZ3JvdXApIHtcbiAgICAgICAgICAgIGlmICghZ3JvdXA/LmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBjaGVja2VkOiBmYWxzZSwgZGlzYWJsZWQ6IHRydWUsIGluZGV0ZXJtaW5hdGU6IGZhbHNlIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdG9nZ2xlYWJsZUNoaWxkcmVuID0gZ3JvdXAuY29sdW1ucy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKGNvbHVtbikgPT4gY29sdW1uLmlzVG9nZ2xlYWJsZSAhPT0gZmFsc2UsXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGlmICh0b2dnbGVhYmxlQ2hpbGRyZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY2hlY2tlZDogdHJ1ZSwgZGlzYWJsZWQ6IHRydWUsIGluZGV0ZXJtaW5hdGU6IGZhbHNlIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdG9nZ2xlZENoaWxkcmVuID0gdG9nZ2xlYWJsZUNoaWxkcmVuLmZpbHRlcihcbiAgICAgICAgICAgICAgICAoY29sdW1uKSA9PiBjb2x1bW4uaXNUb2dnbGVkLFxuICAgICAgICAgICAgKS5sZW5ndGhcbiAgICAgICAgICAgIGNvbnN0IG5vblRvZ2dsZWFibGVDaGlsZHJlbiA9IGdyb3VwLmNvbHVtbnMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIChjb2x1bW4pID0+IGNvbHVtbi5pc1RvZ2dsZWFibGUgPT09IGZhbHNlLFxuICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICBpZiAodG9nZ2xlZENoaWxkcmVuID09PSAwICYmIG5vblRvZ2dsZWFibGVDaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY2hlY2tlZDogdHJ1ZSwgZGlzYWJsZWQ6IGZhbHNlLCBpbmRldGVybWluYXRlOiB0cnVlIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRvZ2dsZWRDaGlsZHJlbiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGNoZWNrZWQ6IGZhbHNlLCBkaXNhYmxlZDogZmFsc2UsIGluZGV0ZXJtaW5hdGU6IGZhbHNlIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRvZ2dsZWRDaGlsZHJlbiA9PT0gdG9nZ2xlYWJsZUNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7IGNoZWNrZWQ6IHRydWUsIGRpc2FibGVkOiBmYWxzZSwgaW5kZXRlcm1pbmF0ZTogZmFsc2UgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4geyBjaGVja2VkOiB0cnVlLCBkaXNhYmxlZDogZmFsc2UsIGluZGV0ZXJtaW5hdGU6IHRydWUgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGdldENvbHVtbihuYW1lLCBncm91cE5hbWUgPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoZ3JvdXBOYW1lKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmNvbHVtbnMuZmluZChcbiAgICAgICAgICAgICAgICAgICAgKGdyb3VwKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAudHlwZSA9PT0gJ2dyb3VwJyAmJiBncm91cC5uYW1lID09PSBncm91cE5hbWUsXG4gICAgICAgICAgICAgICAgKVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdyb3VwPy5jb2x1bW5zPy5maW5kKChjb2x1bW4pID0+IGNvbHVtbi5uYW1lID09PSBuYW1lKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb2x1bW5zLmZpbmQoKGNvbHVtbikgPT4gY29sdW1uLm5hbWUgPT09IG5hbWUpXG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9nZ2xlR3JvdXAoZ3JvdXBOYW1lKSB7XG4gICAgICAgICAgICBjb25zdCBncm91cCA9IHRoaXMuY29sdW1ucy5maW5kKFxuICAgICAgICAgICAgICAgIChncm91cCkgPT4gZ3JvdXAudHlwZSA9PT0gJ2dyb3VwJyAmJiBncm91cC5uYW1lID09PSBncm91cE5hbWUsXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGlmICghZ3JvdXA/LmNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZ3JvdXBlZENvbHVtbnMgPSB0aGlzLmNhbGN1bGF0ZUdyb3VwZWRDb2x1bW5zKGdyb3VwKVxuXG4gICAgICAgICAgICBpZiAoZ3JvdXBlZENvbHVtbnMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgdG9nZ2xlYWJsZUNoaWxkcmVuID0gZ3JvdXAuY29sdW1ucy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKGNvbHVtbikgPT4gY29sdW1uLmlzVG9nZ2xlYWJsZSAhPT0gZmFsc2UsXG4gICAgICAgICAgICApXG4gICAgICAgICAgICBjb25zdCBhbnlDaGlsZE9uID0gdG9nZ2xlYWJsZUNoaWxkcmVuLnNvbWUoXG4gICAgICAgICAgICAgICAgKGNvbHVtbikgPT4gY29sdW1uLmlzVG9nZ2xlZCxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gZ3JvdXBlZENvbHVtbnMuaW5kZXRlcm1pbmF0ZSA/IHRydWUgOiAhYW55Q2hpbGRPblxuXG4gICAgICAgICAgICBncm91cC5jb2x1bW5zXG4gICAgICAgICAgICAgICAgLmZpbHRlcigoY29sdW1uKSA9PiBjb2x1bW4uaXNUb2dnbGVhYmxlICE9PSBmYWxzZSlcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgoY29sdW1uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbi5pc1RvZ2dsZWQgPSBuZXdWYWx1ZVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHRoaXMuY29sdW1ucyA9IFsuLi50aGlzLmNvbHVtbnNdXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzTGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlUYWJsZUNvbHVtbk1hbmFnZXIoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRvZ2dsZUNvbHVtbihuYW1lLCBncm91cE5hbWUgPSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW4gPSB0aGlzLmdldENvbHVtbihuYW1lLCBncm91cE5hbWUpXG5cbiAgICAgICAgICAgIGlmICghY29sdW1uIHx8IGNvbHVtbi5pc1RvZ2dsZWFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbHVtbi5pc1RvZ2dsZWQgPSAhY29sdW1uLmlzVG9nZ2xlZFxuICAgICAgICAgICAgdGhpcy5jb2x1bW5zID0gWy4uLnRoaXMuY29sdW1uc11cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMaXZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBseVRhYmxlQ29sdW1uTWFuYWdlcigpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVvcmRlckNvbHVtbnMoc29ydGVkSWRzKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdPcmRlciA9IHNvcnRlZElkcy5tYXAoKGlkKSA9PiBpZC5zcGxpdCgnOjonKSlcbiAgICAgICAgICAgIHRoaXMucmVvcmRlclRvcExldmVsKG5ld09yZGVyKVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xpdmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGx5VGFibGVDb2x1bW5NYW5hZ2VyKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZW9yZGVyR3JvdXBDb2x1bW5zKHNvcnRlZElkcywgZ3JvdXBOYW1lKSB7XG4gICAgICAgICAgICBjb25zdCBncm91cCA9IHRoaXMuY29sdW1ucy5maW5kKFxuICAgICAgICAgICAgICAgIChjb2x1bW4pID0+XG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbi50eXBlID09PSAnZ3JvdXAnICYmIGNvbHVtbi5uYW1lID09PSBncm91cE5hbWUsXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGlmICghZ3JvdXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbmV3T3JkZXIgPSBzb3J0ZWRJZHMubWFwKChpZCkgPT4gaWQuc3BsaXQoJzo6JykpXG4gICAgICAgICAgICBjb25zdCByZW9yZGVyZWQgPSBbXVxuXG4gICAgICAgICAgICBuZXdPcmRlci5mb3JFYWNoKChbdHlwZSwgbmFtZV0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gZ3JvdXAuY29sdW1ucy5maW5kKFxuICAgICAgICAgICAgICAgICAgICAoY29sdW1uKSA9PiBjb2x1bW4ubmFtZSA9PT0gbmFtZSxcbiAgICAgICAgICAgICAgICApXG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZW9yZGVyZWQucHVzaChpdGVtKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGdyb3VwLmNvbHVtbnMgPSByZW9yZGVyZWRcbiAgICAgICAgICAgIHRoaXMuY29sdW1ucyA9IFsuLi50aGlzLmNvbHVtbnNdXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzTGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwbHlUYWJsZUNvbHVtbk1hbmFnZXIoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlb3JkZXJUb3BMZXZlbChuZXdPcmRlcikge1xuICAgICAgICAgICAgY29uc3QgY2xvbmVkID0gdGhpcy5jb2x1bW5zXG4gICAgICAgICAgICBjb25zdCByZW9yZGVyZWQgPSBbXVxuXG4gICAgICAgICAgICBuZXdPcmRlci5mb3JFYWNoKChbdHlwZSwgbmFtZV0pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gY2xvbmVkLmZpbmQoKGNvbHVtbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2dyb3VwJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbHVtbi50eXBlID09PSAnZ3JvdXAnICYmIGNvbHVtbi5uYW1lID09PSBuYW1lXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2NvbHVtbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2x1bW4udHlwZSAhPT0gJ2dyb3VwJyAmJiBjb2x1bW4ubmFtZSA9PT0gbmFtZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZW9yZGVyZWQucHVzaChpdGVtKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHRoaXMuY29sdW1ucyA9IHJlb3JkZXJlZFxuICAgICAgICB9LFxuXG4gICAgICAgIGFzeW5jIGFwcGx5VGFibGVDb2x1bW5NYW5hZ2VyKCkge1xuICAgICAgICAgICAgdGhpcy5pc0xvYWRpbmcgPSB0cnVlXG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy4kd2lyZS5jYWxsKCdhcHBseVRhYmxlQ29sdW1uTWFuYWdlcicsIHRoaXMuY29sdW1ucylcblxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IgPSB1bmRlZmluZWRcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvciA9ICdGYWlsZWQgdG8gdXBkYXRlIGNvbHVtbiB2aXNpYmlsaXR5J1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignVGFibGUgdG9nZ2xlIGNvbHVtbnMgZXJyb3I6JywgZXJyb3IpXG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9XG59XG4iLCAiaW1wb3J0IHRhYmxlIGZyb20gJy4vY29tcG9uZW50cy90YWJsZS5qcydcbmltcG9ydCBjb2x1bW5NYW5hZ2VyIGZyb20gJy4vY29tcG9uZW50cy9jb2x1bW4tbWFuYWdlci5qcydcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYWxwaW5lOmluaXQnLCAoKSA9PiB7XG4gICAgd2luZG93LkFscGluZS5kYXRhKCdmaWxhbWVudFRhYmxlJywgdGFibGUpXG4gICAgd2luZG93LkFscGluZS5kYXRhKCdmaWxhbWVudFRhYmxlQ29sdW1uTWFuYWdlcicsIGNvbHVtbk1hbmFnZXIpXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7QUFBQSxNQUFPLGdCQUFRLENBQUM7QUFBQSxJQUNaO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDSixPQUFPO0FBQUEsSUFDSCx5QkFBeUI7QUFBQSxJQUV6QixpQkFBaUIsQ0FBQztBQUFBLElBRWxCLFdBQVc7QUFBQSxJQUVYLGlCQUFpQixvQkFBSSxJQUFJO0FBQUEsSUFFekIsbUJBQW1CLG9CQUFJLElBQUk7QUFBQSxJQUUzQiw2QkFBNkI7QUFBQSxJQUU3Qiw0QkFBNEI7QUFBQSxJQUU1QixtQkFBbUI7QUFBQSxJQUVuQixZQUFZO0FBQUEsSUFFWiwwQkFBMEIsbUNBQ3BCLE1BQU0sVUFBVSxnQ0FBZ0MsSUFDaEQ7QUFBQSxJQUVOLE9BQU87QUFDSCxXQUFLLGFBQ0QsS0FBSyxNQUFNLFFBQVEsYUFBYSxFQUFFLFdBQVcsU0FBUyxFQUFFO0FBRTVELFlBQU0sSUFBSSwyQkFBMkIsTUFBTSxLQUFLLG1CQUFtQixDQUFDO0FBRXBFLFVBQUksa0NBQWtDO0FBQ2xDLFlBQUksMEJBQTBCO0FBQzFCLGVBQUssa0JBQWtCLElBQUksSUFB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
