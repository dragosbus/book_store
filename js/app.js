import './idb';

let value, version = 1;

const data = (function () {

  let dbPromiseHandler, saveData, getData;

  dbPromiseHandler = val => {
    
    return idb.open(`${value}`, version, upgradeDb => {
      upgradeDb.createObjectStore(val, {
        keyPath: 'volumeInfo.publishedDate'
      });
    });
  };

  saveData = res => {
    let dbPromise = dbPromiseHandler(value);
    return dbPromise.then(db => {
      let tx = db.transaction(value, 'readwrite');
      let store = tx.objectStore(value);
      res.forEach(book => store.put(book));
      return tx.complete;
    });
  };

  getData = () => {
    let dbPromise = dbPromiseHandler(value);
    dbPromise.then(db => {
      let tx = db.transaction(value);
      let store = tx.objectStore(value);
      return store.getAll();
    });
  };

  return {
    dbPromiseHandler,
    saveData,
    getData
  };

}());


const view = (function () {

  const form = document.querySelector('.search');
  const input = document.querySelector('.text');
  const booksUl = document.querySelector('.books');

  let errorHandler = message => {
    let msg = document.createElement('p');
    msg.classList.add('error-msg');
    msg.textContent = message;

    booksUl.appendChild(msg);
  };

  const showForm = () => {
    form.classList.toggle('show-form');
  };

  const makeLi = (titleText, url, sourcePhoto) => {
    let li = document.createElement('li');
    let title = document.createElement('h2');
    let link = document.createElement('a');
    let image = document.createElement('img');
    image.src = sourcePhoto;
    title.textContent = titleText;
    link.setAttribute('href', url);
    link.textContent = 'Buy';

    li.appendChild(image);
    li.appendChild(title);
    li.appendChild(link);

    return li;
  };

  return {
    form,
    input,
    showForm,
    makeLi,
    booksUl,
    errorHandler
  };

}());

document.querySelector('.fa').addEventListener('click', view.showForm);

view.form.addEventListener('submit', e => {
  e.preventDefault();
  let url = `https://www.googleapis.com/books/v1/volumes?q=${view.input.value}`;
  value = view.input.value;
  view.booksUl.innerHTML = '';

  return new Promise((resolve, reject) => {
      if (view.input.value) {
        resolve(url);
      } else {
        reject('Invalid Url');
      }
    }).then(res => {
      return fetch(res).then(response => response.json())
        .then(result => result.items)
        .then(data.saveData)
        .catch(err => {
          view.errorHandler("The book is not avaible");
          /*Because a new DB is created,even the result is invalid, delete the new invalid DB created
          */
          indexedDB.deleteDatabase(`${value}-${version}`)
        });
      //end fetching and saving data to indexDB
    }).then(() => {
      //make an transaction with the db with name with the current value of the input
      let dbPromise = data.dbPromiseHandler();
      dbPromise.then(db => {
        let tx = db.transaction(value);
        let store = tx.objectStore(value);
        return store.getAll();
      }).then(res => {
        console.log(res);
        res.forEach(book => {
          let {
            saleInfo: {
              buyLink
            },
            volumeInfo: {
              title,
              categories,
              authors,
              imageLinks: {
                thumbnail
              }
            }
          } = book;
          let li = view.makeLi(title, buyLink, thumbnail);
          view.booksUl.appendChild(li);
          view.input.value = '';
          version += 1;
        }); //end foreach
      }); //end appending data to the DOM
    }) //end transaction
    .catch(err => {
      view.errorHandler("The book is not avaible or the value entered is invalid.Please type a valid value");
    });
}); //end event listener