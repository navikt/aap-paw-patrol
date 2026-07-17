import { Alert, BodyShort, Box, Button, Detail, HStack, Label, Tag, Textarea, VStack } from '@navikt/ds-react';
import { AppNavn, JobbKommentar } from 'lib/services/driftService';
import React, { useState } from 'react';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { leggTilKommentar } from 'lib/clientApi';

export const Kommentarfelt = ({
  jobbId,
  appNavn,
  kommentarer,
}: {
  jobbId: number;
  appNavn: AppNavn;
  kommentarer: JobbKommentar[];
}) => {
  const [nyKommentar, setNyKommentar] = useState('');
  const [kommentarLoading, setKommentarLoading] = useState(false);
  const [kommentarResult, setKommentarResult] = useState<{ success: boolean; message: string }>();

  async function onLeggTilKommentarClick(id: number) {
    if (!nyKommentar.trim()) return;
    setKommentarResult(undefined);
    setKommentarLoading(true);
    await leggTilKommentar(appNavn, id, nyKommentar.trim())
      .then(async (res) => {
        if (res.ok) {
          setNyKommentar('');
          setKommentarResult({ success: true, message: 'Kommentar lagt til' });
        } else {
          setKommentarResult({ success: false, message: await res.text() });
        }
      })
      .catch((err) => setKommentarResult({ success: false, message: err.message || 'Noe gikk galt' }))
      .finally(() => setKommentarLoading(false));
  }

  return (
    <div>
      <HStack gap="space-8" align="center" marginBlock="space-0 space-8">
        <Label size="small">Kommentarer</Label>
        {kommentarer.length > 0 && (
          <Tag variant="neutral" size="xsmall">
            {kommentarer.length}
          </Tag>
        )}
      </HStack>

      {kommentarer.length > 0 && (
        <VStack gap="space-4" marginBlock="space-0 space-12">
          {kommentarer.map((k, i) => (
            <Box
              key={i}
              background="neutral-soft"
              borderRadius="8"
              padding="space-12"
              borderWidth="0 0 0 4"
              borderColor="neutral-subtle"
            >
              <HStack gap="space-8" align="center" marginBlock="space-0 space-4">
                <BodyShort size="small" weight="semibold">
                  {k.skrevetAv}
                </BodyShort>
                <Detail style={{ color: 'var(--a-text-subtle)', marginLeft: 'auto' }}>
                  {formaterDatoMedTidspunktSekunderForFrontend(k.tidspunkt)}
                </Detail>
              </HStack>
              <BodyShort size="small" style={{ paddingLeft: '36px' }}>
                {k.tekst}
              </BodyShort>
            </Box>
          ))}
        </VStack>
      )}

      <VStack gap="space-8">
        <Textarea
          label="Ny kommentar"
          hideLabel
          placeholder="Skriv en kommentar…"
          value={nyKommentar}
          onChange={(e) => setNyKommentar(e.target.value)}
          minRows={2}
          maxRows={6}
          size="small"
        />
        <HStack gap="space-8" align="center">
          <Button
            size="small"
            variant="secondary"
            loading={kommentarLoading}
            disabled={!nyKommentar.trim()}
            onClick={() => onLeggTilKommentarClick(jobbId)}
          >
            Legg til kommentar
          </Button>
          {kommentarResult && (
            <Alert variant={kommentarResult.success ? 'success' : 'error'} size="small" inline>
              {kommentarResult.message}
            </Alert>
          )}
        </HStack>
      </VStack>
    </div>
  );
};
