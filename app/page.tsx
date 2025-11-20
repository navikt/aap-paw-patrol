import { BodyShort, Heading } from '@navikt/ds-react';
import { appInfo } from 'lib/services/driftService';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <Heading size="xlarge" level="1" spacing>
        Paw Patrol <span aria-hidden>🐾</span>
      </Heading>
      <BodyShort spacing>
        Driftconsole for AAP-apper med oversikt over jobber som kjører, har feilet og mulighet for å kjøre jobber på
        nytt.
      </BodyShort>
      {appInfo.length > 0 && (
        <ul>
          {appInfo.map((app) => (
            <li key={app.name}>
              <Link href={`/drift/jobber/${app.name}`}>{app.displayName}</Link>
            </li>
          ))}
        </ul>
      )}

      <Link href={`/drift/behandlingsflyt`}>Operasjoner for behandlingsflyt</Link>
    </main>
  );
}
