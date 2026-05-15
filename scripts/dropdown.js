const createChevronIcon = () => {
  const SVG_NS = "http://www.w3.org/2000/svg";

  const iconElem = document.createElementNS(SVG_NS, "svg");
  iconElem.classList.add("dropdown-chevron");
  iconElem.setAttribute("viewBox", "0 0 384 512");

  const pathElem = document.createElementNS(SVG_NS, "path");

  // Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com
  // License - https://fontawesome.com/license/free
  // Copyright 2026 Fonticons, Inc.
  pathElem.setAttribute(
    "d",
    "M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z",
  );
  pathElem.setAttribute("fill", "currentColor");

  iconElem.appendChild(pathElem);

  return iconElem;
};

export const createDropdown = ({
  dropdownElem,
  options,
  selectedValue,
  onChange,
}) => {
  const selectedElem = document.createElement("div");
  selectedElem.className = "dropdown-selected";

  const selectedTextElem = document.createElement("div");
  selectedTextElem.textContent = selectedValue;
  const chevronIcon = createChevronIcon();
  selectedElem.replaceChildren(selectedTextElem, chevronIcon);

  const dropdownListElem = document.createElement("div");
  dropdownListElem.className = "dropdown-list";
  for (const option of options) {
    const optionElem = document.createElement("div");
    optionElem.className =
      option === selectedValue ? "dropdown-option active" : "dropdown-option";
    optionElem.textContent = option;

    optionElem.addEventListener("click", (e) => {
      e.stopPropagation();

      selectedTextElem.textContent = option;

      for (const elem of dropdownListElem.children) {
        elem.classList.toggle("active", elem.textContent === option);
      }

      dropdownElem.classList.remove("open");
      onChange(option);
    });

    dropdownListElem.appendChild(optionElem);
  }

  dropdownElem.replaceChildren(selectedElem, dropdownListElem);

  dropdownElem.addEventListener("click", (e) => {
    dropdownElem.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!dropdownElem.contains(e.target)) {
      dropdownElem.classList.remove("open");
    }
  });
};
