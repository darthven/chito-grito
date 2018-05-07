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

const getUsers: RequestHandler = (req, res): void => {
  database.getAllDocuments(database.getCollection('users'))
    .toArray((err, docs) => res.send(docs));
};

const getUser: RequestHandler = (req, res): void => {
  database.getDocumentById(req.params['id'], database.getCollection('users'), (error, result) => {
    console.log('RESULT', result);
    res.send(result);
  })
};

const addUser: RequestHandler = (req, res): void => {
  console.log('Request', req.body);
  database.insertDocument(req.body, database.getCollection('users'), database.client);
  res.send(req.body);
};

const updateUser: RequestHandler = (req, res): void => {
  database.updateDocument(req.params['id'], req.body, database.getCollection('users'), database.client);
  res.send(req.body);
};

const removeUser: RequestHandler = (req, res): void => {
  database.deleteDocument(req.params['id'], database.getCollection('users'), database.client);
  res.send(req.body);
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
