/* eslint-disable */

import { useMemo, useCallback, useState, FC } from 'react';
import {
  Button,
  Table as TableContainer,
  Checkbox,
  Pagination,
  Group,
  Text,
  Paper,
} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  RowData,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { paymentTypes } from 'resources/payment';

import Thead from './thead';
import Tbody from './tbody';

import { useStyles } from './styles';

type SpacingSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface TableProps {
  data: RowData[];
  dataCount?: number;
  columns: ColumnDef<any>[];
  horizontalSpacing?: SpacingSizes;
  verticalSpacing?: SpacingSizes;
  rowSelection?: RowSelectionState;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  onPageChange?: (value: Record<string, any>) => void;
  perPage: number;
  page?: number;
  hasMore?: boolean;
  isStripeTable?: boolean;
}

const Table: FC<TableProps> = ({
  data,
  dataCount,
  columns,
  horizontalSpacing = 'xl',
  verticalSpacing = 'lg',
  rowSelection,
  setRowSelection,
  sorting,
  onSortingChange,
  onPageChange,
  page,
  perPage,
  hasMore,
  isStripeTable,
}) => {
  const { classes } = useStyles();

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: page || 1,
    pageSize: perPage,
  });
  const isSelectable = !!rowSelection && !!setRowSelection;
  const isSortable = useMemo(() => !!onSortingChange, [onSortingChange]);

  const selectableColumns: ColumnDef<unknown, any>[] = useMemo(() => [{
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        sx={(theme) => ({
          ...(table.getIsSomeRowsSelected() && {
            '& .mantine-Checkbox-input': {
              backgroundColor: theme.colors.blue[6],
              border: 'none',
            }
          }),
          color: theme.white,
        })}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }], []);

  const pagination = useMemo(() => ({
    pageIndex,
    pageSize,
  }), [pageIndex, pageSize]);

  const onPageChangeHandler = useCallback((currentPage: any, direction?: string) => {
    setPagination({ pageIndex: currentPage, pageSize });

    if (onPageChange) {
      onPageChange((prev: Record<string, any>) => ({ ...prev, page: currentPage, direction }));
    }
  }, [onPageChange, pageSize]);

  const table = useReactTable({
    data,
    columns: isSelectable ? [...selectableColumns, ...columns] : columns,
    state: {
      rowSelection,
      sorting,
      pagination,
    },
    onSortingChange,
    onPaginationChange: onPageChangeHandler,
    pageCount: dataCount ? Math.ceil((dataCount || 0) / perPage) : -1,
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const renderPagination = useCallback(() => {
    const { pageIndex } = table.getState().pagination;

    if (isStripeTable) {
      return (
        <>
          <Button
            className={classes.paginationButton}
            variant="white"
            disabled={pageIndex === 1}
            onClick={() => onPageChangeHandler(pageIndex - 1, paymentTypes.StripePageDirections.BACK)}
          >
            <IconChevronLeft />
          </Button>
          <Button
            className={classes.paginationButton}
            variant="white"
            disabled={!hasMore}
            onClick={() => onPageChangeHandler(pageIndex + 1, paymentTypes.StripePageDirections.FORWARD)}
          >
            <IconChevronRight />
          </Button>
        </>
      )
    }

    return (
      <Pagination
        total={table.getPageCount()}
        page={pageIndex}
        onChange={onPageChangeHandler}
        color="black"
      />
    )
  }, [hasMore, isStripeTable, onPageChangeHandler]);

  return (
    <>
      <Paper radius="sm" withBorder>
        <TableContainer
          horizontalSpacing={horizontalSpacing}
          verticalSpacing={verticalSpacing}
        >
          <Thead
            isSortable={isSortable}
            headerGroups={table.getHeaderGroups()}
            flexRender={flexRender}
          />
          <Tbody
            isSelectable={isSelectable}
            rows={table.getRowModel().rows}
            flexRender={flexRender}
          />
        </TableContainer>
      </Paper>
      <Group position="right">
        {dataCount && (
          <Text size="sm" color="dimmed">
            Showing
            {' '}
            <b>{table.getRowModel().rows.length}</b>
            {' '}
            of
            {' '}
            <b>{dataCount}</b>
            {' '}
            results
          </Text>
        )}
        {renderPagination()}
      </Group>
    </>
  );
};

export default Table;
