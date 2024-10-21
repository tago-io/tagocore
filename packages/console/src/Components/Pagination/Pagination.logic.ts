// Number of page buttons to display in narrow containers
const MIN_PAGES = 3;
// Number of page buttons to display in medium containers
const MID_PAGES = 5;
// Number of page buttons to display in wide containers
const MAX_PAGES = 7;

// Minimum width of the page buttons
const BUTTON_WIDTH = 30;
// Padding around the pagination buttons to give space around the edges
const PAGINATION_PADDING = 30;

/**
 * Get the amount of pages fitting in a container according to its width.
 *
 * @param paginationWidth Width of the container from the ref.
 */
const getPageAmount = (paginationWidth: number): number => {
  // Return max when ref is still undefined as most tables should be wide enough
  if (!paginationWidth) {
    return MAX_PAGES;
  }

  const usedWidth = paginationWidth;
  const availableWidth = usedWidth - PAGINATION_PADDING - 2 * BUTTON_WIDTH;
  const maxPageAmount = Math.floor(availableWidth / BUTTON_WIDTH);
  const pageAmount = Math.max(Math.min(maxPageAmount, MAX_PAGES), MIN_PAGES);

  if (pageAmount === MAX_PAGES || pageAmount === MIN_PAGES) {
    return pageAmount;
  }
    return MID_PAGES;
};

/**
 * Gets the array of page numbers and the separators according to the range
 * being displayed.
 *
 * @param amountOfPages Amount of pages.
 * @param paginationWidth Width of the container from the ref.
 * @param page Current page.
 */
const getPageList = (
  amountOfPages: number,
  paginationWidth: number,
  page: number
): Array<"..." | number> => {
  // we need to round them out because floating numbers can break the Array() call:
  let amountOfPagesRounded = Math.round(amountOfPages) || 1;

  if (Number.isNaN(amountOfPagesRounded) || amountOfPagesRounded === Number.POSITIVE_INFINITY) {
    // extreme cases we will use at least one page
    amountOfPagesRounded = 1;
  }

  const pageNumbers = Array.from(Array(amountOfPagesRounded).keys()).map((pageIdx) => pageIdx + 1);

  const maxPages = getPageAmount(paginationWidth);

  // Get the pages with ellipsis separating the current page from the boundary
  // pages and sibling pages only amount of pages is bigger than space available
  if (amountOfPagesRounded > maxPages) {
    const lowerBound = maxPages - 2;
    const upperBound = amountOfPagesRounded - (maxPages - 3);

    const pageInLowerBound = page <= lowerBound;
    const pageInUpperBound = page >= upperBound;

    // Sibling pages are the page buttons around the current page
    const siblings = maxPages === MAX_PAGES ? 1 : 0;

    if (pageInLowerBound) {
      return [...pageNumbers.slice(0, lowerBound), "...", amountOfPagesRounded];
    }if (pageInUpperBound) {
      return [1, "...", ...pageNumbers.slice(upperBound - 1, amountOfPagesRounded)];
    }if (maxPages === MIN_PAGES) {
      return ["...", page, "..."];
    }
      return [
        1,
        "...",
        ...pageNumbers.slice(page - (1 + siblings), page + siblings),
        "...",
        amountOfPagesRounded,
      ];
  }

  return pageNumbers;
};

export { MIN_PAGES, MID_PAGES, MAX_PAGES, getPageAmount, getPageList };
