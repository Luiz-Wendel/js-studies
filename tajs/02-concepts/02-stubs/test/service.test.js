import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import fs from 'node:fs/promises';

import Service from '../src/service';

const FUNC_NAMES = {
  FS: {
    READFILE: fs.readFile.name,
  },
}

describe('Service Suite', () => {
  let _service;

  beforeEach(() => {
    _service = new Service({ filename: './test-users.ndjson' });
  });

  describe('read', () => {
    it('should return an empty array if file is empty', async () => {
      jest.spyOn(
        fs,
        FUNC_NAMES.FS.READFILE,
      ).mockResolvedValue('');

      const result = await _service.read();

      expect(result).toEqual([]);
    });
  });
});