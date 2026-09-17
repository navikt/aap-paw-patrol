# AAP Paw Patrol

Frontendapplikasjon for intern drift av saksbehandlingsapper i AAP

## Bygge og kjøre app lokalt

### Prettier og linting

Prosjektet bruker prettier og eslint. Skru gjerne på "Automatic configuration" for disse i din IDE.

For at pre-commit hooks for linting og formatering skal kunne kjøre, må du sette opp Husky med følgende kommando (trengs bare én gang):

```bash
  yarn husky
```

### Typesjekking

```bash
yarn tsc
```

Kjører `tsc --noEmit` mot hele prosjektet (alle `.ts`/`.tsx`-filer inkludert `mocks/`-katalogen, se
`tsconfig.json`). Kommandoen kjører `yarn mock:generate` først, slik at de genererte mock-handlerne
i `mocks/generated/` (som `mocks/run.ts` importerer fra, og som ikke er sjekket inn i git) finnes
før typesjekkingen kjøres — også ved første kjøring på en fersk klone.

### Github package registry

Vi bruker Github sitt package registry for npm pakker, siden flere av Nav sine pakker kun blir publisert her.

For å kunne kjøre `yarn install` lokalt må du logge inn mot Github package registry. Legg til følgende i .bashrc eller .zshrc lokalt på din maskin:
I .bashrc eller .zshrc:

`export NODE_AUTH_TOKEN=github_pat`

Hvor github_pat er din personal access token laget på github (settings -> developer settings). Husk `read:packages`-rettighet og enable SSO når du oppdaterer/lager PAT.

### .env.local-fil

I tillegg må du kopiere `.env-template` til `.env.local` for å kunne kjøre lokalt.

### Kjøre lokalt

```
yarn dev
```

### URL-er for å hente openapi.json-filer

|App              |URl                                                         |
|-----------------|------------------------------------------------------------|
|behandlingsflyt  |https://aap-behandlingsflyt.intern.dev.nav.no/openapi.json  |
|utbetal          |https://aap-utbetal.intern.dev.nav.no/openapi.json          |
|oppgave          |https://aap-oppgave.intern.dev.nav.no/openapi.json          |
|meldekort-backend|https://aap-meldekort-backend.intern.dev.nav.no/openapi.json|



### Kjøre lokalt med falske (mockede) backend-svar

