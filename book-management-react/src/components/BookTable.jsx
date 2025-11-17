import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

// BookTable.jsx (using @tanstack/react-table)
// Props:
// - books: Array of { id, title, author, year, genre, status }
// - onEdit(book)
// - onDelete(book)
// - initialPageSize (optional)

export default function BookTable({ books = [], onEdit = () => {}, onDelete = () => {}, initialPageSize = 8 }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pageSize, setPageSize] = useState(initialPageSize);

  const data = useMemo(() => books ?? [], [books]);

  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        cell: (info) => info.getValue(),
      },
      {
        header: "Author",
        accessorKey: "author",
        cell: (info) => info.getValue(),
      },
      {
        header: "Genre",
        accessorKey: "genre",
        cell: (info) => info.getValue() || "—",
      },
      {
        header: "Year",
        accessorKey: "year",
        cell: (info) => info.getValue() || "—",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (info) => {
          const s = (info.getValue() || "").toString();
          return (
            <span className={`px-2 py-1 rounded-full text-xs uppercase ${s.toLowerCase() === "completed" ? "bg-green-100 text-green-800" : s.toLowerCase() === "reading" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
              {s || "—"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="inline-flex gap-2">
            <button onClick={() => onEdit(row.original)} className="px-3 py-1 rounded-md border shadow-sm text-sm hover:bg-gray-50">Edit</button>
            <button onClick={() => onDelete(row.original)} className="px-3 py-1 rounded-md border shadow-sm text-sm text-red-600 hover:bg-red-50">Delete</button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting, columnVisibility, pagination: { pageIndex: 0, pageSize } },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false,
  });

  // Keep pageSize in sync with table API
  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize]);

  return (
    <div className="w-5/6 mx-auto my-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <input
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
              table.setGlobalFilter(e.target.value);
              table.setPageIndex(0);
            }}
            placeholder="Search by title, author, year or genre..."
            className="flex-1 px-3 py-2 border rounded-md shadow-sm"
          />
          <select
            value={pageSize}
            onChange={(e) => {
              const n = Number(e.target.value);
              setPageSize(n);
            }}
            className="px-2 py-2 border rounded-md"
          >
            {[5, 8, 12, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm">Columns:</label>
          <div className="flex gap-2 items-center">
            {table.getAllLeafColumns().map((col) => (
              col.id !== "actions" && (
                <label key={col.id} className="text-sm inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={col.getIsVisible()}
                    onChange={(e) => col.toggleVisibility(e.target.checked)}
                  />
                  <span className="capitalize">{col.id}</span>
                </label>
              )
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`px-4 py-3 text-left ${header.column?.getCanSort() ? "cursor-pointer select-none" : ""}`}
                    onClick={header.column?.getToggleSortingHandler()}
                  >
                    {flexRender(header.column?.columnDef.header ?? header.header, header.getContext())}
                    {header.column?.getIsSorted() ? (header.column.getIsSorted() === "asc" ? " ▲" : " ▼") : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            <AnimatePresence initial={false}>
              {table.getRowModel().rows.length === 0 ? (
                <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-gray-500">No books found.</td>
                </motion.tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="border-t last:border-b"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length}</div>

        <div className="flex items-center gap-2">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="px-2 py-1 rounded-md border disabled:opacity-50">First</button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-2 py-1 rounded-md border disabled:opacity-50">Prev</button>
          <div className="px-3 py-1 border rounded-md">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</div>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-2 py-1 rounded-md border disabled:opacity-50">Next</button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="px-2 py-1 rounded-md border disabled:opacity-50">Last</button>
        </div>
      </div>
    </div>
  );
}
