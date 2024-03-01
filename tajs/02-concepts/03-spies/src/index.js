import Service from "./service.js";

const data = {
  username: `john-${Date.now()}`,
  password: '123456',
}

const service = new Service({
  filename: './users.ndjson',
});

service.create(data);

service.read().then(lines => console.log(lines));
