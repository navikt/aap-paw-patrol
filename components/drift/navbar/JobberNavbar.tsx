import { Box, Button, Detail, HStack, Label } from '@navikt/ds-react';
import { appInfo } from 'lib/services/driftService';
import { ChevronRightIcon } from '@navikt/aksel-icons';

export const JobberNavbar = ({ currentApp }: { currentApp: string }) => (
  <Box
    background="neutral-soft"
    paddingInline="space-16"
    paddingBlock="space-8"
    borderWidth="0 0 0 5"
    borderColor="info"
  >
    <HStack gap="space-16" align="center">
      <Label size="small" textColor="subtle">
        Jobber
      </Label>
      <ChevronRightIcon />

      {appInfo.map((app, i) => (
        <>
          <div key={app.name}>
            <Button
              as="a"
              href={`/drift/jobber/${app.name}`}
              variant="tertiary"
              size="small"
              disabled={app.name === currentApp}
            >
              {app.displayName}
            </Button>
          </div>
          {i !== appInfo.length - 1 && <Detail textColor="subtle"> | </Detail>}
        </>
      ))}
    </HStack>
  </Box>
);
