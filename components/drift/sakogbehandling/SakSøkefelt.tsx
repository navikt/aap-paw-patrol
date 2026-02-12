'use client';

import { HStack, Search } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const SakSøkefelt = () => {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
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
        router.replace(`/drift/sak/${searchValue}`);
      }}
    >
      <Search
        ref={searchRef}
        label="Finn sak"
        size="small"
        variant="simple"
        placeholder="Saksnummer"
        value={searchValue}
        onChange={(value) => setSearchValue(value.trim())}
        error={searchValue && searchValue.length !== 7 ? 'Saksnummer må være 7 tegn' : undefined}
      />
    </HStack>
  );
};
