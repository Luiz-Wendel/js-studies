import { describe, it, expect, jest } from '@jest/globals';

import Person from '../src/person';

const ERRORS = {
  REQUIRED_CPF: 'CPF is required',
  REQUIRED_NAME: 'Name is required'
}

const FUNC_NAMES = {
  VALIDATE: Person.validate.name,
  FORMAT: Person.format.name,
  SAVE: Person.save.name,
};

describe('Person Suite', () => {
  describe('validate', () => {
    it('should throw if name is not provided', () => {
      const mockInvalidPerson = { cpf: '123.456.789-00' };

      expect(() => Person.validate(mockInvalidPerson))
        .toThrow(new Error(ERRORS.REQUIRED_NAME));
    });

    it('should throw if cpf is not provided', () => {
      const mockInvalidPerson = { name: 'John' };

      expect(() => Person.validate(mockInvalidPerson))
        .toThrow(new Error(ERRORS.REQUIRED_CPF));
    });

    it('should not throw if name and cpf are provided', () => {
      const mockValidPerson = {
        name: 'John',
        cpf: '123.456.789-00'
      };

      expect(() => Person.validate(mockValidPerson))
        .not.toThrow();
    });
  });

  describe('format', () => {
    it('should format name and cpf', () => {
      const mockPerson = {
        name: 'John Doe One',
        cpf: '123.456.789-00',
      };

      const formattedPerson = Person.format(mockPerson);

      const expectedPerson = {
        firstName: 'John',
        lastName: 'Doe One',
        cpf: '12345678900',
      };

      expect(formattedPerson).toStrictEqual(expectedPerson);
    });
  });

  describe('save', () => {
    it('should throw if CPF is not provided', () => {
      const mockInvalidPerson = {
        firstName: 'John',
        lastName: 'Doe',
      };

      expect(() => Person.save(mockInvalidPerson))
        .toThrow(new Error(`cannot save invalid person: ${JSON.stringify(mockInvalidPerson)}`));
    });

    it('should throw if firstName is not provided', () => {
      const mockInvalidPerson = {
        lastName: 'Doe',
        cpf: '12345678900',
      };

      expect(() => Person.save(mockInvalidPerson))
        .toThrow(new Error(`cannot save invalid person: ${JSON.stringify(mockInvalidPerson)}`));
    });

    it('should throw if lastName is not provided', () => {
      const mockInvalidPerson = {
        firstName: 'John',
        cpf: '12345678900',
      };

      expect(() => Person.save(mockInvalidPerson))
        .toThrow(new Error(`cannot save invalid person: ${JSON.stringify(mockInvalidPerson)}`));
    });

    it('should not throw if person is valid', () => {
      const mockValidPerson = {
        firstName: 'John',
        lastName: 'Doe',
        cpf: '12345678900',
      };

      expect(() => Person.save(mockValidPerson))
        .not.toThrow();
    });
  });

  describe('process', () => {
    it('should throw if person name is not provided', () => {
      const mockInvalidPerson = {
        cpf: '123.456.789-00',
      };

      jest.spyOn(Person, FUNC_NAMES.VALIDATE)
        .mockImplementation(() => { throw new Error(ERRORS.REQUIRED_NAME) });

      expect(() => Person.process(mockInvalidPerson))
        .toThrow(new Error(ERRORS.REQUIRED_NAME));
    });

    it('should throw if person CPF is not provided', () => {
      const mockInvalidPerson = {
        name: 'John',
      };

      jest.spyOn(Person, FUNC_NAMES.VALIDATE)
        .mockImplementation(() => { throw new Error(ERRORS.REQUIRED_CPF) });

      expect(() => Person.process(mockInvalidPerson))
        .toThrow(new Error(ERRORS.REQUIRED_CPF));
    });

    it('should process a valid person', () => {
      const mockValidPerson = {
        name: 'John Doe',
        cpf: '123.456.789-00',
      };

      jest.spyOn(Person, FUNC_NAMES.VALIDATE)
        .mockReturnValue();

      jest.spyOn(Person, FUNC_NAMES.FORMAT)
        .mockReturnValue({
          firstName: 'John',
          lastName: 'Doe',
          cpf: '12345678900',
        });

      jest.spyOn(Person, FUNC_NAMES.SAVE)
        .mockReturnValue();

      const processedPerson = Person.process(mockValidPerson);

      const expectedPerson = {
        firstName: 'John',
        lastName: 'Doe',
        cpf: '12345678900',
      };

      expect(processedPerson).toStrictEqual(expectedPerson);
    });
  });
});
