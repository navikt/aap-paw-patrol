'use client';

import { Box, CopyButton, Heading, HStack, Label, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function uuidToBase64(uuid: string): string {
  if (!UUID_REGEX.test(uuid)) {
    throw new Error('Ugyldig UUID-format. Forventet: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  }
  const hex = uuid.replace(/-/g, '');
  const bytes = [];
  for (let i = 0; i < 32; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16));
  }
  return btoa(String.fromCharCode(...bytes));
}

function base64ToUuid(base64: string): string {
  let decoded: string;
  try {
    decoded = atob(base64.trim());
  } catch {
    throw new Error('Ugyldig base64-streng.');
  }
  if (decoded.length !== 16) {
    throw new Error(`Base64-strengen dekoder til ${decoded.length} bytes, forventet 16.`);
  }
  const hex = Array.from(decoded)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export const ReferanseKonverter = () => {
  const [uuidInput, setUuidInput] = useState('');
  const [uuidResultat, setUuidResultat] = useState('');
  const [uuidFeil, setUuidFeil] = useState<string>();

  const [base64Input, setBase64Input] = useState('');
  const [base64Resultat, setBase64Resultat] = useState('');
  const [base64Feil, setBase64Feil] = useState<string>();

  const handleUuidChange = (value: string) => {
    setUuidInput(value);
    if (!value.trim()) {
      setUuidResultat('');
      setUuidFeil(undefined);
      return;
    }
    try {
      setUuidResultat(uuidToBase64(value.trim()));
      setUuidFeil(undefined);
    } catch (err) {
      setUuidResultat('');
      setUuidFeil(err instanceof Error ? err.message : String(err));
    }
  };

  const handleBase64Change = (value: string) => {
    setBase64Input(value);
    if (!value.trim()) {
      setBase64Resultat('');
      setBase64Feil(undefined);
      return;
    }
    try {
      setBase64Resultat(base64ToUuid(value.trim()));
      setBase64Feil(undefined);
    } catch (err) {
      setBase64Resultat('');
      setBase64Feil(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <VStack gap="space-16" marginBlock="space-32">
      <Heading size="large">Konverter behandlingsreferanse</Heading>

      <Box background="neutral-soft" padding="space-16" borderRadius="16">
        <VStack gap="space-12">
          <Heading size="small">UUID → Base64</Heading>
          <TextField
            label="Behandlingsreferanse (UUID)"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            value={uuidInput}
            onChange={(e) => handleUuidChange(e.target.value)}
            error={uuidFeil}
          />
          {uuidResultat && (
            <VStack gap="space-4">
              <Label>Base64-resultat</Label>
              <HStack gap="space-8" align="start">
                <Box
                  background="default"
                  borderRadius="8"
                  padding="space-8"
                  borderWidth="1"
                  borderColor="neutral-subtle"
                  style={{ fontFamily: 'monospace', wordBreak: 'break-all', flexGrow: 1 }}
                >
                  {uuidResultat}
                </Box>
                <CopyButton copyText={uuidResultat} size="small" />
              </HStack>
            </VStack>
          )}
        </VStack>
      </Box>

      <Box background="neutral-soft" padding="space-16" borderRadius="16">
        <VStack gap="space-12">
          <Heading size="small">Base64 → UUID</Heading>
          <TextField
            label="Base64-streng"
            placeholder="Base64-kodet behandlingsreferanse"
            value={base64Input}
            onChange={(e) => handleBase64Change(e.target.value)}
            error={base64Feil}
          />
          {base64Resultat && (
            <VStack gap="space-4">
              <Label>UUID-resultat</Label>
              <HStack gap="space-8" align="start">
                <Box
                  background="default"
                  borderRadius="8"
                  padding="space-8"
                  borderWidth="1"
                  borderColor="neutral-subtle"
                  style={{ fontFamily: 'monospace', wordBreak: 'break-all', flexGrow: 1 }}
                >
                  {base64Resultat}
                </Box>
                <CopyButton copyText={base64Resultat} size="small" />
              </HStack>
            </VStack>
          )}
        </VStack>
      </Box>
    </VStack>
  );
};
