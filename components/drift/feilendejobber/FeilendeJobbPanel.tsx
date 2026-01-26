'use client';

import { Alert, BodyShort, Box, Button, CopyButton, Heading, HStack, Label, Modal, VStack } from '@navikt/ds-react';
import { objectToMap } from 'components/drift/jobbtabell/JobbTabell';
import React, { useEffect, useState } from 'react';
import { AppNavn, JobbInfo } from 'lib/services/driftService';
import { avbrytKjørendeJobb, rekjørJobb } from 'lib/clientApi';
import { format } from 'date-fns';
import { ExclamationmarkTriangleIcon, LinkIcon } from '@navikt/aksel-icons';
import Link from 'next/link';

export const FeilendeJobbPanel = ({ jobb, appNavn }: { jobb: JobbInfo; appNavn: AppNavn }) => {
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, [])

  useEffect(() => {
    if (mounted && window.location.hash === `#${jobb.id}`) {
      const el = document.getElementById(jobb.id.toString());
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [mounted, jobb.id]);

  return (
    <Box borderWidth="1" borderColor="neutral-subtle" borderRadius="12" padding="space-16" id={jobb.id.toString()}>
      <VStack gap="space-16">
        <HStack gap="space-16" justify="space-between">
          <Heading size="medium">
            <HStack gap="space-8" align="center">
              <Link href={`#${jobb.id}`}>Jobb {jobb.id}</Link>
              {mounted && (
                <CopyButton
                  icon={<LinkIcon aria-hidden />}
                  size="small"
                  text="Kopier lenke til jobb"
                  activeText="Lenken er kopiert"
                  copyText={`${window.location.origin}${window.location.pathname}#${jobb.id}`}
                />
              )}
            </HStack>
          </Heading>

          <VStack gap="space-16">
            <HStack justify={'end'} gap="space-16">
              <Button size="small" loading={isLoading} onClick={() => onRekjørJobbClick(jobb.id)}>
                Rekjør
              </Button>
              <Button size="small" loading={isLoading} onClick={() => setVisAvbrytModal(true)} variant="danger">
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

        <HStack gap="space-16" justify="space-between">
          <VStack gap="space-16">
            <HStack gap="space-32">
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

              {[...objectToMap(jobb.metadata)].map(([key, value]) => {
                return (
                  <div key={key}>
                    <Label size="small">{key}</Label>
                    <CopyButton size="xsmall" copyText={value} text={value} activeText={`Kopierte ${key}`} />
                  </div>
                );
              })}
            </HStack>
          </VStack>
        </HStack>

        <div>
          <Box
            background="warning-soft"
            borderColor="warning-subtle"
            borderRadius="12"
            borderWidth="1"
            padding="space-16"
          >
            <HStack gap="space-16">
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
