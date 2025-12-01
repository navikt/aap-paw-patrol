'use client';

import { BodyShort, Box, Button, CopyButton, HStack, Label, VStack } from '@navikt/ds-react';
import { objectToMap } from 'components/drift/jobbtabell/JobbTabell';
import React, { useState } from 'react';
import { AppNavn, JobbInfo } from 'lib/services/driftService';
import { avbrytKjørendeJobb, rekjørJobb } from 'lib/clientApi';

export const FeilendeJobbPanel = ({ jobb, appNavn }: { jobb: JobbInfo; appNavn: AppNavn }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  async function onRekjørJobbClick(id: number) {
    setIsLoading(true);
    await rekjørJobb(appNavn, id)
      .then((res) => res.text())
      .then((msg) => setMessage(msg))
      .catch((err) => setMessage(err.message || 'Noe gikk galt'))
      .finally(() => setIsLoading(false));
  }

  async function onAvbrytJobbClick(id: number) {
    setIsLoading(true);
    await avbrytKjørendeJobb(appNavn, id)
      .then((res) => res.text())
      .then((msg) => setMessage(msg))
      .catch((err) => setMessage(err.message || 'Noe gikk galt'))
      .finally(() => setIsLoading(false));
  }

  return (
    <Box borderWidth="1" borderColor="border-divider" borderRadius="large" padding="4">
      <VStack gap="4">
        <HStack gap="4" justify="space-between">
          <HStack gap="8">
            <VStack gap="4">
              <div>
                <Label>Type</Label>
                <BodyShort>{jobb.type}</BodyShort>
              </div>
              <div>
                <Label>Antall feilende forsøk</Label>
                <BodyShort>{jobb.antallFeilendeForsøk}</BodyShort>
              </div>
            </VStack>

            <VStack gap="4">
              <div>
                <Label>Status</Label>
                <BodyShort>{jobb.status}</BodyShort>
              </div>

              <div>
                <Label>ID</Label>
                <BodyShort>{jobb.id}</BodyShort>
              </div>
            </VStack>

            {jobb.opprettetTidspunkt && (
              <div>
                <Label>Opprettet tidspunkt</Label>
                <BodyShort>{jobb.opprettetTidspunkt}</BodyShort>
              </div>
            )}
          </HStack>

          <div>
            <HStack justify={'end'} gap={'4'}>
              <Button loading={isLoading} onClick={() => onRekjørJobbClick(jobb.id)}>
                Rekjør
              </Button>
              <Button loading={isLoading} onClick={() => onAvbrytJobbClick(jobb.id)}>
                Avbryt
              </Button>
            </HStack>

            {message && <BodyShort>{message}</BodyShort>}
          </div>
        </HStack>

        <div>
          <Box
            background="surface-warning-subtle"
            borderColor="border-warning"
            borderRadius="large"
            borderWidth="1"
            padding="4"
          >
            <HStack gap="4">
              <Label>Feilmelding</Label>
              {jobb.feilmelding && <CopyButton copyText={jobb.feilmelding} text="Kopier feilmelding" size="xsmall" />}
            </HStack>

            <pre style={{ fontSize: 'small', whiteSpace: 'pre-wrap', maxHeight: '20rem', overflow: 'scroll' }}>
              {jobb.feilmelding}
            </pre>
          </Box>
        </div>

        {[...objectToMap(jobb.metadata)].map(([key, value]) => {
          return (
            <div key={key}>
              <Label>{key}</Label>
              <BodyShort>{value}</BodyShort>
            </div>
          );
        })}
      </VStack>
    </Box>
  );
};
