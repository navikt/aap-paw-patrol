import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fileToBase64 } from './file';

describe('fileToBase64', () => {
  let reader: {
    result: string | null;
    onload: (() => void) | null;
    onerror: ((event: Event) => void) | null;
    readAsDataURL: ReturnType<typeof vi.fn<(file: Blob) => void>>;
  };

  beforeEach(() => {
    reader = {
      result: null,
      onload: null,
      onerror: null,
      readAsDataURL: vi.fn(),
    };
    vi.stubGlobal(
      'FileReader',
      vi.fn(function () {
        return reader;
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    { name: 'text', content: 'hello', type: 'text/plain', base64: 'aGVsbG8=' },
    { name: 'PDF', content: '%PDF-1.7', type: 'application/pdf', base64: 'JVBERi0xLjc=' },
    {
      name: 'binary',
      content: new Uint8Array([0, 128, 255]),
      type: 'application/octet-stream',
      base64: 'AID/',
    },
    { name: 'UTF-8', content: '\u00e6\u00f8\u00e5', type: 'text/plain', base64: 'w6bDuMOl' },
    { name: 'empty', content: '', type: 'text/plain', base64: '' },
  ])('returns only the base64 payload for a $name file', async ({ content, type, base64 }) => {
    const file = new File([content], 'test-file', { type });

    const result = fileToBase64(file);

    expect(reader.readAsDataURL).toHaveBeenCalledExactlyOnceWith(file);
    reader.result = `data:${type};base64,${base64}`;
    reader.onload?.();

    await expect(result).resolves.toBe(base64);
  });

  it('rejects with the original error event when reading fails', async () => {
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    const error = new Event('error');

    const result = fileToBase64(file);
    reader.onerror?.(error);

    await expect(result).rejects.toBe(error);
  });

  it('rejects when readAsDataURL throws synchronously', async () => {
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });
    const error = new DOMException('The reader is already loading', 'InvalidStateError');
    reader.readAsDataURL.mockImplementation(() => {
      throw error;
    });

    await expect(fileToBase64(file)).rejects.toBe(error);
  });
});
