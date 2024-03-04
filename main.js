
function showHomePage() {
     const table2 = document.getElementById("data-table");
     table2.style.display = "none";
     document.getElementById('pagination').style.display = 'block';
     fetchCurrencies(1, 6);
   }
   
   function showChangedPage() { 
    const table3 = document.getElementById("data-table");
    table3.style.display = "none"; 
    pagination.style.display = 'none';
    var pageContent = "<h2>Измененные курсы</h2><p>Здесь вы можете найти информацию о внесенных изменениях курсов валют.</p>"; 
    indexedDB.databases().then(databases => {
      const exists = databases.some(database => database.name === 'exchangeDatabase');
     if (exists) { 

    var request = indexedDB.open('exchangeDatabase', 1);

        request.onsuccess = function(event) {
           var db = event.target.result;
           var objectStore = db.transaction("exchangeCurrency").objectStore("exchangeCurrency");
           var cursorRequest = objectStore.openCursor();

           cursorRequest.onsuccess = function(event) { 
             var cursor = event.target.result;
             if (cursor) {
                var data = cursor.value;

             if (cursor.key === 1) {
                var table = document.createElement("table");
                var thead = document.createElement("thead");
                var headerRow = document.createElement("tr");
                var headers = ["Курс валют", "Валюта", "Дата"];
                headers.forEach(function(header) {
                var th = document.createElement("th");
                th.textContent = header;
                th.style.border = "1px solid black";
                th.style.textAlign = "center";
                headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                var tbody = document.createElement("tbody");
                tbody.id = "data-table-body";
                table.appendChild(tbody);

                var contentElement = document.getElementById("content");
                contentElement.innerHTML = pageContent;
                contentElement.appendChild(table);
             }

         var tbody = document.getElementById("data-table-body");
         var row = document.createElement("tr");

         var values = Object.values(data).filter(function(value, index) {
           return index !== 3;
         });
         values.forEach(function(value) {
            var cell = document.createElement("td");
            cell.textContent = value;
            cell.style.border = "1px solid black";
            cell.style.textAlign = "left";
            cell.style.padding = "5px";
            row.appendChild(cell);
         });
         tbody.appendChild(row);

         cursor.continue();
        } else {

         var table = document.getElementById("data-table");
         Array.from(table.getElementsByTagName("th")).forEach(function(th) {
         th.style.width = "100px";
        });
        Array.from(table.getElementsByTagName("td")).forEach(function(td) {
        td.style.height = "50px";
      });

    };
  } 
 };
} else {
    var contentElement = document.getElementById("content");
    pageContent += "<p>Изменения курсов еще не производились. Зайдите на страницу Поиск курса и внесите необходимые изменения</p>";
    contentElement.innerHTML = pageContent;
  }
}).catch(error => {
  console.error('Ошибка при получении списка баз данных:', error);
});
}

   
   function showSearchPage() {
    let newWindow;
     document.getElementById('pagination').style.display = 'none';
     var container = document.createElement("div");

     var dateField = document.createElement("input");
     dateField.setAttribute("type", "date");
     dateField.setAttribute("id", "dateField");

     var button = document.createElement("button");
     button.innerText = "Обработать";
     button.addEventListener("click", processDate);

     container.appendChild(dateField);
     container.appendChild(button);
     var contentElement = document.getElementById("content");
     contentElement.innerHTML = "<h2>Поиск курса валют</h2><p>Введите дату для поиска курса валюты на конкретный день. Для вывода всего списка курсов валют, очистите дату и нажмите Обработать.</p>";
     contentElement.appendChild(container);
     
     function processDate() {
          var dateInput = document.getElementById("dateField").value;
          var date = new Date(dateInput);
        
          var year = date.getFullYear();
          var month = String(date.getMonth() + 1).padStart(2, '0');
          var day = String(date.getDate()).padStart(2, '0');
        
          var formattedDateS = year + month + day;
          var formattedDate = day + '.' + month + '.' + year;

          const request = indexedDB.open('myDatabase', 1);
                    request.onupgradeneeded = event => {
                      const db = event.target.result;
                      
                      if (!db.objectStoreNames.contains('exchangeRates')) {
                        const objectStore = db.createObjectStore('exchangeRates', { keyPath: ['cc', 'exchangedate'] });
                        objectStore.createIndex('rate', 'rate', { unique: false });
                        objectStore.createIndex('exchangedate', 'exchangedate', { unique: false });
                      }
                    };

          request.onsuccess = (event) => {
          const db = event.target.result;

            if (formattedDate.toString() !== 'NaN.NaN.NaN') {
              const stringAPI = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=' + formattedDateS + '&json';
              fetchDataAndSaveToDB(stringAPI)
                setTimeout(() => {
                  displayDataInTable(db, 'exchangeRates', 'data-table', formattedDate);
                }, 1000);

            } else {
              displayDataInTable(db, 'exchangeRates', 'data-table', formattedDate);
            }
          };

     }

     function displayDataInTable(db, storeName, tableId, searchDate) {
          const transaction = db.transaction(storeName, 'readonly');
          const objectStore = transaction.objectStore(storeName);
          const request = objectStore.openCursor();
          const tableContainer = document.getElementById(tableId);
          tableContainer.style.display = "table"; 
          tableContainer.innerHTML = '';
          const table = document.createElement('table');
          table.classList.add('my-table');
          const thead = document.createElement('thead');
          const tbody = document.createElement('tbody');
          const exchangedates = {};
          const currencies = new Set();
          let sortedDates;
          request.onsuccess = (event) => {
            const cursor = event.target.result;
            const value = cursor && cursor.value;
            if (value) {
              currencies.add(value.cc);
              if (!exchangedates.hasOwnProperty(value.exchangedate)) {
                exchangedates[value.exchangedate] = {};
              }
              exchangedates[value.exchangedate][value.cc] = value.rate;
              cursor.continue();
            } else {
              const currenciesArray = Array.from(currencies.values());
              const sortedDates = Object.keys(exchangedates).sort((a, b) => {
                const dateA = new Date(a.split('.').reverse().join('-'));
                const dateB = new Date(b.split('.').reverse().join('-'));
                return dateA - dateB;
              });
              const headerRow = document.createElement('tr');
              const emptyHeaderCell = document.createElement('th');
              headerRow.appendChild(emptyHeaderCell);
              for (const currency of currenciesArray) {
                const currencyHeaderCell = document.createElement('th');
                currencyHeaderCell.textContent = currency;
                headerRow.appendChild(currencyHeaderCell);
              }
              thead.appendChild(headerRow);
              const exchangedatesArray = sortedDates;
                if (!searchDate || searchDate.toString() === 'NaN.NaN.NaN') {
               for (const exchangedate of sortedDates) {
                 const dataRow = document.createElement('tr');
                 const exchangedateHeaderCell = document.createElement('th');
                 exchangedateHeaderCell.textContent = exchangedate;
                 dataRow.appendChild(exchangedateHeaderCell);
                 let columnIndex = 0;
                 for (const currency of currenciesArray) {
                   const rate = exchangedates[exchangedate][currency] || '';
                   const currencyName = currency;
                   const dateName = exchangedate;
                   const rateCell = document.createElement('td');
                   rateCell.textContent = rate;
                   if (columnIndex >= 0) {
                    rateCell.classList.add('active-column');
                    rateCell.addEventListener('click', function () {
                      newWindow = window.open('about:blank', '_blank');
newWindow.document.write('<html><head><title>Информация о валюте</title></head><body>');
newWindow.document.write('<h1>Информация о валюте:</h1>');
newWindow.document.write('<div class="currency">');
newWindow.document.write('<label for="ccValue">Название валюты: </label><span id="ccValue">' + currencyName + '</span><br>');
newWindow.document.write('<label for="dateValue">На: </label><span id="dateValue">' + dateName + '</span><br>');
newWindow.document.write('<label for="rateValue">Значение курса: </label><span id="rateValue">' + rate + '</span><br>');
newWindow.document.write('<label for="newRate">Изменить значение курса: </label>');
newWindow.document.write('<input type="number" id="newRate">');
newWindow.document.write('<button id="changeBtn" class="btn">Изменить</button>');
                        const changeBtn = newWindow.document.getElementById('changeBtn');
                        changeBtn.addEventListener('click', function() {
                          const newRate = newWindow.document.getElementById('newRate').value;
                          if (newRate !== "") {
                            const request = indexedDB.open('exchangeDatabase', 1);

                            request.onupgradeneeded = event => {
                              const db = event.target.result;
                             if (!db.objectStoreNames.contains('exchangeCurrency')) {
                                const exchangeCurrencyStore = db.createObjectStore('exchangeCurrency', { keyPath: 'id', autoIncrement: true });
                                exchangeCurrencyStore.createIndex('ccIndex', 'cc', { unique: false });
                                exchangeCurrencyStore.createIndex('dateIndex', 'exchangedate', { unique: false });
                                exchangeCurrencyStore.createIndex('rateCcExchangedateIndex', ['rate', 'cc', 'exchangedate'], { unique: false });
                                }
                            };

                            request.onsuccess = event => {
                            const db = event.target.result;
                            const transaction = db.transaction('exchangeCurrency', 'readwrite');
                            const store = transaction.objectStore('exchangeCurrency');
                            const index = store.index('rateCcExchangedateIndex');
                            const key = IDBKeyRange.only([newRate, currencyName, dateName]);
                            const getRequest = index.openCursor(key);
                            getRequest.onsuccess = event => {
                              const cursor = event.target.result;
                              if (cursor) {

                              } else {
                                const addRequest = store.add({
                                  rate: newRate,
                                  cc: currencyName,
                                  exchangedate: dateName
                                });
                                addRequest.onsuccess = () => {
                                  newWindow.close(); 
                                };
                                addRequest.onerror = event => {
                                  console.error('Ошибка при добавлении записи в базу данных:', event.target.errorCode);
                                };
                              }
                            };
                          
                            getRequest.onerror = event => {
                              console.error('Ошибка при выполнении запроса:', event.target.errorCode);
                            };
                          
                            transaction.oncomplete = () => {
                              db.close();
                            };
                          };

                          request.onerror = event => {
                            console.error('Ошибка при открытии базы данных:', event.target.errorCode);
                          };
                          }
                        });

                   
                    })
                    rateCell.style.cursor = "pointer";
                  }
                  dataRow.appendChild(rateCell);
                  columnIndex++;
                }
                 tbody.appendChild(dataRow);
               }
             } else if (exchangedates.hasOwnProperty(searchDate)) {
               const dataRow = document.createElement('tr');
               const exchangedateHeaderCell = document.createElement('th');
               exchangedateHeaderCell.textContent = searchDate;
               dataRow.appendChild(exchangedateHeaderCell);
               let columnIndex = 0;
               for (const currency of currenciesArray) {

                 const rate = exchangedates[searchDate][currency] || '';
                 const currencyName = currency;
                 const dateName = searchDate;

                 const rateCell = document.createElement('td');
                 rateCell.textContent = rate;
                 if (columnIndex >= 0) {
                  rateCell.classList.add('active-column');
                  rateCell.addEventListener('click', function () {
    newWindow = window.open('about:blank', '_blank');
    newWindow.document.write('<html><head><title>Информация о валюте</title></head><body>');
    newWindow.document.write('<h1>Информация о валюте:</h1>');
    newWindow.document.write('<div class="currency">');
    newWindow.document.write('<label for="ccValue">Название валюты: </label><span id="ccValue">' + currencyName + '</span><br>');
    newWindow.document.write('<label for="dateValue">На: </label><span id="dateValue">' + dateName + '</span><br>');
    newWindow.document.write('<label for="rateValue">Значение курса: </label><span id="rateValue">' + rate + '</span><br>');
    newWindow.document.write('<label for="newRate">Изменить значение курса: </label>');
    newWindow.document.write('<input type="number" id="newRate">');
    newWindow.document.write('<button id="changeBtn" class="btn">Изменить</button>');
                                            const changeBtn = newWindow.document.getElementById('changeBtn');
                                            changeBtn.addEventListener('click', function() {
                                              const newRate = newWindow.document.getElementById('newRate').value;
                                              if (newRate !== "") {
                                                const request = indexedDB.open('exchangeDatabase', 1);
                    
                                                request.onupgradeneeded = event => {
                                                  const db = event.target.result;
                                                 if (!db.objectStoreNames.contains('exchangeCurrency')) {
                                                    const exchangeCurrencyStore = db.createObjectStore('exchangeCurrency', { keyPath: 'id', autoIncrement: true });
                                                    exchangeCurrencyStore.createIndex('ccIndex', 'cc', { unique: false });
                                                    exchangeCurrencyStore.createIndex('dateIndex', 'exchangedate', { unique: false });
                                                    exchangeCurrencyStore.createIndex('rateCcExchangedateIndex', ['rate', 'cc', 'exchangedate'], { unique: false });
                                                    }
                                                };
                    
                                                request.onsuccess = event => {
                                                const db = event.target.result;
                                                const transaction = db.transaction('exchangeCurrency', 'readwrite');
                                                const store = transaction.objectStore('exchangeCurrency');
                                                const index = store.index('rateCcExchangedateIndex');
                                                const key = IDBKeyRange.only([newRate, currencyName, dateName]);
                                                const getRequest = index.openCursor(key);
                                                getRequest.onsuccess = event => {
                                                  const cursor = event.target.result;
                                                  if (cursor) {
                                                  } else {
                                                    const addRequest = store.add({
                                                      rate: newRate,
                                                      cc: currencyName,
                                                      exchangedate: dateName
                                                    });
                                                    addRequest.onsuccess = () => {
                                                      newWindow.close();
                                                    };
                                                    addRequest.onerror = event => {
                                                      console.error('Ошибка при добавлении записи в базу данных:', event.target.errorCode);
                                                    };
                                                  }
                                                };
                                              
                                                getRequest.onerror = event => {
                                                  console.error('Ошибка при выполнении запроса:', event.target.errorCode);
                                                };
                                              
                                                transaction.oncomplete = () => {
                                                  db.close();
                                                };
                                              };
                    
                                              request.onerror = event => {
                                                console.error('Ошибка при открытии базы данных:', event.target.errorCode);
                                              };
                                              }
                                            });
                                       
                                        })
                  rateCell.style.cursor = "pointer";
                }
                dataRow.appendChild(rateCell);
                columnIndex++;
              }
               tbody.appendChild(dataRow);
             } else {
               const noDataRow = document.createElement('tr');
               const noDataCell = document.createElement('td');
               noDataCell.colSpan = currencies.size + 1;
               noDataCell.textContent = 'Нет данных для указанной даты. Ваша дата из будущего.';
               noDataRow.appendChild(noDataCell);
               tbody.appendChild(noDataRow);
             }

              table.appendChild(thead);
              table.appendChild(tbody);
              tableContainer.appendChild(table);
            }
          };
          const transactionBd = db.transaction(storeName, 'readonly');
          const objectStoreBd = transactionBd.objectStore(storeName);
          
          const requestBd = objectStore.count();
          requestBd.onsuccess = function(event) {
            const count = event.target.result;
            if (count === 0) {
               const noDataRow = document.createElement('tr');
               const noDataCell = document.createElement('td');
               noDataCell.colSpan = currencies.size + 1;
               noDataCell.textContent = 'Данных по курсам валют пока нет. Введите дату.';
               noDataRow.appendChild(noDataCell);
               tbody.appendChild(noDataRow);
               table.appendChild(thead);
               table.appendChild(tbody);
               tableContainer.appendChild(table);
            }
          };


          request.onerror = (event) => {
            console.error('Ошибка при открытии курсора:', event.target.error);
          };
        }
      }
        
async function fetchCurrencies(page, perPage) {
     const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
     const data = await response.json();
     const totalCount = data.length;
     const currencies = data.slice((page - 1) * perPage, page * perPage);
     renderCurrencies(currencies);
     renderPagination(totalCount, page, perPage);    
   }

   fetchCurrencies(1, 6);
   
   function renderCurrencies(currencies) {
     const content = document.getElementById('content');
     content.innerHTML = '';
   
     const header = document.createElement('div');
     const dateParts = currencies[0].exchangedate.split("-");
     const year = dateParts[0];
     header.innerHTML = `<h1>Курсы валют на ${year}</h1>`;
     content.appendChild(header);
   
     currencies.forEach(currency => {
       const currencyDiv = document.createElement('div');
       currencyDiv.innerHTML = `<p>${currency.cc} (${currency.txt}): ${currency.rate}</p>`;
       content.appendChild(currencyDiv);
     });
   }
   
function renderPagination(totalCount, currentPage, perPage) {
     const pagination = document.getElementById('pagination');
     pagination.innerHTML = '';
   
     const totalPages = Math.ceil(totalCount / perPage);
   
     for (let i = 1; i <= totalPages; i++) {
       const button = document.createElement('button');
       button.innerHTML = i;
       button.addEventListener('click', () => {
         fetchCurrencies(i, perPage);
       });
       pagination.appendChild(button);
     }
   
     const buttons = pagination.getElementsByTagName('button');
     buttons[currentPage - 1].classList.add('active');
   }

   function fetchDataAndSaveToDB(apiString) {
    const databaseName = 'myDatabase';
     const request = indexedDB.open(databaseName, 1);

     request.onsuccess = function(event) {
      const db = event.target.result;
      const version = db.version;
    };

     request.onerror = function(event) {
          console.error(`Ошибка при открытии базы данных: ${event.target.error}`);
        };
        
        indexedDB.onblocked = function(event) {
          console.error('База данных заблокирована другим открытым соединением.');
        };
   
     request.onupgradeneeded = function(event) {
       const db = event.target.result;
   
       if (!db.objectStoreNames.contains('exchangeRates')) {
         const objectStore = db.createObjectStore('exchangeRates', { keyPath: ['cc', 'exchangedate'] });
         objectStore.createIndex('rate', 'rate', { unique: false });
         objectStore.createIndex('exchangedate', 'exchangedate', { unique: false });
       }
     };
   
     request.onsuccess = function(event) {
       const db = event.target.result;

       fetch(apiString)
         .then(response => response.json())
         .then(data => {
           const transaction = db.transaction('exchangeRates', 'readwrite');
           const objectStore = transaction.objectStore('exchangeRates');

      const cursorRequest = objectStore.openCursor();
      cursorRequest.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          cursor.continue();
        }
      };
           data.forEach(currency => {
             const request = objectStore.index('exchangedate').get(currency.exchangedate);
   
             request.onsuccess = function(event) {
               const existingRecord = event.target.result;
   
               if (existingRecord) {
                 existingRecord.rate = currency.rate;
                 const updateRequest = objectStore.put(existingRecord);
   
                 updateRequest.onsuccess = function(event) {

                 }
                 updateRequest.onerror = function(event) {
                   console.error(`Ошибка при обновлении данных для ${currency.exchangedate} в базе данных`);
                 }
               } else {
                 const addRequest = objectStore.add(currency);
   
                 addRequest.onsuccess = function(event) {
                    const key = event.target.result;
                 }
                 addRequest.onerror = function(event) {
                    console.error(`Ошибка при добавлении данных для ${currency.exchangedate} в базу данных:`, event.target.error);
                  }
               }
             }
             
             request.onerror = function(event) {
               console.error(`Ошибка при получении данных для ${currency.exchangedate} из базы данных`);
             }
           });
         });
     }
   }
  
