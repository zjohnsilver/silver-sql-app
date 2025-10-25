'use client';

import { useMemo } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Download } from '@mui/icons-material';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styled from 'styled-components';
import { exportToCSV } from '@/lib/utils';
import type { QueryResultSelect } from '@/types';

const TableContainer = styled(Paper)`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderBar = styled(Box)`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GridContainer = styled(Box)`
  flex: 1;
  overflow: hidden;
`;

const Cell = styled.div<{ isHeader?: boolean }>`
  padding: 8px 12px;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: ${props => props.isHeader ? '#f5f5f5' : 'white'};
  font-weight: ${props => props.isHeader ? 600 : 400};
  display: flex;
  align-items: center;
`;

interface ResultsTableProps {
  result: QueryResultSelect;
}

export default function ResultsTable({ result }: ResultsTableProps) {
  const { columns, rows } = result;
  
  const columnWidth = 150;
  const rowHeight = 40;
  const headerHeight = 40;

  const handleExport = () => {
    const columnNames = columns.map(col => col.name);
    exportToCSV(columnNames, rows);
  };

  const CellRenderer = ({ columnIndex, rowIndex, style }: any) => {
    const isHeader = rowIndex === 0;
    const content = isHeader 
      ? columns[columnIndex].name 
      : rows[rowIndex - 1][columnIndex];
    
    return (
      <div style={style}>
        <Cell isHeader={isHeader} title={String(content)}>
          {content === null ? <em>NULL</em> : String(content)}
        </Cell>
      </div>
    );
  };

  return (
    <TableContainer elevation={0}>
      <HeaderBar>
        <Typography variant="body2" color="text.secondary">
          {result.total_rows.toLocaleString()} rows
          {result.has_more && ' (limited)'}
        </Typography>
        <Button
          size="small"
          startIcon={<Download />}
          onClick={handleExport}
          variant="outlined"
        >
          Export CSV
        </Button>
      </HeaderBar>
      
      <GridContainer>
        <AutoSizer>
          {({ height, width }) => (
            <Grid
              columnCount={columns.length}
              columnWidth={columnWidth}
              height={height}
              rowCount={rows.length + 1} // +1 for header
              rowHeight={rowHeight}
              width={width}
            >
              {CellRenderer}
            </Grid>
          )}
        </AutoSizer>
      </GridContainer>
    </TableContainer>
  );
}

