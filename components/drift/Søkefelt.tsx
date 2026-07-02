'use client';

import { ActionMenu, Box, HStack, Modal, Search } from '@navikt/ds-react';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { InternalHeader } from '@navikt/ds-react/InternalHeader';
import { isMacOs } from 'environment';
import { StorageKey } from 'lib/keys';

export const Søkefelt = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearchValue('');
    }
  }, [open]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (/^\d{11}$/.test(trimmed)) {
      // Forhindre ident i URL-en
      sessionStorage.setItem(StorageKey.PersonSøkIdent, trimmed);
      router.push('/sok/person');
      setOpen(false);
    } else {
      router.push(`/sok?q=${encodeURIComponent(trimmed)}`);
      setOpen(false);
    }
  };

  return (
    <>
      <ActionMenu>
        <ActionMenu.Trigger>
          <InternalHeader.Button onClick={() => setOpen(true)}>
            <HStack gap="space-12" align="center">
              <MagnifyingGlassIcon />
              Søk
              <KeyboardShortcut />
            </HStack>
          </InternalHeader.Button>
        </ActionMenu.Trigger>
      </ActionMenu>

      <Modal open={open} onClose={() => setOpen(false)} header={{ heading: 'Søk' }} size="medium">
        <Modal.Body>
          <Box margin="space-8">
            <Search
              ref={searchRef}
              label="Søk"
              size="medium"
              variant="simple"
              placeholder="Saksnummer, journalpostID, ..."
              value={searchValue}
              onChange={(value) => setSearchValue(value)}
              onSearchClick={handleSearch}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(searchValue);
                }
              }}
            />
          </Box>
        </Modal.Body>
      </Modal>
    </>
  );
};

const KeyboardShortcut = () => (
  <Box
    as={'kbd'}
    background="neutral-soft"
    borderWidth="1"
    borderRadius="8"
    paddingInline="space-8"
    paddingBlock="space-2"
    borderColor="neutral-subtle"
    style={{ fontSize: '.65em', fontWeight: 'normal', fontFamily: 'monospace' }}
  >
    {isMacOs ? '⌘' : 'Ctrl'}+K
  </Box>
);
