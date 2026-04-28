'use client';

import { HStack, Search } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const Søkefelt = () => {
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
        const value = searchValue.trim();
        if (value) {
          router.push(`/sok?q=${encodeURIComponent(value)}`);
        }
      }}
    >
      <Search
        ref={searchRef}
        label="Søk"
        size="small"
        variant="simple"
        placeholder="Søk"
        value={searchValue}
        onChange={(value) => setSearchValue(value)}
      />
    </HStack>
  );
};
