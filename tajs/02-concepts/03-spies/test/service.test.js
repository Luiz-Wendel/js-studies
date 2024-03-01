import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

import Service from '../src/service';

const FUNC_NAMES = {
  FS: {
    APPENDFILE: fs.appendFile.name,
  },
  DATE: {
    TO_ISO_STRING: Date.prototype.toISOString.name,
  },
}

describe('Service Suite', () => {
  let _service;
  const filename = './test-users.ndjson';
  const MOCKED_HASHED_PASSWORD = 'hashedPassword';

  beforeEach(() => {
    jest.spyOn(
      crypto,
      crypto.createHash.name,
    ).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(MOCKED_HASHED_PASSWORD),
    });

    jest.spyOn(
      fs,
      FUNC_NAMES.FS.APPENDFILE,
    ).mockResolvedValue();

    _service = new Service({ filename });
  });
  
  describe('create', () => {
    it('should create a user', async () => {
      const mockData = {
        username: 'john',
        password: '123456',
      };
      const mockedDate = new Date().toISOString();

      jest.spyOn(
        Date.prototype,
        FUNC_NAMES.DATE.TO_ISO_STRING,
      ).mockReturnValue(mockedDate);

      await _service.create(mockData);

      expect(crypto.createHash).toHaveBeenCalledTimes(1);
      expect(crypto.createHash).toHaveBeenCalledWith('sha256');

      const hash = crypto.createHash('sha256');
      expect(hash.update).toHaveBeenCalledTimes(1);
      expect(hash.update).toHaveBeenCalledWith(mockData.password);
      expect(hash.digest).toHaveBeenCalledTimes(1);
      expect(hash.digest).toHaveBeenCalledWith('hex');

      const expectedData = JSON.stringify({
        ...mockData,
        password: MOCKED_HASHED_PASSWORD,
        createdAt: mockedDate,
      }).concat('\n');

      expect(fs.appendFile).toHaveBeenCalledWith(filename, expectedData);
    });
  });
});