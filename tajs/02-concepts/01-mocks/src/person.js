class Person {
  static validate(person) {
    if (!person.name) throw new Error('Name is required');
    if (!person.cpf) throw new Error('CPF is required');
  }

  static format(person) {
    const [firstName, ...lastName] = person.name.split(' ');

    return {
      firstName,
      lastName: lastName?.join(' '),
      cpf: person.cpf.replace(/\D/g, ''),
    };
  }

  static save(person) {
    if (!['cpf', 'firstName', 'lastName'].every(prop => person[prop])) {
      throw new Error(`cannot save invalid person: ${JSON.stringify(person)}`);
    }

    // db, api...

    console.log('saved', person);
  }

  static process(person) {
    this.validate(person);

    const formattedPerson = this.format(person);

    this.save(formattedPerson);

    return formattedPerson;
  }
}

export default Person;
