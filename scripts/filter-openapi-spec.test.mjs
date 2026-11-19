import { describe, expect, it } from 'vitest';
import { filterOpenApiSpec } from './filter-openapi-spec.mjs';

const response = (name) => ({
  get: {
    responses: {
      200: {
        description: 'OK',
        content: { 'application/json': { schema: { $ref: `#/components/schemas/${name}` } } },
      },
    },
  },
});

describe('filterOpenApiSpec', () => {
  it('keeps drift/motor path segments and service-specific exceptions only', () => {
    const paths = [
      '/drift',
      '/drift/api/jobb',
      '/api/drift/person',
      '/motor/jobb',
      '/api/motor/jobb',
      '/drifting',
      '/api/drifting',
      '/api/sak',
      '/kelvin/dsop/vedtak-test',
      '/maksimumUtenUtbetaling',
      '/admin/status',
      '/admin/migrering/status',
      '/admin/utbetalingstidslinje/{saksnummer}',
      '/admin/utbetalingsmelding/status',
      '/admin/utbetalingsmelding/{saksnummer}',
      '/migrering',
      '/migrering/sak',
      '/admin/unrelated',
    ];
    const spec = { openapi: '3.0.3', paths: Object.fromEntries(paths.map((path) => [path, {}])) };
    const common = paths.slice(0, 5);
    expect(Object.keys(filterOpenApiSpec(spec, 'oppgave').paths)).toEqual(common);
    expect(Object.keys(filterOpenApiSpec(spec, 'api-intern').paths)).toEqual([
      ...common,
      '/kelvin/dsop/vedtak-test',
      '/maksimumUtenUtbetaling',
    ]);
    expect(Object.keys(filterOpenApiSpec(spec, 'utbetal').paths)).toEqual([...common, ...paths.slice(10, 17)]);
  });

  it('retains transitive and cyclic references, discriminator mappings and security schemes', () => {
    const spec = {
      openapi: '3.0.3',
      info: { title: 'Test', version: '1' },
      security: [{ globalAuth: [] }],
      tags: [{ name: 'drift' }, { name: 'unrelated' }],
      paths: {
        '/api/drift/person': {
          get: {
            tags: ['drift'],
            security: [{ operationAuth: [] }],
            responses: { 200: { $ref: '#/components/responses/Result' } },
          },
        },
        '/api/unrelated': response('Unused'),
      },
      components: {
        responses: {
          Result: {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Base' },
                examples: { result: { $ref: '#/components/examples/Result' } },
              },
            },
          },
          Unused: { description: 'Unused' },
        },
        schemas: {
          Base: {
            discriminator: {
              propertyName: 'type',
              mapping: { child: '#/components/schemas/Child', short: 'ShortName' },
            },
          },
          Child: { properties: { parent: { $ref: '#/components/schemas/Base' } } },
          ShortName: { properties: { value: { $ref: '#/components/schemas/Escaped~1Name~0' } } },
          'Escaped/Name~': { type: 'string' },
          Unused: { type: 'string' },
        },
        securitySchemes: {
          globalAuth: { type: 'http', scheme: 'bearer' },
          operationAuth: { type: 'http', scheme: 'bearer' },
          unusedAuth: { type: 'http', scheme: 'bearer' },
        },
        examples: {
          Result: { value: { $ref: 'ordinary user data' } },
          Unused: { value: 'unused' },
        },
      },
    };
    const original = structuredClone(spec);
    const filtered = filterOpenApiSpec(spec, 'behandlingsflyt');
    expect(Object.keys(filtered.components.schemas)).toEqual(['Base', 'Child', 'ShortName', 'Escaped/Name~']);
    expect(Object.keys(filtered.components.responses)).toEqual(['Result']);
    expect(Object.keys(filtered.components.securitySchemes)).toEqual(['globalAuth', 'operationAuth']);
    expect(Object.keys(filtered.components.examples)).toEqual(['Result']);
    expect(filtered.tags).toEqual([{ name: 'drift' }]);
    expect(filtered.info).toEqual(spec.info);
    expect(spec).toEqual(original);
    expect(filterOpenApiSpec(filtered, 'behandlingsflyt')).toEqual(filtered);
  });

  it('does not interpret example payloads as OpenAPI references', () => {
    const spec = {
      openapi: '3.0.3',
      paths: { '/drift': response('Data') },
      components: {
        schemas: {
          Data: {
            type: 'object',
            example: { $ref: 'ordinary user data', security: [{ notAScheme: [] }] },
          },
        },
      },
    };
    expect(() => filterOpenApiSpec(spec, 'oppgave')).not.toThrow();
  });

  it('produces identical output when unrelated endpoints and schemas change', () => {
    const spec = {
      openapi: '3.0.3',
      paths: { '/drift': response('Used'), '/api/unrelated': response('Unused') },
      components: { schemas: { Used: { type: 'string' }, Unused: { type: 'string' } } },
    };
    const before = filterOpenApiSpec(spec, 'oppgave');
    spec.paths['/api/new'] = response('New');
    spec.components.schemas.Unused = { type: 'number' };
    spec.components.schemas.New = { type: 'boolean' };
    expect(filterOpenApiSpec(spec, 'oppgave')).toEqual(before);
  });

  it('fails explicitly on invalid specs and missing or external references', () => {
    expect(() => filterOpenApiSpec({}, 'oppgave')).toThrow('Invalid OpenAPI spec');
    const spec = { openapi: '3.0.3', paths: { '/drift': response('Missing') } };
    expect(() => filterOpenApiSpec(spec, 'oppgave')).toThrow('Missing OpenAPI component');
    spec.paths['/drift'] = { $ref: 'https://example.com/paths.json' };
    expect(() => filterOpenApiSpec(spec, 'oppgave')).toThrow('Unsupported OpenAPI reference');
  });
});
