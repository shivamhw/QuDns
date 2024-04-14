import { Server } from "./app/server";
import express from 'express';

const serv = new Server(express());
serv.start(3001)