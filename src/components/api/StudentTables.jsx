/* eslint-disable react/prop-types */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { DataTablePagination } from "../reuseable/DataTablePagination"

import { ArrowUpDown, MoreHorizontal, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import SmallLoader from "../styles/SmallLoader";
import { DeleteIcon, EyeIcon, ReactivateIcon } from "../Icons";
import { Link } from "react-router-dom";

const StudentTables = () => {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/students");

        setStudents(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch students");
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: "student_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 hover:underline-offset-4 hover:underline"
          >
            Student ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      id: "fullName",
      header: "Name",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "civilStatus",
      header: "Civil Status",
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ cell }) => {
        return cell.getValue().toString().split("T")[0];
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ cell }) => {
        return (
          <span
            className={`inline-flex rounded px-3 py-1 text-sm font-medium text-white ${
              cell.getValue() ? "bg-success" : "bg-danger"
            }`}
          >
            {cell.getValue() ? "Active" : "Inactive"}
          </span>
        );
      },
    },

    {
      header: "Actions",
      accessorFn: (row) => `${row.student_id} ${row.isActive}`,
      id: "actions",
      cell: ({ row }) => {
        return (  
          <div className=" flex items-center space-x-1.5">
            <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger aria-label="View Student">
                    <Link to={`/student/${row.getValue("student_id")}`} className="hover:text-primary p-2 inline-block">
                      <EyeIcon />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Student</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            {row.getValue("isActive") ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="hover:text-primary p-2" aria-label="Delete Student">
                    <DeleteIcon />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Student</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="hover:text-primary p-2" aria-label="Reactivate Student">
                    <ReactivateIcon />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reactivate Student</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        error={error}
      />
    </>
  );
};

const DataTable = ({ data, columns, loading, error }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <div className="flex items-center gap-5 py-4">
        <Input
          placeholder="Search by ID ..."
          value={table.getColumn("student_id")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("student_id")?.setFilterValue(event.target.value)
          }
          className="h-[3em] max-w-xs !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black shadow-default !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary"
        />

        <Input
          placeholder="Search by Name ..."
          value={table.getColumn("fullName")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("fullName")?.setFilterValue(event.target.value)
          }
          className="h-[3em] max-w-xs !rounded !border-[1.5px] !border-stroke bg-white !px-5 !py-3 text-[1rem] font-medium text-black shadow-default !outline-none !transition focus:!border-primary active:!border-primary disabled:cursor-default disabled:!bg-whiter dark:!border-form-strokedark dark:!bg-form-input dark:!text-white dark:focus:!border-primary"
        />
      </div>

      <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <Table className="border border-stroke dark:border-strokedark">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-none bg-gray-2 dark:bg-meta-4"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="h-[0.5em] !border-none px-4 py-4 text-[1rem] font-medium text-black dark:text-white"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody
              className={`!divide-y !divide-stroke dark:!divide-strokedark ${loading || error ? "relative h-[7.5em]" : ""}`}
            >
              {loading ? (
                <TableRow className="border-none hover:!bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="absolute inline-flex h-24 w-full items-center justify-center gap-3 text-center text-2xl font-[500] text-black dark:text-white"
                  >
                    <SmallLoader /> Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow className="border-none hover:!bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="absolute inline-flex h-24 w-full items-center justify-center gap-3 text-center text-2xl font-[500] text-red-500"
                  >
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, i) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`${i === 0 ? "border-none" : ""}`}
                  >
                    {row.getVisibleCells().map((cell, i) => (
                      <TableCell
                        key={cell.id}
                        className={` ${i === 0 ? "pl-[1em]" : ""} text-[1rem] text-black dark:border-strokedark dark:text-white`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-none hover:!bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-2xl font-[500] "
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="primary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className = " bg-primary text-white hover:opacity-85"
          >
            <ArrowLeftIcon className=" mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className = " bg-primary text-white hover:opacity-85"
          >
            Next
            <ArrowRightIcon className=" ml-1 h-4 w-4" />
          </Button>
        </div> */}

        <div className=" w-full flex py-4 items-center justify-end">
          <DataTablePagination table={table} />
        </div>

        
      </div>
    </>
  );
};

export default StudentTables;
