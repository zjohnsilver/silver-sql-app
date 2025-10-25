'use client';

import { Box, Typography, Alert, Paper, Divider } from '@mui/material';
import styled from 'styled-components';
import { formatDuration } from '@/lib/utils';
import type { QueryResult, QueryError } from '@/types';

const MessagesContainer = styled(Paper)`
  padding: 16px;
  height: 100%;
  overflow-y: auto;
`;

const MessageRow = styled(Box)`
  margin-bottom: 12px;
`;

interface MessagesPanelProps {
  result?: QueryResult;
  error?: QueryError;
}

export default function MessagesPanel({ result, error }: MessagesPanelProps) {
  if (error) {
    return (
      <MessagesContainer elevation={0}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Error: {error.code}
          </Typography>
          <Typography variant="body2">{error.message}</Typography>
          {error.hint && (
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              Hint: {error.hint}
            </Typography>
          )}
        </Alert>
      </MessagesContainer>
    );
  }

  if (!result) {
    return (
      <MessagesContainer elevation={0}>
        <Typography variant="body2" color="text.secondary">
          No messages yet. Execute a query to see results.
        </Typography>
      </MessagesContainer>
    );
  }

  return (
    <MessagesContainer elevation={0}>
      <MessageRow>
        <Typography variant="subtitle2" fontWeight={600}>
          Execution Summary
        </Typography>
      </MessageRow>

      <MessageRow>
        <Typography variant="body2">
          <strong>Statement Type:</strong> {result.type === 'select' ? 'SELECT' : result.type === 'non_select' ? result.statement_type.toUpperCase() : 'UNKNOWN'}
        </Typography>
      </MessageRow>

      <MessageRow>
        <Typography variant="body2">
          <strong>Duration:</strong> {formatDuration(result.duration_ms)}
        </Typography>
      </MessageRow>

      {result.type === 'select' && (
        <>
          <MessageRow>
            <Typography variant="body2">
              <strong>Rows Returned:</strong> {result.total_rows.toLocaleString()}
            </Typography>
          </MessageRow>
          {result.has_more && (
            <MessageRow>
              <Alert severity="info" sx={{ py: 0.5 }}>
                Results limited by max rows setting
              </Alert>
            </MessageRow>
          )}
        </>
      )}

      {result.type === 'non_select' && (
        <>
          <MessageRow>
            <Typography variant="body2">
              <strong>Rows Affected:</strong> {result.rows_affected.toLocaleString()}
            </Typography>
          </MessageRow>

          {result.messages && result.messages.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <MessageRow>
                <Typography variant="subtitle2" fontWeight={600}>
                  Messages
                </Typography>
                {result.messages.map((msg, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mt: 0.5 }}>
                    • {msg}
                  </Typography>
                ))}
              </MessageRow>
            </>
          )}

          {result.warnings && result.warnings.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <MessageRow>
                <Alert severity="warning">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Warnings
                  </Typography>
                  {result.warnings.map((warning, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mt: 0.5 }}>
                      • {warning}
                    </Typography>
                  ))}
                </Alert>
              </MessageRow>
            </>
          )}
        </>
      )}
    </MessagesContainer>
  );
}

