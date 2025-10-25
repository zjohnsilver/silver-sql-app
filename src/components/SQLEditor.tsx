'use client';

import { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Button, TextField, Stack } from '@mui/material';
import { PlayArrow, Cancel, Clear } from '@mui/icons-material';
import styled from 'styled-components';

const EditorContainer = styled(Box)`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const ControlsBar = styled(Stack)`
  padding: 12px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
`;

interface SQLEditorProps {
  sql: string;
  onSqlChange: (sql: string) => void;
  onExecute: () => void;
  onCancel: () => void;
  onClear: () => void;
  isExecuting: boolean;
  maxRows: number;
  onMaxRowsChange: (value: number) => void;
  timeout: number;
  onTimeoutChange: (value: number) => void;
  disabled?: boolean;
}

export default function SQLEditor({
  sql,
  onSqlChange,
  onExecute,
  onCancel,
  onClear,
  isExecuting,
  maxRows,
  onMaxRowsChange,
  timeout,
  onTimeoutChange,
  disabled = false,
}: SQLEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Add keyboard shortcut for execution
    editor.addCommand(
      window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter,
      () => {
        if (!isExecuting && !disabled) {
          onExecute();
        }
      }
    );
  };

  return (
    <EditorContainer>
      <ControlsBar direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          color="primary"
          startIcon={<PlayArrow />}
          onClick={onExecute}
          disabled={isExecuting || disabled || !sql.trim()}
          size="small"
        >
          Run (Ctrl+Enter)
        </Button>
        
        <Button
          variant="outlined"
          color="error"
          startIcon={<Cancel />}
          onClick={onCancel}
          disabled={!isExecuting}
          size="small"
        >
          Cancel
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={onClear}
          disabled={isExecuting}
          size="small"
        >
          Clear
        </Button>
        
        <TextField
          label="Max Rows"
          type="number"
          value={maxRows}
          onChange={(e) => onMaxRowsChange(parseInt(e.target.value) || 5000)}
          size="small"
          sx={{ width: 120 }}
          disabled={isExecuting}
        />
        
        <TextField
          label="Timeout (s)"
          type="number"
          value={timeout}
          onChange={(e) => onTimeoutChange(parseInt(e.target.value) || 30)}
          size="small"
          sx={{ width: 120 }}
          disabled={isExecuting}
        />
      </ControlsBar>
      
      <Editor
        height="300px"
        defaultLanguage="sql"
        value={sql}
        onChange={(value) => onSqlChange(value || '')}
        onMount={handleEditorDidMount}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          readOnly: disabled,
        }}
      />
    </EditorContainer>
  );
}

