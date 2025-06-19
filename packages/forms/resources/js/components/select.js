import { computePosition, flip, shift, offset } from '@floating-ui/dom';

export default function selectFormComponent({
    canSelectPlaceholder,
    isHtmlAllowed,
    getOptionLabelUsing,
    getOptionLabelsUsing,
    getOptionsUsing,
    getSearchResultsUsing,
    isAutofocused,
    isDisabled,
    isMultiple,
    isSearchable,
    hasDynamicOptions,
    hasDynamicSearchResults,
    livewireId,
    loadingMessage,
    maxItems,
    maxItemsMessage,
    noSearchResultsMessage,
    options,
    optionsLimit,
    placeholder,
    position,
    searchDebounce,
    searchingMessage,
    searchPrompt,
    searchableOptionFields,
    state,
    statePath,
}) {
    return {
        state,
        select: null,

        init() {
            this.select = new VanillaSelect({
                element: this.$refs.select,
                options: options,
                placeholder: placeholder,
                state: this.state,
                canSelectPlaceholder: canSelectPlaceholder,
                isHtmlAllowed: isHtmlAllowed,
                isAutofocused: isAutofocused,
                isDisabled: isDisabled,
                isMultiple: isMultiple,
                isSearchable: isSearchable,
                getOptionLabelUsing: getOptionLabelUsing,
                getOptionLabelsUsing: getOptionLabelsUsing,
                getOptionsUsing: getOptionsUsing,
                getSearchResultsUsing: getSearchResultsUsing,
                hasDynamicOptions: hasDynamicOptions,
                hasDynamicSearchResults: hasDynamicSearchResults,
                searchPrompt: searchPrompt,
                searchDebounce: searchDebounce,
                loadingMessage: loadingMessage,
                searchingMessage: searchingMessage,
                noSearchResultsMessage: noSearchResultsMessage,
                maxItems: maxItems,
                maxItemsMessage: maxItemsMessage,
                optionsLimit: optionsLimit,
                onStateChange: (newState) => {
                    this.state = newState;
                }
            });
        },
    }
}

class VanillaSelect {
    constructor({
        element,
        options,
        placeholder,
        state,
        canSelectPlaceholder = true,
        isHtmlAllowed = false,
        isAutofocused = false,
        isDisabled = false,
        isMultiple = false,
        isSearchable = false,
        getOptionLabelUsing = null,
        getOptionLabelsUsing = null,
        getOptionsUsing = null,
        getSearchResultsUsing = null,
        hasDynamicOptions = false,
        hasDynamicSearchResults = true,
        searchPrompt = 'Search...',
        searchDebounce = 1000,
        loadingMessage = 'Loading...',
        searchingMessage = 'Searching...',
        noSearchResultsMessage = 'No results found',
        maxItems = null,
        maxItemsMessage = 'Maximum number of items selected',
        optionsLimit = null,
        onStateChange = () => {}
    }) {
        this.element = element;
        this.options = options;
        this.originalOptions = JSON.parse(JSON.stringify(options)); // Keep a copy of original options
        this.placeholder = placeholder;
        this.state = state;
        this.canSelectPlaceholder = canSelectPlaceholder;
        this.isHtmlAllowed = isHtmlAllowed;
        this.isAutofocused = isAutofocused;
        this.isDisabled = isDisabled;
        this.isMultiple = isMultiple;
        this.isSearchable = isSearchable;
        this.getOptionLabelUsing = getOptionLabelUsing;
        this.getOptionLabelsUsing = getOptionLabelsUsing;
        this.getOptionsUsing = getOptionsUsing;
        this.getSearchResultsUsing = getSearchResultsUsing;
        this.hasDynamicOptions = hasDynamicOptions;
        this.hasDynamicSearchResults = hasDynamicSearchResults;
        this.searchPrompt = searchPrompt;
        this.searchDebounce = searchDebounce;
        this.loadingMessage = loadingMessage;
        this.searchingMessage = searchingMessage;
        this.noSearchResultsMessage = noSearchResultsMessage;
        this.maxItems = maxItems;
        this.maxItemsMessage = maxItemsMessage;
        this.optionsLimit = optionsLimit;
        this.onStateChange = onStateChange;

        this.isOpen = false;
        this.selectedIndex = -1;
        this.searchQuery = '';
        this.searchTimeout = null;

        this.render();
        this.setupEventListeners();

        if (this.isAutofocused) {
            this.selectButton.focus();
        }
    }

