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

    it('should return an array of users without password property', async () => {
      const mockData = [
        {
          username: 'john',
          password: '123456',
          createdAt: new Date().toISOString(),
        },
        {
          username: 'jane',
          password: '123456',
          createdAt: new Date().toISOString(),
        },
      ];

      const mockedFileContent = mockData
        .map(data => JSON.stringify(data).concat('\n'))
        .join('');

      jest.spyOn(
        fs,
        FUNC_NAMES.FS.READFILE,
      ).mockResolvedValue(mockedFileContent);

      const result = await _service.read();

      const expected = mockData.map(({ password, ...userInfo }) => ({ ...userInfo }));

      expect(result).toEqual(expected);
    });

    it('should throw if file does not exist', async () => {
      const fileNotFoundError = new Error('file not found');

      jest.spyOn(
        fs,
        FUNC_NAMES.FS.READFILE,
      ).mockRejectedValue(fileNotFoundError);

      await expect(_service.read()).rejects.toThrow(fileNotFoundError);
    });
  });
});