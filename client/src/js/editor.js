// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb, initdb } from './database.js';
import { header } from './header.js';

export default class Editor {
  constructor() {
    // const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        await initdb(); // Make sure the database is initialized
        const data = await getDb();
        if (data && data.length > 0) {
          console.info('Loaded data from IndexedDB, injecting into editor');
          this.editor.setValue(data[0].value);
        } else if (localStorage.getItem('content')) {
          console.info('Loaded data from localStorage, injecting into editor');
          this.editor.setValue(localStorage.getItem('content'));
        } else {
          console.info('No data found in IndexedDB or localStorage, using header as fallback');
          this.editor.setValue(header);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // If there's an error loading data from IndexedDB or localStorage, use the header as fallback
        this.editor.setValue(header);
      }
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      localStorage.setItem('content', this.editor.getValue());
      putDb(this.editor.getValue()); // Also update the data in IndexedDB
    });
  }
}