    render() {
        // Create the main container
        this.container = document.createElement('div');
        this.container.className = 'fi-select-container';
        this.container.setAttribute('aria-haspopup', 'listbox');

        // Create the button that toggles the dropdown
        this.selectButton = document.createElement('button');
        this.selectButton.className = 'fi-select-button';
        this.selectButton.type = 'button';
        this.selectButton.setAttribute('aria-expanded', 'false');
        this.selectButton.setAttribute('aria-labelledby', 'select-label');

        // Create the selected value display
        this.selectedDisplay = document.createElement('span');
        this.selectedDisplay.className = 'fi-select-value';

        // Update the selected display based on current state
        this.updateSelectedDisplay();

        this.selectButton.appendChild(this.selectedDisplay);

        // Create the dropdown
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'fi-select-dropdown';
        this.dropdown.setAttribute('role', 'listbox');
        this.dropdown.setAttribute('tabindex', '-1');
        this.dropdown.style.display = 'none';

        // Add search input if searchable
        if (this.isSearchable) {
            this.searchContainer = document.createElement('div');
            this.searchContainer.className = 'fi-select-search-container';

            this.searchInput = document.createElement('input');
            this.searchInput.className = 'fi-select-search-input';
            this.searchInput.type = 'text';
            this.searchInput.placeholder = this.searchPrompt;
            this.searchInput.setAttribute('aria-label', 'Search');

            this.searchContainer.appendChild(this.searchInput);
            this.dropdown.appendChild(this.searchContainer);

            // Add event listeners for search input
            this.searchInput.addEventListener('input', (event) => {
                // If the select is disabled, don't handle input events
                if (this.isDisabled) {
                    return;
                }

                this.handleSearch(event);
            });

            // Handle Tab, Arrow Up, and Arrow Down in search input
            this.searchInput.addEventListener('keydown', (event) => {
                // If the select is disabled, don't handle keyboard events
                if (this.isDisabled) {
                    return;
                }

                if (event.key === 'Tab') {
                    event.preventDefault();

                    const options = this.getVisibleOptions();
                    if (options.length === 0) return;

                    // If Shift+Tab, focus the last option, otherwise focus the first option
                    if (event.shiftKey) {
                        this.selectedIndex = options.length - 1;
                    } else {
                        this.selectedIndex = 0;
                    }

                    // Remove focus from any previously focused option
                    options.forEach(option => {
                        option.classList.remove('fi-select-option-focused');
                    });

                    options[this.selectedIndex].classList.add('fi-select-option-focused');
                    options[this.selectedIndex].focus();
                } else if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    event.stopPropagation(); // Prevent page scrolling

                    const options = this.getVisibleOptions();
                    if (options.length === 0) return;

                    // Reset selectedIndex to -1 to ensure we focus the first option
                    this.selectedIndex = -1;
                    // Blur the search input to allow arrow key navigation between options
                    this.searchInput.blur();
                    this.focusNextOption();
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    event.stopPropagation(); // Prevent page scrolling

                    const options = this.getVisibleOptions();
                    if (options.length === 0) return;

                    // Set selectedIndex to 0 to ensure we focus the last option
                    this.selectedIndex = 0;
                    // Blur the search input to allow arrow key navigation between options
                    this.searchInput.blur();
                    this.focusPreviousOption();
                }
            });
        }

        // Create the options list
        this.optionsList = document.createElement('ul');
        this.optionsList.className = 'fi-select-options-list';

        // Render options
        this.renderOptions();

        this.dropdown.appendChild(this.optionsList);

        // Append everything to the container
        this.container.appendChild(this.selectButton);
        this.container.appendChild(this.dropdown);

        // Append the container to the element
        this.element.appendChild(this.container);

