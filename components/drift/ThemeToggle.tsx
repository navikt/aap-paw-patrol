'use client';

import { ActionMenu, HStack, InternalHeader } from '@navikt/ds-react';
import { ThemeIcon } from '@navikt/aksel-icons';

export const ThemeToggle = ({ theme }: { theme: 'light' | 'dark' }) => {
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <InternalHeader.Button
          onClick={async () => {
            await cookieStore.set('theme', theme === 'light' ? 'dark' : 'light');
            window.location.reload();
          }}
        >
          <HStack gap="space-12" align="center">
            <ThemeIcon />
          </HStack>
        </InternalHeader.Button>
      </ActionMenu.Trigger>
    </ActionMenu>
  );
};
