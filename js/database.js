var myDB = {};
myDB.indexedDB = {};
myDB.indexedDB.db = null; // Base de données IndexedDB
myDB.indexedDB.callback = null; // Fonction de rappel pour l'affichage de données

/**
 * Gestion des erreurs renvoyées par la base de données indexedDB
 * @param {*} e erreur
 */
myDB.indexedDB.onerror = function(e) {
    console.log(e);
}
/**
 * Ouverture ou création de la base de données
 * @param {*} databasename nom de la base de données indexedDB
 * @param {*} tablename    nom du magasin de données
 */
myDB.indexedDB.open = function(databasename, tablename) {
    let version = 1; // à changer si on veut recréer la DB
    let request = indexedDB.open(databasename, version);
    // Appelée uniquement si le N° de version a changé
    request.onupgradeneeded = function(e) {
        let db = e.target.result; // la DB
        e.target.transaction.onerror = myDB.indexedDB.onerror;
        if (db.objectStoreNames.contains(tablename)) {
            db.deleteObjectStore(tablename);
        }
        db.createObjectStore(tablename, {
            keyPath: 'id',
            autoIncrement: true
        });
    }
    request.onsuccess =  function(e) {
        myDB.indexedDB.db = e.target.result;
        myDB.indexedDB.read(tablename);
    }
    request.onerror = myDB.indexedDB.onerror;
}

/**
 * Insère des données dans le magasin
 * @param {*} tablename nom du magasin de données
 * @param {*} data données à insérer au format JSON
 */
myDB.indexedDB.create = function(tablename, data) {
    let db = myDB.indexedDB.db;
    let transaction = db.transaction([tablename], 'readwrite');
    let store = transaction.objectStore(tablename);
    let request = store.add(data);
    request.onsuccess =  function(e) {
       //  myDB.indexedDB.read(tablename);
    }
    request.onerror = myDB.indexedDB.onerror;
}

/**
 * Lit les données dans le magasin
 * @param {*} tablename nom du magasin de données
 */
myDB.indexedDB.read =  function(tablename) {
    let db = myDB.indexedDB.db;
    let transaction = db.transaction([tablename], 'readwrite');
    let store = transaction.objectStore(tablename);
    let key = IDBKeyRange.lowerBound(0);
    let cursor = store.openCursor(key);
    cursor.onsuccess = function(e) {
        let result = e.target.result;
        if(!!result === false) return;
        myDB.indexedDB.callback(result.value);
        result.continue();
    };
    cursor.onerror = myDB.indexedDB.onerror;
}

/**
 * Supprime une données du le magasin
 * @param {*} tablename nom du magasin de données
 * @param {*} id clé de la donnée à supprimer
 */
 myDB.indexedDB.delete = function(tablename, id) {
    let db = myDB.indexedDB.db;
    let transaction = db.transaction([tablename], 'readwrite');
    let store = transaction.objectStore(tablename);
    let request = store.delete(id);
    request.onsuccess =  function(e) {
        // myDB.indexedDB.read(tablename);
    }
    request.onerror = myDB.indexedDB.onerror;
}

/**
 * Met à jour une donnée dans le magasin
 * @param {*} tablename nom du magasin de données
 * @param {*} data donnée à modifier au format JSON
 */
 myDB.indexedDB.update = function(tablename, data) {
    let db = myDB.indexedDB.db;
    let transaction = db.transaction([tablename], 'readwrite');
    let store = transaction.objectStore(tablename);
    let request = store.put(data);
    request.onsuccess =  function(e) {
        // myDB.indexedDB.read(tablename);
    }
    request.onerror = myDB.indexedDB.onerror;
}