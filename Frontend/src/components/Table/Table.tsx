import { useMemo, useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button, Input } from "@kofile/gds-react";
import {
  SkipForward,
  SkipBack,
  ArrowFatLinesUp,
  ArrowFatLinesDown,
  MagnifyingGlass,
  ArrowsDownUp,
} from "@phosphor-icons/react";
import { Cols, ReactTableProps } from "./type";
import { EditableCell } from "./EditableCell";

const Table = <T,>({ data }: ReactTableProps<T>) => {
  const [dataTable, setData] = useState<T[]>(data);

  console.log(data);

  const cols = useMemo<ColumnDef<T>[]>(
    () => [
      {
        header: "USUARIO",
        accessorKey: "username",
      },
      {
        header: "NOMBRE COMPLETO",
        size: 225,
        accessorKey: "fullName",
      },
      {
        header: "EMAIL",
        accessorKey: "email",
      },
      {
        header: "DIRECCIÓN",
        accessorKey: "address",
        // cell: EditableCell,
      },
      {
        header: "ESTADO",
        accessorKey: "status",
      },
    ],
    []
  );

  //state to sort
  const [sorting, setSorting] = useState<SortingState>([]);
  //state to filter
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data: dataTable,
    columns: cols,
    state: {
      sorting,
      globalFilter: filtering,
    },
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) =>
        setData((prev: T[]) =>
          prev.map((row: T, index: number) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        ),
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    columnResizeMode: "onChange",
  });

  console.log(table);

  return (
    <div>
      <div className="flex mb-2">
        {/* <Input altbackground={true}>
          <Input.LeftIcon>
            <MagnifyingGlass size={25} />
          </Input.LeftIcon>
          <Input.Input
            placeholder="Search"
            value={filtering}
            onChange={(e: any) => setFiltering(e.target.value)}
          />
        </Input> */}
      </div>
      <table style={{ width: `${table.getCenterTotalSize()}` }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ position: "relative", width: `${header.getSize()}` }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanSort() && (
                    <ArrowsDownUp
                      style={{ cursor: "pointer" }}
                      size={20}
                      onClick={header.column.getToggleSortingHandler()}
                    />
                  )}
                  {
                    {
                      asc: <ArrowFatLinesUp size={20} />,
                      desc: <ArrowFatLinesDown size={20} />,
                    }[(header.column.getIsSorted() as string) ?? null]
                  }
                  {header.column.getCanResize() && (
                    <div
                      onDoubleClick={() => header.column.resetSize()}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${
                        header.column.getIsResizing() ? "isResizing" : ""
                      }`}
                    ></div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ width: cell.column.getSize() }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((footer) => (
                <th key={footer.id}>
                  {flexRender(
                    footer.column.columnDef.footer,
                    footer.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="container mt-2">
        <div className="row d-flex justify-content-between">
          <Button
            size="lg"
            background="outlined"
            variant="neutral"
            className="col-2"
            onClick={() => table.setPageIndex(0)}
          >
            Primera página
          </Button>
          <Button
            size="lg"
            background="outlined"
            variant="neutral"
            className="col-2"
            onClick={() => table.previousPage()}
          >
            Página previa<SkipBack size={20} />
          </Button>
          <Button
            size="lg"
            background="outlined"
            variant="neutral"
            className="col-2"
            onClick={() => table.nextPage()}
          >
            Next Page <SkipForward size={20} />
          </Button>
          <Button
            size="lg"
            background="outlined"
            variant="neutral"
            className="col-2"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            Última página
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Table;
