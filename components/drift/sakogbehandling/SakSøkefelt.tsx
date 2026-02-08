'use client';

import { HStack, Search } from '@navikt/ds-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const SakSøkefelt = () => {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState('');

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