Appen kaller flere backend-tjenester (behandlingsflyt, oppgave, meldekort, m.fl.) via URL-er
konfigurert i `.env.local`. For å kjøre lokalt uten at disse tjenestene faktisk kjører, kan du
bruke `yarn dev:mock`, som starter små lokale "fake"-backend-servere som svarer på de vanlige
portene (f.eks. `http://localhost:8080` for behandlingsflyt) med falske, men strukturelt riktige
data generert fra OpenAPI-spesifikasjoner med
[msw-auto-mock](https://github.com/zoubingwu/msw-auto-mock)/[MSW](https://mswjs.io).

```
yarn dev:mock
```

Dette:

- Genererer mock-handlere fra spesifikasjonene i `openapi/` (`yarn mock:generate`, kjøres
  automatisk av `dev:mock`).
- Starter én ekte, liten HTTP-server per mocket backend (se `mocks/run.ts` og
  `mocks/standaloneServer.ts`) som lytter på samme port som `_API_BASE_URL` i `.env.local` peker
  til, og svarer med falske data for de backendene som har en spesifikasjon i `openapi/` (per nå:
  behandlingsflyt og oppgave — flere kan legges til senere, se `scripts/generate-mocks.mjs`).
  Merk: dette er **ikke** MSW sin vanlige in-process request-interception — vi kjører ekte
  servere på de faktiske portene, siden Next sin dev-server (Turbopack/webpack) nullstiller
  `globalThis.fetch` på hver HMR-rebuild og dermed ødelegger in-process MSW-mocking.
- Lar `fakedings`-kallet for lokal token (`lib/services/localTokenService.ts`) være uendret/ekte —
  dette er ikke mocket, så du trenger fortsatt normal nettverkstilgang for det.
- Backender uten spesifikasjon i `openapi/`, eller uten en fake-server startet for seg, kalles
  fortsatt reelt og vil feile/henge uten at de faktiske tjenestene kjører, inntil spesifikasjon
  legges til.
- Krever at portene til de mockede backendene (f.eks. 8080, 8084) er ledige lokalt — ikke kjør ekte
  backends på samme port samtidig som `yarn dev:mock`.

For å legge til mocking av en ny backend: legg OpenAPI-spesifikasjonen i `openapi/<navn>.json`
(eller `.yaml`), og legg til én oppføring i `MOCK_SPECS` i `mocks/mock-specs.mjs`. Det er det eneste
stedet som må endres — både `yarn mock:generate` (`scripts/generate-mocks.mjs`) og de kjørende
fake-serverne (`mocks/run.ts`) leser fra denne samme lista, så en ny backend starter automatisk med
`yarn dev:mock` med en gang spesifikasjonen og tilhørende `*_API_BASE_URL` i `.env.local` finnes.

#### Justere hvor "ekte"/omfattende de genererte dataene ser ut

`msw-auto-mock` genererer data ut fra typen/formatet i OpenAPI-skjemaet (faker), ikke ut fra
feltnavn — så et felt som `andreSakerPåBruker: string[]` blir tilfeldig latinsk "lorem ipsum"-tekst
med mindre skjemaet sier noe mer spesifikt. Noen knapper du kan skru på:

- **Kortere lister**: `yarn mock:generate` kjører med `-m/--max-array-length` satt til `3` som
  standard (i stedet for msw-auto-mock sin egen standard på `20`), for å unngå unødvendig lange
  arrays. Juster ved å sette `MOCK_MAX_ARRAY_LENGTH` i `.env.local`, f.eks.
  `MOCK_MAX_ARRAY_LENGTH=1` for enda mindre støy, eller høyere hvis du faktisk trenger å teste
  paginering/lange lister.
- **Mer realistiske verdier for spesifikke felt**: legg til `"example": "..."` (eller `"examples"`)
  direkte i skjemaet for feltet i `openapi/<navn>.json` — msw-auto-mock bruker `example`-verdien
  ordrett i stedet for å generere tilfeldig faker-data når den finnes. Kjør `yarn mock:generate` på
  nytt etterpå for å regenerere handlerne.
- **Mocke færre endepunkter**: legg til `-t/--includes` eller `-e/--excludes` i
  `scripts/generate-mocks.mjs` sitt `spawnSync`-kall for å bare generere handlere for enkelte
  stier (nyttig hvis du bare trenger noen få endepunkter og resten av spec-en gir mye støy).
- **Faste (ikke-tilfeldige) svar mellom kall**: `yarn mock:generate` kjører som standard med
  `--static` — dataene genereres én gang (ved kjøring av `mock:generate`) og bakes inn i
  `mocks/generated/**/handlers.ts`, i stedet for å bli regenerert på nytt for hvert HTTP-kall.
  Dette er viktig for flyter som ruter en id videre i en URL, f.eks. når du klikker en behandling
  og siden setter `?behandlingref=<uuid>` — uten `--static` ville et sideoppfriskning/direkte-lenke
  hentet en helt ny, tilfeldig `behandlinger`-liste som (nesten) aldri inneholder samme uuid igjen,
  og siden ville se ut som om den "ikke virker" (ingen behandling valgt). Sett `MOCK_STATIC=false`
  i `.env.local` hvis du heller vil ha ekte tilfeldige/varierende svar per kall (f.eks. for å teste
  hvordan UI-et takler forskjellige tilfeldige datasett), men vær da klar over at deep-linking av
  id-er fra én respons til en senere URL/kall ikke vil fungere pålitelig.

Alle disse endringene gjøres i `scripts/generate-mocks.mjs` (CLI-flagg til `msw-auto-mock`) eller
direkte i OpenAPI-spesifikasjonene under `openapi/`, og krever at du kjører `yarn mock:generate`
(eller `yarn dev:mock`, som gjør dette automatisk) på nytt for at endringene skal slå ut.

---

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.

# Henvendelser

---

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

# For NAV-ansatte

---

Interne henvendelser kan sendes via Slack i kanalen #ytelse-aap-værsågod.