        // Apply disabled state if needed
        this.applyDisabledState();
    }

    renderOptions() {
        this.optionsList.innerHTML = '';

        // Placeholder option removed as there are X buttons in the main part

        // Process and add options
        let totalRenderedCount = 0;

        if (Array.isArray(this.options)) {
            // New format: array of objects with label, value, isDisabled or label, options

            // Apply options limit if specified
            let optionsToRender = this.options;
            let optionsCount = 0;

            this.options.forEach(option => {
                if (option.options && Array.isArray(option.options)) {
                    // Count options in groups
                    optionsCount += option.options.length;
                } else {
                    // Count regular options
                    optionsCount++;
                }
            });

            // Render options with limit in mind
            let renderedCount = 0;

            for (const option of optionsToRender) {
                if (this.optionsLimit && renderedCount >= this.optionsLimit) {
                    break;
                }

                if (option.options && Array.isArray(option.options)) {
                    // This is an option group
                    // If in multiple mode, filter out selected options from the group
                    let groupOptions = option.options;

                    if (this.isMultiple && Array.isArray(this.state) && this.state.length > 0) {
                        groupOptions = option.options.filter(groupOption =>
                            !this.state.includes(groupOption.value)
                        );
                    }

                    if (groupOptions.length > 0) {
                        // Apply limit to group options if needed
                        if (this.optionsLimit) {
                            const remainingSlots = this.optionsLimit - renderedCount;
                            if (remainingSlots < groupOptions.length) {
                                groupOptions = groupOptions.slice(0, remainingSlots);
                            }
                        }

                        this.renderOptionGroup(option.label, groupOptions);
                        renderedCount += groupOptions.length;
                        totalRenderedCount += groupOptions.length;
                    }
                } else {
                    // This is a regular option
                    // If in multiple mode, skip already selected options
                    if (this.isMultiple && Array.isArray(this.state) && this.state.includes(option.value)) {
                        continue;
                    }

                    const optionElement = this.createOptionElement(option.value, option);
                    this.optionsList.appendChild(optionElement);
                    renderedCount++;
                    totalRenderedCount++;
                }
            }
        } else if (typeof this.options === 'object' && this.options !== null) {
            // Legacy format: object with key-value pairs
            let renderedCount = 0;

            for (const [value, labelOrOptions] of Object.entries(this.options)) {
                if (this.optionsLimit && renderedCount >= this.optionsLimit) {
                    break;
                }

                if (typeof labelOrOptions === 'object' && !Array.isArray(labelOrOptions) && labelOrOptions !== null) {
                    // This is an option group in legacy format
                    const optionGroup = document.createElement('li');
                    optionGroup.className = 'fi-select-option-group';
                    optionGroup.textContent = value;

                    const groupOptionsList = document.createElement('ul');
                    groupOptionsList.className = 'fi-select-option-group-list';

                    let hasOptions = false;
                    let groupOptionsCount = 0;

                    for (const [groupValue, groupLabel] of Object.entries(labelOrOptions)) {
                        // If we've reached the limit, break
                        if (this.optionsLimit && renderedCount + groupOptionsCount >= this.optionsLimit) {
                            break;
                        }

                        // If in multiple mode, skip already selected options
                        if (this.isMultiple && Array.isArray(this.state) && this.state.includes(groupValue)) {
                            continue;
                        }

                        const option = this.createOptionElement(groupValue, groupLabel);
                        groupOptionsList.appendChild(option);
                        hasOptions = true;
                        groupOptionsCount++;
                    }

                    // Only add the group if it has options
                    if (hasOptions) {
                        optionGroup.appendChild(groupOptionsList);
                        this.optionsList.appendChild(optionGroup);
                        renderedCount += groupOptionsCount;
                        totalRenderedCount += groupOptionsCount;
                    }
                } else {
                    // This is a regular option
                    // If in multiple mode, skip already selected options
                    if (this.isMultiple && Array.isArray(this.state) && this.state.includes(value)) {
                        continue;
                    }

                    const option = this.createOptionElement(value, labelOrOptions);
                    this.optionsList.appendChild(option);
                    renderedCount++;
                    totalRenderedCount++;
                }
            }
        }

        // If in multiple mode and no options were rendered, hide the dropdown
        // unless the search input is filled, in which case the user might want to change their search
        if (this.isMultiple && totalRenderedCount === 0 && this.isOpen && (!this.isSearchable || !this.searchQuery)) {
            this.closeDropdown();
        }
    }

    renderOptionGroup(label, options) {
        const optionGroup = document.createElement('li');
        optionGroup.className = 'fi-select-option-group';
        optionGroup.textContent = label;

        const groupOptionsList = document.createElement('ul');
        groupOptionsList.className = 'fi-select-option-group-list';

        options.forEach(option => {
            const optionElement = this.createOptionElement(option.value, option);
            groupOptionsList.appendChild(optionElement);
        });

        optionGroup.appendChild(groupOptionsList);
        this.optionsList.appendChild(optionGroup);
    }

    createOptionElement(value, label) {
        // Check if this is an object with label, value, and isDisabled properties
        let optionValue = value;
        let optionLabel = label;
        let isDisabled = false;

        if (typeof label === 'object' && label !== null && 'label' in label && 'value' in label) {
            optionValue = label.value;
            optionLabel = label.label;
            isDisabled = label.isDisabled || false;
        }

        const option = document.createElement('li');
        option.className = 'fi-select-option';

        if (!isDisabled) {
            option.classList.add('fi-select-option-enabled');
        } else {
            option.classList.add('fi-select-option-disabled');
        }

        option.setAttribute('role', 'option');
        option.setAttribute('data-value', optionValue);
        option.setAttribute('tabindex', '0'); // Make the option focusable

        if (isDisabled) {
            option.setAttribute('aria-disabled', 'true');
        }

        // Check if this option is selected
        const isSelected = this.isMultiple
            ? Array.isArray(this.state) && this.state.includes(optionValue)
            : this.state === optionValue;

        option.setAttribute('aria-selected', isSelected ? 'true' : 'false');

        if (isSelected) {
            option.classList.add('fi-select-option-selected');

            // Add a checkmark for selected option
            const checkmark = document.createElement('span');
            checkmark.className = 'fi-select-option-checkmark';
            checkmark.innerHTML = '<svg class="fi-select-option-checkmark-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>';
            option.appendChild(checkmark);
        }

        // Handle HTML content if allowed
        if (this.isHtmlAllowed) {
            const labelSpan = document.createElement('span');
            labelSpan.innerHTML = optionLabel;
            option.appendChild(labelSpan);
        } else {
            option.textContent = optionLabel;
        }

        // Add click event only if not disabled
        if (!isDisabled) {
            option.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.selectOption(optionValue);

                // Prevent the dropdown from losing focus
                if (this.isMultiple) {
                    // For multiple selection, maintain focus within the dropdown
                    if (this.isSearchable && this.searchInput) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        }, 0);
                    } else {
                        // Keep focus on the option
                        setTimeout(() => {
                            option.focus();
                        }, 0);
                    }
                }
            });
        }

        return option;
    }

    async updateSelectedDisplay() {
        if (this.isMultiple) {
            // Clear the current content
            this.selectedDisplay.innerHTML = '';

            if (Array.isArray(this.state) && this.state.length > 0) {
                // For multiple selection, show badges with option labels
                let selectedLabels = this.getSelectedOptionLabels();

                // If we couldn't find all labels and getOptionLabelsUsing is available, fetch missing labels
                if (selectedLabels.length < this.state.length && this.getOptionLabelsUsing) {
                    try {
                        // Get the values for which we don't have labels
                        const missingValues = this.state.filter((value, index) => !selectedLabels[index]);

                        if (missingValues.length > 0) {
                            // Fetch labels for missing values
                            const fetchedLabels = await this.getOptionLabelsUsing(missingValues);

                            // Create a new array with all labels
                            selectedLabels = this.state.map(value => {
                                // Check if we already have a label for this value
                                const existingLabel = this.getSelectedOptionLabel(value);
                                if (existingLabel) {
                                    return existingLabel;
                                }

                                // Otherwise, use the fetched label
                                return fetchedLabels[value] || value;
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching option labels:', error);
                    }
                }

                // Create a container for the badges
                const badgesContainer = document.createElement('div');
                badgesContainer.className = 'fi-select-badges';

                // Add badges for each selected option
                selectedLabels.forEach((label, index) => {
                    const badge = document.createElement('span');
                    badge.className = 'fi-select-badge';

                    // Create a container for the label text
                    const labelContainer = document.createElement('span');
                    labelContainer.className = 'fi-select-badge-label';

                    if (this.isHtmlAllowed) {
                        labelContainer.innerHTML = label;
                    } else {
                        labelContainer.textContent = label;
                    }

                    badge.appendChild(labelContainer);

                    // Add a cross button to remove the selection
                    const removeButton = document.createElement('button');
                    removeButton.type = 'button';
                    removeButton.className = 'fi-select-badge-remove';
                    removeButton.innerHTML = '<svg class="fi-select-badge-remove-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
                    removeButton.setAttribute('aria-label', 'Remove ' + (this.isHtmlAllowed ? label.replace(/<[^>]*>/g, '') : label));

                    // Get the value for this badge
                    const value = Array.isArray(this.state) ? this.state[index] : null;

                    removeButton.addEventListener('click', (event) => {
                        event.stopPropagation(); // Prevent dropdown from toggling
                        if (value !== null) {
                            this.selectOption(value); // This will remove the value since it's already selected
                        }
                    });

                    // Add keydown event listener to handle space key
                    removeButton.addEventListener('keydown', (event) => {
                        if (event.key === ' ' || event.key === 'Enter') {
                            event.preventDefault();
                            event.stopPropagation(); // Prevent event from bubbling up to selectButton
                            if (value !== null) {
                                this.selectOption(value);
                            }
                        }
                    });

                    badge.appendChild(removeButton);
                    badgesContainer.appendChild(badge);
                });

                this.selectedDisplay.appendChild(badgesContainer);
            } else {
                this.selectedDisplay.textContent = this.placeholder || 'Select options';
            }
        } else {
            // For single selection
            if (this.state === null || this.state === '') {
                this.selectedDisplay.textContent = this.placeholder || 'Select an option';
            } else {
                // Find the label for the selected value
                let selectedLabel = this.getSelectedOptionLabel(this.state);

                // If label not found and getOptionLabelUsing is available, fetch it
                if (!selectedLabel && this.getOptionLabelUsing) {
                    try {
                        selectedLabel = await this.getOptionLabelUsing(this.state);
                    } catch (error) {
                        console.error('Error fetching option label:', error);
                        selectedLabel = this.state; // Fallback to using the value as the label
                    }
                } else if (!selectedLabel) {
                    // If still no label and no getOptionLabelUsing, use the value as the label
                    selectedLabel = this.state;
                }

                // Clear the current content
                this.selectedDisplay.innerHTML = '';

                // Create a container for the label
                const labelContainer = document.createElement('span');
                labelContainer.className = 'fi-select-single-label';

                if (this.isHtmlAllowed) {
                    labelContainer.innerHTML = selectedLabel;
                } else {
                    labelContainer.textContent = selectedLabel;
                }

                this.selectedDisplay.appendChild(labelContainer);

                // Add a cross button to clear the selection if canSelectPlaceholder is true
                if (this.canSelectPlaceholder) {
                    const removeButton = document.createElement('button');
                    removeButton.type = 'button';
                    removeButton.className = 'fi-select-single-remove';
                    removeButton.innerHTML = '<svg class="fi-select-single-remove-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
                    removeButton.setAttribute('aria-label', 'Clear selection');

                    removeButton.addEventListener('click', (event) => {
                        event.stopPropagation(); // Prevent dropdown from toggling
                        this.selectOption(''); // Select empty value to clear
                    });

                    // Add keydown event listener to handle space key
                    removeButton.addEventListener('keydown', (event) => {
                        if (event.key === ' ' || event.key === 'Enter') {
                            event.preventDefault();
                            event.stopPropagation(); // Prevent event from bubbling up to selectButton
                            this.selectOption(''); // Select empty value to clear
                        }
                    });

                    this.selectedDisplay.appendChild(removeButton);
                }
            }
        }
    }

    getSelectedOptionLabel(value) {
        let selectedLabel = '';

        if (Array.isArray(this.options)) {
            // New format: array of objects
            for (const option of this.options) {
                if (option.options && Array.isArray(option.options)) {
                    // Search in option group
                    for (const groupOption of option.options) {
                        if (groupOption.value === value) {
                            selectedLabel = groupOption.label;
                            break;
                        }
                    }
                } else if (option.value === value) {
                    selectedLabel = option.label;
                    break;
                }
            }
        } else {
            // Legacy format: object with key-value pairs
            // Search in flat options
            Object.entries(this.options).forEach(([optionValue, label]) => {
                if (optionValue === value && typeof label !== 'object') {
                    selectedLabel = label;
                }
            });

            // Search in option groups if not found
            if (!selectedLabel) {
                Object.entries(this.options).forEach(([groupName, groupOptions]) => {
                    if (typeof groupOptions === 'object' && !Array.isArray(groupOptions)) {
                        Object.entries(groupOptions).forEach(([optionValue, label]) => {
                            if (optionValue === value) {
                                selectedLabel = label;
                            }
                        });
                    }
                });
            }
        }

        return selectedLabel;
    }

    setupEventListeners() {
        // Toggle dropdown when button is clicked
        this.selectButton.addEventListener('click', () => {
            this.toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!this.container.contains(event.target) && this.isOpen) {
                this.closeDropdown();
            }
        });

        // Keyboard navigation
        this.selectButton.addEventListener('keydown', (event) => {
            // If the select is disabled, don't handle keyboard events
            if (this.isDisabled) {
                return;
            }

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    event.stopPropagation(); // Prevent page scrolling
                    if (!this.isOpen) {
                        this.openDropdown();
                    } else {
                        this.focusNextOption();
                    }
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    event.stopPropagation(); // Prevent page scrolling
                    if (!this.isOpen) {
                        this.openDropdown();
                    } else {
                        this.focusPreviousOption();
                    }
                    break;
                case ' ':
                    event.preventDefault();
                    if (this.isOpen) {
                        if (this.selectedIndex >= 0) {
                            const focusedOption = this.getVisibleOptions()[this.selectedIndex];
                            if (focusedOption) {
                                focusedOption.click();
                            }
                        }
                    } else {
                        this.openDropdown();
                    }
                    break;
                case 'Enter':
                    // Do nothing for Enter key, allow it to submit the form
                    break;
                case 'Escape':
                    if (this.isOpen) {
                        event.preventDefault();
                        this.closeDropdown();
                    }
                    break;
                case 'Tab':
                    if (this.isOpen) {
                        this.closeDropdown();
                    }
                    break;
            }
        });

        // Keyboard navigation within dropdown
        this.dropdown.addEventListener('keydown', (event) => {
            // If the select is disabled, don't handle keyboard events
            if (this.isDisabled) {
                return;
            }

            // Skip navigation if search input is focused and it's not Tab or Escape
            if (this.isSearchable &&
                document.activeElement === this.searchInput &&
                !['Tab', 'Escape'].includes(event.key)) {
                return;
            }

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    event.stopPropagation(); // Prevent page scrolling
                    this.focusNextOption();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    event.stopPropagation(); // Prevent page scrolling
                    this.focusPreviousOption();
                    break;
                case ' ':
                    event.preventDefault();
                    if (this.selectedIndex >= 0) {
                        const focusedOption = this.getVisibleOptions()[this.selectedIndex];
                        if (focusedOption) {
                            focusedOption.click();
                        }
                    }
                    break;
                case 'Enter':
                    // Do nothing for Enter key, allow it to submit the form
                    break;
                case 'Escape':
                    event.preventDefault();
                    this.closeDropdown();
                    this.selectButton.focus();
                    break;
                case 'Tab':
                    this.closeDropdown();
                    break;
            }
        });
    }

    toggleDropdown() {
        // If the select is disabled, don't allow toggling the dropdown
        if (this.isDisabled) {
            return;
        }

        if (this.isOpen) {
            this.closeDropdown();
        } else {
            // Check if we should prevent opening the dropdown
            // If in multiple mode, all options are selected, and not searchable, don't open
            if (this.isMultiple && !this.isSearchable) {
                // Count available options (not already selected)
                let availableOptionsCount = 0;

                if (Array.isArray(this.options)) {
                    // New format: array of objects
                    for (const option of this.options) {
                        if (option.options && Array.isArray(option.options)) {
                            // This is an option group
                            for (const groupOption of option.options) {
                                if (!Array.isArray(this.state) || !this.state.includes(groupOption.value)) {
                                    availableOptionsCount++;
                                    break; // We only need to know if there's at least one option available
                                }
                            }
                        } else if (!Array.isArray(this.state) || !this.state.includes(option.value)) {
                            availableOptionsCount++;
                            break; // We only need to know if there's at least one option available
                        }
                    }
                } else if (typeof this.options === 'object' && this.options !== null) {
                    // Legacy format: object with key-value pairs
                    for (const [value, labelOrOptions] of Object.entries(this.options)) {
                        if (typeof labelOrOptions === 'object' && !Array.isArray(labelOrOptions) && labelOrOptions !== null) {
                            // This is an option group
                            for (const [groupValue, groupLabel] of Object.entries(labelOrOptions)) {
                                if (!Array.isArray(this.state) || !this.state.includes(groupValue)) {
                                    availableOptionsCount++;
                                    break; // We only need to know if there's at least one option available
                                }
                            }
                        } else if (!Array.isArray(this.state) || !this.state.includes(value)) {
                            availableOptionsCount++;
                            break; // We only need to know if there's at least one option available
                        }
                    }
                }

                // If no options are available, don't open the dropdown
                if (availableOptionsCount === 0) {
                    return;
                }
            }

            this.openDropdown();
        }
    }

    async openDropdown() {
        // Make dropdown visible but with position absolute and opacity 0 for measurement
        this.dropdown.style.display = 'block';
        this.dropdown.style.opacity = '0';
        this.dropdown.style.position = 'absolute';
        this.selectButton.setAttribute('aria-expanded', 'true');
        this.isOpen = true;

        // Position the dropdown using Floating UI
        this.positionDropdown();

        // Add resize listener to update position when window is resized
        if (!this.resizeListener) {
            this.resizeListener = () => this.positionDropdown();
            window.addEventListener('resize', this.resizeListener);
        }

        // Make dropdown visible
        this.dropdown.style.opacity = '1';

        // If hasDynamicOptions is true, fetch options
        if (this.hasDynamicOptions && this.getOptionsUsing) {
            // Show loading message
            this.showLoadingState(false);

            try {
                // Fetch options
                const fetchedOptions = await this.getOptionsUsing();

                // Update options
                this.options = fetchedOptions;
                this.originalOptions = JSON.parse(JSON.stringify(fetchedOptions));

                // Render options
                this.renderOptions();
            } catch (error) {
                console.error('Error fetching options:', error);

                // Hide loading state
                this.hideLoadingState();
            }
        }

        // If searchable, focus the search input
        if (this.isSearchable && this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.focus();

            // Reset options to original if there was a previous search
            if (this.searchQuery) {
                this.searchQuery = '';
                this.options = JSON.parse(JSON.stringify(this.originalOptions));
                this.renderOptions();
            }
        } else {
            // Focus the first option or the selected option
            this.selectedIndex = -1;

            // Find the index of the selected option
            const options = this.getVisibleOptions();
            if (this.isMultiple) {
                if (Array.isArray(this.state) && this.state.length > 0) {
                    for (let i = 0; i < options.length; i++) {
                        if (this.state.includes(options[i].getAttribute('data-value'))) {
                            this.selectedIndex = i;
                            break;
                        }
                    }
                }
            } else {
                for (let i = 0; i < options.length; i++) {
                    if (options[i].getAttribute('data-value') === this.state) {
                        this.selectedIndex = i;
                        break;
                    }
                }
            }

            // If no option is selected, focus the first option
            if (this.selectedIndex === -1 && options.length > 0) {
                this.selectedIndex = 0;
            }

            // Focus the selected option
            if (this.selectedIndex >= 0) {
                options[this.selectedIndex].classList.add('fi-select-option-focused');
                options[this.selectedIndex].focus();
            }
        }
    }

    positionDropdown() {
        computePosition(this.selectButton, this.dropdown, {
            placement: 'bottom-start',
            middleware: [
                offset(4), // Add some space between button and dropdown
                flip(), // Flip to top if not enough space at bottom
                shift({ padding: 5 }), // Keep within viewport with some padding
            ],
        }).then(({ x, y }) => {
            Object.assign(this.dropdown.style, {
                left: `${x}px`,
                top: `${y}px`,
                width: `${this.selectButton.offsetWidth}px`,
            });
        });
    }

    closeDropdown() {
        this.dropdown.style.display = 'none';
        this.selectButton.setAttribute('aria-expanded', 'false');
        this.isOpen = false;

        // Remove resize listener
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }

        // Remove focus from all options
        const options = this.getVisibleOptions();
        options.forEach(option => {
            option.classList.remove('fi-select-option-focused');
        });
    }

    focusNextOption() {
        const options = this.getVisibleOptions();
        if (options.length === 0) return;

        // Remove focus from current option
        if (this.selectedIndex >= 0 && this.selectedIndex < options.length) {
            options[this.selectedIndex].classList.remove('fi-select-option-focused');
        }

        // If we're at the last option and search input is available, focus the search input
        if (this.selectedIndex === options.length - 1 && this.isSearchable && this.searchInput) {
            this.selectedIndex = -1;
            this.searchInput.focus();
            return;
        }

        // Focus next option (wrap around to the first option if at the end)
        this.selectedIndex = (this.selectedIndex + 1) % options.length;
        options[this.selectedIndex].classList.add('fi-select-option-focused');
        options[this.selectedIndex].focus();
        this.scrollOptionIntoView(options[this.selectedIndex]);
    }

    focusPreviousOption() {
        const options = this.getVisibleOptions();
        if (options.length === 0) return;

        // Remove focus from current option
        if (this.selectedIndex >= 0 && this.selectedIndex < options.length) {
            options[this.selectedIndex].classList.remove('fi-select-option-focused');
        }

        // If we're at the first option or haven't selected an option yet, focus the search input if available
        if ((this.selectedIndex === 0 || this.selectedIndex === -1) && this.isSearchable && this.searchInput) {
            this.selectedIndex = -1;
            this.searchInput.focus();
            return;
        }

        // Focus previous option (wrap around to the last option if at the beginning)
        this.selectedIndex = (this.selectedIndex - 1 + options.length) % options.length;
        options[this.selectedIndex].classList.add('fi-select-option-focused');
        options[this.selectedIndex].focus();
        this.scrollOptionIntoView(options[this.selectedIndex]);
    }

    scrollOptionIntoView(option) {
        if (!option) return;

        const dropdownRect = this.dropdown.getBoundingClientRect();
        const optionRect = option.getBoundingClientRect();

        if (optionRect.bottom > dropdownRect.bottom) {
            this.dropdown.scrollTop += optionRect.bottom - dropdownRect.bottom;
        } else if (optionRect.top < dropdownRect.top) {
            this.dropdown.scrollTop -= dropdownRect.top - optionRect.top;
        }
    }

    getVisibleOptions() {
        // Get all option elements that are not in option groups
        const directOptions = Array.from(this.optionsList.querySelectorAll('li[role="option"]'));

        // Get all option elements that are in option groups
        const groupOptions = Array.from(this.optionsList.querySelectorAll('li > ul > li[role="option"]'));

        // Combine and return all options
        return [...directOptions, ...groupOptions];
    }

    getSelectedOptionLabels() {
        if (!Array.isArray(this.state) || this.state.length === 0) {
            return [];
        }

        const labels = [];

        if (Array.isArray(this.options)) {
            // New format: array of objects
            for (const value of this.state) {
                // Search in flat options
                for (const option of this.options) {
                    if (option.options && Array.isArray(option.options)) {
                        // Search in option group
                        for (const groupOption of option.options) {
                            if (groupOption.value === value) {
                                labels.push(groupOption.label);
                                break;
                            }
                        }
                    } else if (option.value === value) {
                        labels.push(option.label);
                        break;
                    }
                }
            }
        } else if (typeof this.options === 'object' && this.options !== null) {
            // Legacy format: object with key-value pairs
            for (const value of this.state) {
                // Search in flat options
                if (this.options[value] && typeof this.options[value] !== 'object') {
                    labels.push(this.options[value]);
                    continue;
                }

                // Search in option groups
                let found = false;
                for (const [groupName, groupOptions] of Object.entries(this.options)) {
                    if (typeof groupOptions === 'object' && !Array.isArray(groupOptions) && groupOptions !== null) {
                        if (groupOptions[value]) {
                            labels.push(groupOptions[value]);
                            found = true;
                            break;
                        }
                    }
                }

                // If not found, use the value as fallback
                if (!found) {
                    labels.push(value);
                }
            }
        }

        return labels;
    }

    handleSearch(event) {
        const query = event.target.value.trim().toLowerCase();
        this.searchQuery = query;

        // Clear any existing timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        if (query === '') {
            // If query is empty, restore original options
            this.options = JSON.parse(JSON.stringify(this.originalOptions));
            this.renderOptions();
            return;
        }

        // If getSearchResultsUsing is provided and hasDynamicSearchResults is true, use it to get search results from backend
        if (this.getSearchResultsUsing && typeof this.getSearchResultsUsing === 'function' && this.hasDynamicSearchResults) {
            // Set a new timeout to debounce the search for server-side search
            this.searchTimeout = setTimeout(async () => {
                try {
                    // Show searching state
                    this.showLoadingState(true);

                    // Get search results from backend
                    const results = await this.getSearchResultsUsing(query);

                    // Update options with search results
                    this.options = results;

                    // Hide loading state and render options
                    this.hideLoadingState();
                    this.renderOptions();

                    // Reevaluate dropdown position after search results are updated
                    if (this.isOpen) {
                        this.positionDropdown();
                    }

                    // If no results found, show "No results" message
                    if ((Array.isArray(this.options) && this.options.length === 0) ||
                        (typeof this.options === 'object' && Object.keys(this.options).length === 0)) {
                        this.showNoResultsMessage();
                    }
                } catch (error) {
                    console.error('Error fetching search results:', error);

                    // Hide loading state and restore original options
                    this.hideLoadingState();
                    this.options = JSON.parse(JSON.stringify(this.originalOptions));
                    this.renderOptions();
                }
            }, this.searchDebounce);
        } else {
            // Filter options locally without debounce
            this.filterOptions(query);
        }
    }

    showLoadingState(isSearching = false) {
        // Clear options list
        this.optionsList.innerHTML = '';

        // Add loading message
        const loadingItem = document.createElement('li');
        loadingItem.className = 'fi-select-loading';
        loadingItem.textContent = isSearching ? this.searchingMessage : this.loadingMessage;
        this.optionsList.appendChild(loadingItem);
    }

    hideLoadingState() {
        // Remove loading message
        const loadingItem = this.optionsList.querySelector('.fi-select-loading');
        if (loadingItem) {
            loadingItem.remove();
        }
    }

    showNoResultsMessage() {
        // Clear options list if not already empty
        if (this.optionsList.children.length > 0) {
            this.optionsList.innerHTML = '';
        }

        // Add "No results" message
        const noResultsItem = document.createElement('li');
        noResultsItem.className = 'fi-select-no-results';
        noResultsItem.textContent = this.noSearchResultsMessage;
        this.optionsList.appendChild(noResultsItem);
    }

    filterOptions(query) {
        if (Array.isArray(this.originalOptions)) {
            // New format: array of objects
            const filteredOptions = [];

            for (const option of this.originalOptions) {
                if (option.options && Array.isArray(option.options)) {
                    // This is an option group
                    const filteredGroupOptions = option.options.filter(groupOption =>
                        groupOption.label.toLowerCase().includes(query)
                    );

                    if (filteredGroupOptions.length > 0) {
                        filteredOptions.push({
                            label: option.label,
                            options: filteredGroupOptions
                        });
                    }
                } else if (option.label.toLowerCase().includes(query)) {
                    // This is a regular option
                    filteredOptions.push(option);
                }
            }

            this.options = filteredOptions;
        } else if (typeof this.originalOptions === 'object' && this.originalOptions !== null) {
            // Legacy format: object with key-value pairs
            const filteredOptions = {};

            for (const [key, value] of Object.entries(this.originalOptions)) {
                if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
                    // This is an option group
                    const filteredGroupOptions = {};
                    let hasFilteredOptions = false;

                    for (const [groupKey, groupValue] of Object.entries(value)) {
                        if (String(groupValue).toLowerCase().includes(query)) {
                            filteredGroupOptions[groupKey] = groupValue;
                            hasFilteredOptions = true;
                        }
                    }

                    if (hasFilteredOptions) {
                        filteredOptions[key] = filteredGroupOptions;
                    }
                } else if (String(value).toLowerCase().includes(query)) {
                    // This is a regular option
                    filteredOptions[key] = value;
                }
            }

            this.options = filteredOptions;
        }

        // Render filtered options
        this.renderOptions();

        // If no options found, show "No results" message
        if ((Array.isArray(this.options) && this.options.length === 0) ||
            (typeof this.options === 'object' && Object.keys(this.options).length === 0)) {
            this.showNoResultsMessage();
        }

        // Reevaluate dropdown position after search results are updated
        if (this.isOpen) {
            this.positionDropdown();
        }
    }

    selectOption(value) {
        // If the select is disabled, don't allow selection
        if (this.isDisabled) {
            return;
        }

        if (this.isMultiple) {
            // For multiple selection
            let newState = Array.isArray(this.state) ? [...this.state] : [];

            if (newState.includes(value)) {
                // Remove value if already selected
                newState = newState.filter(v => v !== value);
            } else {
                // Check if maxItems limit has been reached
                if (this.maxItems && newState.length >= this.maxItems) {
                    // Show a message or alert about reaching the limit
                    if (this.maxItemsMessage) {
                        alert(this.maxItemsMessage);
                    }
                    return; // Don't add more items
                }

                // Add value if not already selected
                newState.push(value);
            }

            this.state = newState;

            // Update the display
            this.updateSelectedDisplay();

            // Re-render options to update selected state
            this.renderOptions();

            // Reevaluate dropdown position after options are removed
            if (this.isOpen) {
                this.positionDropdown();
            }

            // Maintain focus within the container to prevent dropdown from closing
            if (this.isSearchable && this.searchInput) {
                // If searchable, focus the search input
                this.searchInput.focus();
            } else {
                // Otherwise, focus the first option or the selected option
                const options = this.getVisibleOptions();
                if (options.length > 0) {
                    // Find the index of the selected option
                    this.selectedIndex = -1;
                    if (Array.isArray(this.state) && this.state.length > 0) {
                        for (let i = 0; i < options.length; i++) {
                            if (this.state.includes(options[i].getAttribute('data-value'))) {
                                this.selectedIndex = i;
                                break;
                            }
                        }
                    }

                    // If no option is selected, focus the first option
                    if (this.selectedIndex === -1 && options.length > 0) {
                        this.selectedIndex = 0;
                    }

                    // Focus the selected option
                    if (this.selectedIndex >= 0) {
                        options[this.selectedIndex].classList.add('fi-select-option-focused');
                        options[this.selectedIndex].focus();
                    }
                }
            }
        } else {
            // For single selection
            this.state = value;

            // Update the display
            this.updateSelectedDisplay();

            // Re-render options to update selected state
            this.renderOptions();

            // Close dropdown but maintain focus on the select button
            this.closeDropdown();
            this.selectButton.focus();
        }

        // Notify of state change
        this.onStateChange(this.state);
    }

    disable() {
        if (this.isDisabled) return; // Already disabled

        this.isDisabled = true;
        this.applyDisabledState();

        // Close dropdown if it's open
        if (this.isOpen) {
            this.closeDropdown();
        }
    }

    enable() {
        if (!this.isDisabled) return; // Already enabled

        this.isDisabled = false;
        this.applyDisabledState();
    }

    applyDisabledState() {
        if (this.isDisabled) {
            // Add disabled attribute and class to the select button
            this.selectButton.setAttribute('disabled', 'disabled');
            this.selectButton.setAttribute('aria-disabled', 'true');
            this.selectButton.classList.add('fi-select-disabled');

            // If there are remove buttons in multiple mode, disable them
            if (this.isMultiple) {
                const removeButtons = this.container.querySelectorAll('.fi-select-badge-remove');
                removeButtons.forEach(button => {
                    button.setAttribute('disabled', 'disabled');
                    button.classList.add('fi-select-disabled');
                });
            }

            // If there's a remove button in single mode, disable it
            if (!this.isMultiple && this.canSelectPlaceholder) {
                const removeButton = this.container.querySelector('.fi-select-single-remove');
                if (removeButton) {
                    removeButton.setAttribute('disabled', 'disabled');
                    removeButton.classList.add('fi-select-disabled');
                }
            }

            // If there's a search input, disable it
            if (this.isSearchable && this.searchInput) {
                this.searchInput.setAttribute('disabled', 'disabled');
                this.searchInput.classList.add('fi-select-disabled');
            }
        } else {
            // Remove disabled attribute and class from the select button
            this.selectButton.removeAttribute('disabled');
            this.selectButton.removeAttribute('aria-disabled');
            this.selectButton.classList.remove('fi-select-disabled');

            // If there are remove buttons in multiple mode, enable them
            if (this.isMultiple) {
                const removeButtons = this.container.querySelectorAll('.fi-select-badge-remove');
                removeButtons.forEach(button => {
                    button.removeAttribute('disabled');
                    button.classList.remove('fi-select-disabled');
                });
            }

            // If there's a remove button in single mode, enable it
            if (!this.isMultiple && this.canSelectPlaceholder) {
                const removeButton = this.container.querySelector('.fi-select-single-remove');
                if (removeButton) {
                    removeButton.removeAttribute('disabled');
                    removeButton.classList.remove('fi-select-disabled');
                }
            }

            // If there's a search input, enable it
            if (this.isSearchable && this.searchInput) {
                this.searchInput.removeAttribute('disabled');
                this.searchInput.classList.remove('fi-select-disabled');
            }
        }
    }
}
