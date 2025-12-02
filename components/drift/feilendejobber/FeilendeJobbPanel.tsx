'use client';

import { Alert, BodyShort, Box, Button, CopyButton, HStack, Label, Modal, VStack } from '@navikt/ds-react';
import { objectToMap } from 'components/drift/jobbtabell/JobbTabell';
import React, { useState } from 'react';
import { AppNavn, JobbInfo } from 'lib/services/driftService';
import { avbrytKjørendeJobb, rekjørJobb } from 'lib/clientApi';
import { format } from 'date-fns';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';

export const FeilendeJobbPanel = ({ jobb, appNavn }: { jobb: JobbInfo; appNavn: AppNavn }) => {
  const [visAvbrytModal, setVisAvbrytModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  async function onRekjørJobbClick(id: number) {
    setError(undefined);
    setIsLoading(true);
    await rekjørJobb(appNavn, id)
      .then((res) => res.text())
      .then((msg) => setMessage(msg))
      .catch((err) => setError(err.message || 'Noe gikk galt'))
      .finally(() => setIsLoading(false));
  }

  async function onAvbrytJobbClick(id: number) {
    setError(undefined);
    setIsLoading(true);
    await avbrytKjørendeJobb(appNavn, id)
      .then((res) => res.text())
      .then((msg) => setMessage(msg))
      .catch((err) => setError(err.message || 'Noe gikk galt'))
      .finally(() => setIsLoading(false));
  }

  return (
    <Box borderWidth="1" borderColor="border-divider" borderRadius="large" padding="4">
      <VStack gap="4">
        <HStack gap="4" justify="space-between">
          <VStack gap="4">
            <HStack gap="8">
              <div>
                <Label size="small">ID</Label>
                <BodyShort size="small">{jobb.id}</BodyShort>
              </div>
              <div>
                <Label size="small">Type</Label>
                <BodyShort size="small">{jobb.type}</BodyShort>
              </div>
              <div>
                <Label size="small">Forsøk</Label>
                <BodyShort size="small">{jobb.antallFeilendeForsøk}</BodyShort>
              </div>
              <div>
                <Label size="small">Opprettet tidspunkt</Label>
                <BodyShort size="small">
                  {jobb.opprettetTidspunkt ? format(jobb.opprettetTidspunkt, 'dd.MM.yyyy HH:mm:ss') : '-'}
                </BodyShort>
              </div>
            </HStack>

            <HStack gap="4">
              {[...objectToMap(jobb.metadata)].map(([key, value]) => {
                return (
                  <div key={key}>
                    <Label size="small">{key}</Label>
                    <CopyButton size="small" copyText={value} text={value} activeText={`Kopierte ${key}`} />
                  </div>
                );
              })}
            </HStack>
          </VStack>

          <VStack gap="4">
            <HStack justify={'end'} gap={'4'}>
              <Button loading={isLoading} onClick={() => onRekjørJobbClick(jobb.id)}>
                Rekjør
              </Button>
              <Button loading={isLoading} onClick={() => setVisAvbrytModal(true)} variant="danger">
                Avbryt
              </Button>
            </HStack>

            {error && (
              <Alert variant="error" size="small">
                {error}
              </Alert>
            )}
            {message && (
              <Alert variant="info" size="small">
                {message}
              </Alert>
            )}
          </VStack>
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
      </VStack>

      <Modal
        open={visAvbrytModal}
        header={{
          heading: `Avbryt jobb (ID: ${jobb.id})`,
          icon: <ExclamationmarkTriangleIcon fontSize={'inherit'} />,
        }}
        onClose={() => {
          setVisAvbrytModal(false);
        }}
        onBeforeClose={() => {
          setVisAvbrytModal(false);
          return true;
        }}
      >
        <Modal.Body>
          <BodyShort spacing>Er du sikker på at du vil avbryte denne jobben?</BodyShort>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={() => setVisAvbrytModal(false)}>
            Nei, gå tilbake
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={async () => {
              await onAvbrytJobbClick(jobb.id);

              setVisAvbrytModal(false);
            }}
          >
            Ja, avbryt jobb
          </Button>
        </Modal.Footer>
      </Modal>
    </Box>
  );
};
