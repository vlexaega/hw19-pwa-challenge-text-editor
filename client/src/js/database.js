import { openDB } from 'idb';
//import the UUID generator
import { v4 as uuidv4 } from 'uuid';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id' });
      console.log('jate database created');
    },
  });

// // TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async(content) => {
  console.log('Put to the DB');
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const item = {
    id: uuidv4(),
    value: content,
  };
  const request = store.put(item);
  const result = await request;
  console.log('Data saved to the database', result);
};

// // TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('GET all from the database');
  const jateDb = await openDB('jate', 1);
  const tx = jateDb.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const request = store.getAll();
  const result = await request;
  console.log('result', result);
  return result;
};

export { initdb };
