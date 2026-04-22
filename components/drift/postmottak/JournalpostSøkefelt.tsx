'use client';
import { HStack, Search } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
export const JournalpostSøkefelt = () => {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'j') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  return (
    <HStack
      as="form"
      paddingInline="space-20"
      align="center"
      onSubmit={(e) => {
        e.preventDefault();
        if (searchValue.trim()) {
          router.replace(`/drift/postmottak/${searchValue.trim()}`);
        }
      }}
    >
      <Search
        ref={searchRef}
        label="Finn journalpost"
        size="small"
        variant="simple"
        placeholder="JournalpostId"
        value={searchValue}
        onChange={(value) => setSearchValue(value.trim())}
      />
    </HStack>
  );
};
