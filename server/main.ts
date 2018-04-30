import { MongoClient, MongoError, Db,
  InsertOneWriteOpResult, InsertWriteOpResult } from 'mongodb';
import * as assert from 'assert';
import * as path from 'path';
import { RequestHandler } from 'express';

import { MongoDatabase } from './src/database';
import { HttpMethod, HttpRequest } from './src/server';
import { ChitoGritoServer } from './src/chito-grito-server';


const USER: string = 'darthven';
const PASSWORD: string = 'chito-grito123'
const DATABASE_NAME: string = 'chito-grito';
const CONNECTION_URL: string = `mongodb://${USER}:${PASSWORD}@ds161939.mlab.com:61939/${DATABASE_NAME}`;

const database = new MongoDatabase(CONNECTION_URL, DATABASE_NAME);

const server = new ChitoGritoServer('localhost', 3000, '../client/', database);

const stubUsers = [
  {
    name: "Adolf Dassler",
    age: 115,
    info: "Test"
  },
  {
    name: "Rudolf Dassler",
    age: 113,
    info: "Test2"
  },
  {
    name: "Anubis",
    age: 5000,
    info: "Test3"
  }
];

const initStubUsers = (users: any[]): void => {
  users.forEach((user) =>
    database.insertDocument(user, database.getCollection('users'), database.client));
}

const getUsers: RequestHandler = (req, res): void => {
  initStubUsers(stubUsers);
  database.getAllDocuments(database.getCollection('users'))
    .toArray((err, docs) => res.send(docs));
};

const getUser: RequestHandler = (req, res): void => {
  database.getDocumentById(req.params['id'], database.getCollection('users'))
    .then((doc) => res.send(doc));
};

const addUser: RequestHandler = (req, res): void => {
  database.insertDocument(req.body, database.getCollection('users'), database.client)
};

const updateUser: RequestHandler = (req, res): void => {
  database.updateDocument(req.body, database.getCollection('users'), database.client);
};

const removeUser: RequestHandler = (req, res): void => {
  database.deleteDocument(req.params['id'], database.getCollection('users'), database.client)
};


const restMapping = new Map<HttpRequest, RequestHandler>([
  [{url: '/api/users', method: HttpMethod.GET}, getUsers],
  [{url: '/api/users/:id', method: HttpMethod.GET}, getUser],
  [{url: '/api/users', method: HttpMethod.POST}, addUser],
  [{url: '/api/users/:id', method: HttpMethod.PUT}, updateUser],
  [{url: '/api/users/:id', method: HttpMethod.DELETE}, removeUser]
]);

server.setRestMappping(restMapping);
server.listen();
