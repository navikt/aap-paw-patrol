'use client';

import { Button, Heading, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { erFødselsnummer, erSaksnummer } from 'lib/utils/validering.ts';

export const SakSøkeside = () => {
  const [saksnummer, setSaksnummer] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (erSaksnummer(saksnummer)) {
          router.replace(`/drift/sak/${saksnummer}`);
          setError(undefined);
        } else if (erFødselsnummer(saksnummer)) {
          setError(
            `Verdien ser ut som et fødselsnummer. Bruk egen søkeside for fødselsnummer, eller søk i toppmenyen.`
          );
        } else {
          setError(`Ugyldig saksnummer: ${saksnummer}`);
        }
      }}
    >
      <VStack gap="space-16" marginBlock="space-32">
        <Heading size="medium">Hent sak</Heading>

        <TextField
          label="Saksnummer"
          value={saksnummer}
          onChange={(e) => setSaksnummer(e.target.value.trim())}
          htmlSize={40}
          error={error || (saksnummer && saksnummer.length < 7 ? 'Saksnummer må bestå av 7 tegn' : undefined)}
        />

        <div>
          <Button icon={<MagnifyingGlassIcon />} disabled={saksnummer.length < 7}>
            Søk
          </Button>
        </div>
      </VStack>
    </form>
  );
};
