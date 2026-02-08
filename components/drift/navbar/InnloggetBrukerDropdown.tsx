'use client';

import { BrukerInformasjon, Roller } from 'lib/azure/azureUserService';
import { BodyShort, Detail, Dropdown, InternalHeader, Spacer } from '@navikt/ds-react';
import Link from 'next/link';
import { LeaveIcon } from '@navikt/aksel-icons';

export const InnloggetBrukerDropdown = ({
  brukerInformasjon,
  roller,
}: {
  brukerInformasjon: BrukerInformasjon;
  roller: Roller[];
}) => {
  return (
    <Dropdown>
      <InternalHeader.UserButton name={brukerInformasjon.navn} as={Dropdown.Toggle} />
      <Dropdown.Menu>
        <Dropdown.Menu.GroupedList>
          <Dropdown.Menu.GroupedList.Heading>
            Roller:
            <Detail>{roller?.map((rolle) => rolle).join(', ')}</Detail>
          </Dropdown.Menu.GroupedList.Heading>
          <Dropdown.Menu.Divider />

          <Dropdown.Menu.List.Item as={Link} href={'/oauth2/logout'}>
            <BodyShort>Logg ut</BodyShort>
            <Spacer />
            <LeaveIcon aria-hidden fontSize="1.5rem" />
          </Dropdown.Menu.List.Item>
        </Dropdown.Menu.GroupedList>
      </Dropdown.Menu>
    </Dropdown>
  );
};
