import { Alert, BodyShort, Box, Button, Detail, HStack, Label, Link, Tag, Textarea, VStack } from '@navikt/ds-react';
import { AppNavn, JobbKommentar } from 'lib/services/driftService';
import React, { useState } from 'react';
import { formaterDatoMedTidspunktSekunderForFrontend } from 'lib/utils/date';
import { leggTilKommentar } from 'lib/clientApi';

const URL_REGEX = /(https?:\/\/\S+)/g;

function BodyShortMedLenker({ tekst }: { tekst: string }) {
  const deler = tekst.split(URL_REGEX);
  return (
    <BodyShort size="small" style={{ paddingLeft: '36px' }}>
      {deler.map((del, i) =>
        del.startsWith('http') ? (
          <Link key={i} href={del} target="_blank" rel="noopener noreferrer">
            {del}
          </Link>
        ) : (
          <React.Fragment key={i}>{del}</React.Fragment>
        )
      )}
    </BodyShort>
  );
}

export const Kommentarfelt = ({
  jobbId,
  appNavn,
  initielleKommentarer,
}: {
  jobbId: number;
  appNavn: AppNavn;
  initielleKommentarer: JobbKommentar[];
}) => {
  const [nyKommentar, setNyKommentar] = useState('');
  const [kommentarer, setKommentarer] = useState(initielleKommentarer || []);
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string }>();

  async function onLeggTilKommentarClick() {
    if (!nyKommentar.trim()) return;

    setResult(undefined);
    setIsLoading(true);

    await leggTilKommentar(appNavn, jobbId, nyKommentar.trim())
      .then(async (res) => {
        if (res.ok) {
          const nyKommentarObj = await res.json();
          setKommentarer([...kommentarer, nyKommentarObj]);
          setResult({ success: true, message: 'Kommentar lagt til' });
          setNyKommentar('');
        } else {
          setResult({ success: false, message: await res.text() });
        }
      })
      .catch((err) => setResult({ success: false, message: err.message || 'Noe gikk galt' }))
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => setResult(undefined), 3000);
      });
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
              key={`jobb-${jobbId}-kommentar-${i}`}
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
              <BodyShortMedLenker tekst={k.tekst} />
            </Box>
          ))}
        </VStack>
      )}

      <VStack gap="space-8">
        <Textarea
          label="Ny kommentar"
          hideLabel
          size="small"
          placeholder={!showInput ? 'Trykk for å legge til kommentar' : 'Skriv en kommentar…'}
          readOnly={!showInput}
          value={nyKommentar}
          onFocus={() => !showInput && setShowInput(true)}
          onClick={() => !showInput && setShowInput(true)}
          onChange={(e) => setNyKommentar(e.target.value)}
          style={{ cursor: !showInput ? 'pointer' : 'text' }}
          minRows={!showInput ? 1 : 2}
          maxRows={6}
          /* eslint-disable-next-line jsx-a11y/no-autofocus */
          autoFocus={showInput}
        />

        {showInput && (
          <HStack gap="space-8" align="center" justify="end">
            <Button
              size="small"
              disabled={isLoading}
              variant="tertiary"
              onClick={() => {
                setShowInput(false);
                setNyKommentar('');
              }}
            >
              Avbryt
            </Button>

            <Button size="small" loading={isLoading} onClick={onLeggTilKommentarClick} disabled={!nyKommentar.trim()}>
              Lagre
            </Button>

            {result && (
              <Alert variant={result.success ? 'success' : 'error'} size="small" inline>
                {result.message}
              </Alert>
            )}
          </HStack>
        )}
      </VStack>
    </div>
  );
};
