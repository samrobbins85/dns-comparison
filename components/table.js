import { useTable, usePagination } from "react-table";

export default function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  // Render the UI for your table
  return (
    <div className="grid grid-cols-1">
      <div className="flex justify-center p-4">
        <div>
          <table {...getTableProps()} className="table-fixed">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="w-1/4 p-2 border border-gray-500 border-solid"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className="p-2 border border-gray-400"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center p-4">
        <div>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className={`font-bold px-2 rounded  border border-gray-500 ${
              canPreviousPage
                ? "bg-gray-200 hover:bg-gray-400 "
                : "bg-gray-100 text-black text-opacity-25 cursor-default"
            }`}
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`font-bold px-2 rounded  border border-gray-500 ${
              canPreviousPage
                ? "bg-gray-200 hover:bg-gray-400 "
                : "bg-gray-100 text-black text-opacity-25 cursor-default"
            }`}
          >
            {"<"}
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`font-bold px-2 rounded  border border-gray-500 ${
              canNextPage
                ? "bg-gray-200 hover:bg-gray-400 "
                : "bg-gray-100 text-black text-opacity-25 cursor-default"
            }`}
          >
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className={`font-bold px-2 rounded  border border-gray-500 ${
              canNextPage
                ? "bg-gray-200 hover:bg-gray-400 "
                : "bg-gray-100 text-black text-opacity-25 cursor-default"
            }`}
          >
            {">>"}
          </button>
          <span>
            Page
            <strong className="px-2">
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <span>
            | Go to page:
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              className="mx-2 form-input"
              style={{ width: "100px" }}
            />
          </span>
          <select
            value={pageSize}
            className="form-select"
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
