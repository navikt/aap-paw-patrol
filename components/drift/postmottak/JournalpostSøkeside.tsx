'use client';

import { Button, Heading, TextField, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';

export const JournalpostSøkeside = () => {
  const [journalpostId, setJournalpostId] = useState('');
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (journalpostId.trim()) {
          router.push(`/drift/postmottak/${journalpostId.trim()}`);
        }
      }}
    >
      <VStack gap="space-16" marginBlock="space-32">
        <Heading size="medium">Hent journalpost</Heading>

        <TextField
          label="JournalpostId"
          value={journalpostId}
          onChange={(e) => setJournalpostId(e.target.value.trim())}
          htmlSize={40}
        />

        <div>
          <Button icon={<MagnifyingGlassIcon />} disabled={!journalpostId.trim()}>
            Søk
          </Button>
        </div>
      </VStack>
    </form>
  );
};

