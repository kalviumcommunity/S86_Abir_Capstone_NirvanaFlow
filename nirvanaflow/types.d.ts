import { Connection } from "mongoose"

/* eslint-disable no-var */
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {}; 
