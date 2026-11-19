import { OPENAPI_PATH_PREFIXES, OPENAPI_SPECS } from '../openapi.config.mjs';

export function filterOpenApiSpec(spec, app) {
  if (!spec || typeof spec !== 'object' || !spec.openapi || !spec.paths || typeof spec.paths !== 'object') {
    throw new Error(`Invalid OpenAPI spec for ${app}`);
  }

  const extraPaths = OPENAPI_SPECS.find((config) => config.app === app)?.extraPaths;
  const paths = Object.fromEntries(
    Object.entries(spec.paths).filter(
      ([path]) =>
        OPENAPI_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)) ||
        extraPaths?.includes(path)
    )
  );
  const retained = new Set();
  const usedTags = new Set();
  const filtered = { ...spec, paths, components: {} };
  delete filtered.tags;

  function retainComponent(group, name) {
    const key = `${group}/${name}`;
    if (retained.has(key)) return;
    const component = spec.components?.[group]?.[name];
    if (component === undefined) {
      throw new Error(`Missing OpenAPI component ${key} in ${app}`);
    }
    retained.add(key);
    if (group === 'examples') {
      if (component.$ref) retainReference(component.$ref);
    } else {
      visit(component);
    }
  }

  function retainReference(ref) {
    if (typeof ref !== 'string' || !ref.startsWith('#/components/')) {
      throw new Error(`Unsupported OpenAPI reference ${ref} in ${app}`);
    }
    const [group, name] = ref
      .slice('#/components/'.length)
      .split('/')
      .map((part) => decodeURIComponent(part).replace(/~1/g, '/').replace(/~0/g, '~'));
    retainComponent(group, name);
  }

  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (key === '$ref') {
        retainReference(child);
      } else if (key === 'discriminator' && child?.mapping) {
        for (const ref of Object.values(child.mapping)) {
          if (typeof ref === 'string' && !ref.includes('/') && !ref.includes('#')) {
            retainComponent('schemas', ref);
          } else {
            retainReference(ref);
          }
        }
      } else if (key === 'security' && Array.isArray(child)) {
        for (const requirement of child) {
          for (const name of Object.keys(requirement)) retainComponent('securitySchemes', name);
        }
      } else if (key === 'tags' && Array.isArray(child)) {
        child.forEach((tag) => usedTags.add(tag));
      } else if (key === 'examples' && child && !Array.isArray(child)) {
        for (const example of Object.values(child)) {
          if (example?.$ref) retainReference(example.$ref);
        }
      } else if (!['example', 'examples', 'default', 'enum', 'const'].includes(key)) {
        // Example payloads are data, not OpenAPI references or security requirements.
        visit(child);
      }
    }
  }

  visit(filtered);
  filtered.components = Object.fromEntries(
    Object.entries(spec.components ?? {}).flatMap(([group, entries]) => {
      const kept = Object.entries(entries).filter(([name]) => retained.has(`${group}/${name}`));
      return kept.length ? [[group, Object.fromEntries(kept)]] : [];
    })
  );
  if (spec.tags) filtered.tags = spec.tags.filter((tag) => usedTags.has(tag.name));

  return filtered;
}
