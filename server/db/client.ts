import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'localhost', // Replace with your host
  user: 'your_username', // Replace with your username
  password: 'your_password', // Replace with your password
  database: 'your_database', // Replace with your database name
});

export const db = drizzle(connection);