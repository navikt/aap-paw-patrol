import { Box, CopyButton, HStack, Label } from '@navikt/ds-react';
import { ChevronRightIcon } from '@navikt/aksel-icons';

export const SakNavbar = ({ saksnummer }: { saksnummer: string }) => (
  <Box
    background="neutral-soft"
    paddingInline="space-16"
    paddingBlock="space-8"
    borderWidth="0 0 0 5"
    borderColor="info"
  >
    <HStack gap="space-16" align="center">
      <Label size="small" textColor="subtle">
        Saksnummer
      </Label>
      <ChevronRightIcon />
      <CopyButton copyText={saksnummer} text={saksnummer} iconPosition="right" size="small" className="copybutton" />
    </HStack>
  </Box>
);
