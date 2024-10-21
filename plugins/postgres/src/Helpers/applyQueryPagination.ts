interface IQueryPagination {
  limit: number;
  offset: number;
}

/**
 * Retrieves the offset and limit of a query based on the page and amount
 * of records provided in the parameters.
 * @param {number} page The page of the query.
 * @param {amount} amount The amount of rows to be retrieved.
 */
function applyQueryPagination(page = -1, amount = 20): IQueryPagination {
  const amount_n = Number(amount) || 20;
  let pageNumber = Number(page) || -1;
  pageNumber = pageNumber < 0 ? 1 : pageNumber;

  if (page === null || pageNumber < 0) {
    return {
      limit: 0,
      offset: 0,
    };
  }

  return {
    limit: Number(amount_n),
    offset: pageNumber * amount_n - amount_n,
  };
}

export default applyQueryPagination;
