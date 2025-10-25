'use client';

import { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, Chip } from '@mui/material';
import styled from 'styled-components';
import { api } from '@/lib/api';
import { debounce } from '@/lib/utils';
import type { Client } from '@/types';

const StyledAutocomplete = styled(Autocomplete)`
  min-width: 300px;
` as typeof Autocomplete;

interface ClientSelectorProps {
  onClientSelect: (client: Client | null) => void;
  selectedClient: Client | null;
}

export default function ClientSelector({ onClientSelect, selectedClient }: ClientSelectorProps) {
  const [options, setOptions] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const searchClients = useCallback(
    debounce(async (search: string) => {
      if (!search) {
        setOptions([]);
        return;
      }
      
      setLoading(true);
      try {
        const results = await api.searchClients(search);
        setOptions(results);
      } catch (error) {
        console.error('Error searching clients:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchClients(inputValue);
  }, [inputValue, searchClients]);

  return (
    <StyledAutocomplete
      options={options}
      loading={loading}
      value={selectedClient}
      onChange={(_, newValue) => onClientSelect(newValue)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <div>
            <div>{option.name}</div>
            {option.tag && (
              <Chip label={option.tag} size="small" sx={{ ml: 1 }} />
            )}
          </div>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Client"
          placeholder="Search for a client..."
          variant="outlined"
          size="small"
        />
      )}
      noOptionsText="No clients found"
    />
  );
}

