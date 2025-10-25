'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';
import styled from 'styled-components';
import ClientSelector from '@/components/ClientSelector';
import SQLEditor from '@/components/SQLEditor';
import ResultsTable from '@/components/ResultsTable';
import MessagesPanel from '@/components/MessagesPanel';
import { api } from '@/lib/api';
import { addRecentClient } from '@/lib/utils';
import type { Client, QueryResult, QueryError, ConnectionStatus } from '@/types';

const MainContainer = styled(Container)`
  padding-top: 24px;
  padding-bottom: 24px;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderBar = styled(Box)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EditorSection = styled(Box)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ResultsSection = styled(Box)`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TabPanel = styled(Box)`
  flex: 1;
  overflow: hidden;
`;

export default function Home() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ status: 'idle' });
  const [sql, setSql] = useState('');
  const [maxRows, setMaxRows] = useState(5000);
  const [timeout, setTimeout] = useState(30);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<QueryResult | undefined>();
  const [error, setError] = useState<QueryError | undefined>();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (selectedClient) {
      resolveConnection(selectedClient.id);
    } else {
      setConnectionStatus({ status: 'idle' });
    }
  }, [selectedClient]);

  const resolveConnection = async (clientId: string) => {
    setConnectionStatus({ status: 'resolving' });
    try {
      const response = await api.resolveConnection(clientId);
      setConnectionStatus({ status: 'resolved', message: response.message });
      addRecentClient(clientId);
    } catch (err: any) {
      setConnectionStatus({
        status: 'failed',
        message: err.response?.data?.message || 'Failed to resolve connection',
      });
    }
  };

  const handleExecute = async () => {
    if (!selectedClient || !sql.trim()) return;

    setIsExecuting(true);
    setError(undefined);
    setResult(undefined);

    try {
      const queryResult = await api.executeQuery({
        client_id: selectedClient.id,
        sql: sql.trim(),
        options: {
          max_rows: maxRows,
          timeout_seconds: timeout,
        },
      });

      setResult(queryResult);
      setActiveTab(queryResult.type === 'select' ? 0 : 1);
    } catch (err: any) {
      const errorData = err.response?.data || {};
      setError({
        code: errorData.code || 'UNKNOWN_ERROR',
        message: errorData.message || 'An unexpected error occurred',
        hint: errorData.hint,
      });
      setActiveTab(1);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCancel = async () => {
    // TODO: Implement query cancellation with query ID tracking
    console.log('Cancel not yet implemented');
  };

  const handleClear = () => {
    setSql('');
    setResult(undefined);
    setError(undefined);
  };

  const getStatusChip = () => {
    const statusConfig = {
      idle: { label: 'No Client', color: 'default' as const },
      resolving: { label: 'Resolving...', color: 'warning' as const },
      resolved: { label: 'Connected', color: 'success' as const },
      failed: { label: 'Failed', color: 'error' as const },
    };

    const config = statusConfig[connectionStatus.status];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            Silver SQL Console
          </Typography>
        </Toolbar>
      </AppBar>

      <MainContainer maxWidth="xl">
        <HeaderBar>
          <ClientSelector
            selectedClient={selectedClient}
            onClientSelect={setSelectedClient}
          />
          {getStatusChip()}
          {connectionStatus.message && (
            <Typography variant="body2" color="text.secondary">
              {connectionStatus.message}
            </Typography>
          )}
        </HeaderBar>

        <EditorSection>
          <SQLEditor
            sql={sql}
            onSqlChange={setSql}
            onExecute={handleExecute}
            onCancel={handleCancel}
            onClear={handleClear}
            isExecuting={isExecuting}
            maxRows={maxRows}
            onMaxRowsChange={setMaxRows}
            timeout={timeout}
            onTimeoutChange={setTimeout}
            disabled={connectionStatus.status !== 'resolved'}
          />
        </EditorSection>

        <ResultsSection>
          {isExecuting ? (
            <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
              <CircularProgress />
              <Typography variant="body1" sx={{ ml: 2 }}>
                Running query...
              </Typography>
            </Box>
          ) : !result && !error ? (
            <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
              <Typography variant="body1" color="text.secondary">
                Select a client and enter a SQL query to get started.
              </Typography>
            </Box>
          ) : (
            <>
              <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
                <Tab label="Results" disabled={!result || result.type !== 'select'} />
                <Tab label="Messages" />
              </Tabs>
              <TabPanel>
                {activeTab === 0 && result && result.type === 'select' && (
                  <ResultsTable result={result} />
                )}
                {activeTab === 1 && <MessagesPanel result={result} error={error} />}
              </TabPanel>
            </>
          )}
        </ResultsSection>
      </MainContainer>
    </>
  );
}

