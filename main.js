
function showHomePage() {
     const table2 = document.getElementById("data-table");
     table2.style.display = "none"; // Скрыть таблицу
     document.getElementById('pagination').style.display = 'block';
     fetchCurrencies(1, 6);
     //var pageContent = "<h2>Главная страница</h2><p>Добро пожаловать на главную страницу!</p>";
     //document.getElementById('content').innerHTML = pageContent;
   
     // Перезагрузка страницы с новым URL
     //window.location.href = "file:///C:/Converter/index.html"
   }
   
   function showChangedPage() {
    const table3 = document.getElementById("data-table");
    table3.style.display = "none"; // Скрыть таблицу

    pagination.style.display = 'none';
    var pageContent = "<h2>Измененные курсы</h2><p>Здесь вы можете найти информацию о внесенных изменениях курсов валют.</p>";

    var request = indexedDB.open('exchangeDatabase', 1);

        request.onsuccess = function(event) {
           var db = event.target.result;

     // Получаем хранилище объектов
           var objectStore = db.transaction("exchangeCurrency").objectStore("exchangeCurrency");
           //var index = objectStore.index("dateIndex");
           //console.log(index); // Выводим индекс на консоль
           //var cursorRequest = index.openCursor(null, "prev");
           //console.log(cursorRequest); // Выводим курсор на консоль
           var cursorRequest = objectStore.openCursor();

           cursorRequest.onsuccess = function(event) {
             var cursor = event.target.result;
             if (cursor) {
                var data = cursor.value;

              // Создаем таблицу при первой итерации
             if (cursor.key === 1) {
                var table = document.createElement("table");
                var thead = document.createElement("thead");
                var headerRow = document.createElement("tr");
                var headers = ["Курс валют", "Валюта", "Дата"]; // Заголовки полей таблицы
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

         // Добавляем строки с данными в таблицу
         var tbody = document.getElementById("data-table-body");
         var row = document.createElement("tr");

         var values = Object.values(data).filter(function(value, index) {
           return index !== 3; // Исключаем поле id
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
       console.log("Конец данных");

      // Изменяем размеры столбцов и строк
         var table = document.getElementById("data-table");
         Array.from(table.getElementsByTagName("th")).forEach(function(th) {
         th.style.width = "100px";
        });
        Array.from(table.getElementsByTagName("td")).forEach(function(td) {
        td.style.height = "50px";
      });
    }
  };
 };

  request.onerror = function(event) {
   console.error("Ошибка открытия базы данных:", event.target.errorCode);
  };
}


     /*document.getElementById('content').innerHTML = pageContent;
   
     document.getElementById('content').innerHTML = "<h2>Измененные курсы</h2><p>Здесь вы можете найти информацию о последних изменениях курсов валют.</p>";

var data = [
     { name: "Иван", age: 25, city: "Москва" },
     { name: "Елена", age: 30, city: "Санкт-Петербург" },
     { name: "Алексей", age: 40, city: "Новосибирск" }
   ];
   
   // Создаем таблицу
   var table = document.createElement("table");
   
   // Создаем заголовок таблицы
   var thead = document.createElement("thead");
   var headerRow = document.createElement("tr");
   Object.keys(data[0]).forEach(function(key) {
     var th = document.createElement("th");
     th.textContent = key;
     th.style.border = "1px solid black"; // Добавляем границы ячеек
     th.style.textAlign = "center"; // Центрируем текст в ячейке заголовка
     headerRow.appendChild(th);
   });
   thead.appendChild(headerRow);
   table.appendChild(thead);
   
   // Создаем тело таблицы
   var tbody = document.createElement("tbody");
   data.forEach(function(rowData) {
     var row = document.createElement("tr");
     Object.values(rowData).forEach(function(value) {
       var cell = document.createElement("td");
       cell.textContent = value;
       cell.style.border = "1px solid black"; // Добавляем границы ячеек
       cell.style.textAlign = "left"; // Выравниваем текст в ячейке по левому краю
       cell.style.padding = "5px"; // Добавляем отступы внутри ячейки
       row.appendChild(cell);
     });
     tbody.appendChild(row);
   });
   table.appendChild(tbody);
   
   // Изменяем размеры столбцов и строк
   Array.from(table.getElementsByTagName("th")).forEach(function(th) {
     th.style.width = "100px"; // Меняем ширину столбцов
   });
   Array.from(table.getElementsByTagName("td")).forEach(function(td) {
     td.style.height = "50px"; // Меняем высоту строк
   });
   
   // Добавляем таблицу на страницу
   var contentElement = document.getElementById("content");
   contentElement.appendChild(table);*/
//}
   
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
     contentElement.innerHTML = "<h2>Поиск курса валют</h2><p>Введите дату для поиска курса валюты на конкретный день. Для возврата в общий список очистите дату.</p>";
     contentElement.appendChild(container);
     
     function processDate() {
          var dateInput = document.getElementById("dateField").value;
          var date = new Date(dateInput);
          console.log('Дата в введенном поле:', Date);
        
          var year = date.getFullYear();
          var month = String(date.getMonth() + 1).padStart(2, '0'); // добавляем ведущий ноль
          var day = String(date.getDate()).padStart(2, '0'); // добавляем ведущий ноль
        
          var formattedDateS = year + month + day;
          var formattedDate = day + '.' + month + '.' + year;
          console.log('Дата для проверки в базе:',formattedDate);
          console.log('Дата для передачи API',formattedDateS);
          console.log('Дата для передачи API toString',formattedDate.toString());

          const request = indexedDB.open('myDatabase', 1);
          request.onerror = (event) => {
            console.error('Ошибка при открытии базы данных:', event.target.errorCode);
          };
          request.onsuccess = (event) => {
            const db = event.target.result;
                // Вызвать функцию displayDataInTable с передачей даты, если она введена
            if (formattedDate.toString() !== 'NaN.NaN.NaN') {
              //console.log('Проверка даты после введения',formattedDate.toString());
              const stringAPI = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=' + formattedDateS + '&json';
              fetchDataAndSaveToDB(stringAPI)
              //.then(() => {
                setTimeout(() => {
                  displayDataInTable(db, 'exchangeRates', 'data-table', formattedDate);
                  console.log('Дата переданная для вывода на экран',formattedDate);
                }, 1000);
                //})
                //.catch(error => {
                //  console.error("Произошла ошибка:", error);
                //});
            } else {
              displayDataInTable(db, 'exchangeRates', 'data-table', formattedDate);
            }
          };
          //displayDataInTable(db, 'exchangeRates', 'data-table', formattedDate);
     }

     //const table = document.createElement('table');

     // Вывод в таблицу на странице Получаем данные и добавляем строки в таблицу
     function displayDataInTable(db, storeName, tableId, searchDate) {
          console.log('Дата преданная для вывода в таблицу на странице',searchDate);
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
              console.log('Дата перед проверкой есть ли в базе данных', searchDate);
                if (!searchDate || searchDate.toString() === 'NaN.NaN.NaN') {
               // Если дата не указана или пустая строка, выводим всю базу данных
               //console.log('Массив');
               //console.log(exchangedates);
               //console.log(currenciesArray);
               //console.log(sortedDates);
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
                      //newWindow = window.open('', '_blank');
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
                               // Добавляем индекс rateCcExchangedateIndex
                                exchangeCurrencyStore.createIndex('rateCcExchangedateIndex', ['rate', 'cc', 'exchangedate'], { unique: false });
                                }
                            };

                            request.onsuccess = event => {
                            const db = event.target.result;
                            const transaction = db.transaction('exchangeCurrency', 'readwrite');
                            const store = transaction.objectStore('exchangeCurrency');
                             // Создаем индекс на комбинацию полей rate, cc и exchangedate
                            const index = store.index('rateCcExchangedateIndex');
                              // Создаем ключ для поиска в индексе
                            const key = IDBKeyRange.only([newRate, currencyName, dateName]);
                            // Получаем запись с соответствующими значениями
                            const getRequest = index.openCursor(key);
                            getRequest.onsuccess = event => {
                              const cursor = event.target.result;
                              if (cursor) {
                                // Запись с такими же значениями уже существует
                                console.log('Такая запись уже существует в базе данных');
                              } else {
                                // Запись не найдена, производим вставку новой записи в хранилище
                                const addRequest = store.add({
                                  rate: newRate,
                                  cc: currencyName,
                                  exchangedate: dateName
                                });
                                addRequest.onsuccess = () => {
                                  console.log('Запись успешно добавлена в базу данных');
                                  newWindow.close(); // Закрытие окна после добавления данных в базу
                                  console.log('Окно должно быть закрыто');
                                };
                                addRequest.onerror = event => {
                                  console.error('Ошибка при добавлении записи в базу данных:', event.target.errorCode);
                                };
                              }
                            };
                          
                            getRequest.onerror = event => {
                              console.error('Ошибка при выполнении запроса:', event.target.errorCode);
                            };
                          
                            // Закрываем транзакцию и базу данных
                            transaction.oncomplete = () => {
                              db.close();
                            };
                          };

                          request.onerror = event => {
                            console.error('Ошибка при открытии базы данных:', event.target.errorCode);
                          };
                          }
                        });
                        //console.log('МЗакрытие окна конец функции');
                    //newWindow.document.close();
                   
                    })
                    //console.log('МЗакрытие окна конец функции');
                    rateCell.style.cursor = "pointer";
                  }
                  dataRow.appendChild(rateCell);
                  columnIndex++;
                }
                 tbody.appendChild(dataRow);
               }
             } else if (exchangedates.hasOwnProperty(searchDate)) {
               // Если дата есть в базе данных, выводим данные только на эту дату
               const dataRow = document.createElement('tr');
               const exchangedateHeaderCell = document.createElement('th');
               exchangedateHeaderCell.textContent = searchDate;
               dataRow.appendChild(exchangedateHeaderCell);
               let columnIndex = 0;
               for (const currency of currenciesArray) {
                console.log('Отработка rem функции1/3');
                 const rate = exchangedates[searchDate][currency] || '';
                 const rateCell = document.createElement('td');
                 rateCell.textContent = rate;
                 if (columnIndex >= 0) {
                  rateCell.classList.add('active-column');
                  rateCell.addEventListener('click', function () {
                    window.open('about:blank'); 
                  });
                  rateCell.style.cursor = "pointer";
                }
                dataRow.appendChild(rateCell);
                columnIndex++;
              }
               tbody.appendChild(dataRow);
             } else {
               // Если дата не найдена в базе данных, выводим сообщение об отсутствии данных
               console.log('Выполнение нет даты в базе данных', searchDate);
               const noDataRow = document.createElement('tr');
               const noDataCell = document.createElement('td');
               noDataCell.colSpan = currencies.size + 1;
               noDataCell.textContent = 'Нет данных для указанной даты';
               noDataRow.appendChild(noDataCell);
               tbody.appendChild(noDataRow);
               console.log('Отработка rem функции1/2');
             }
              table.appendChild(thead);
              table.appendChild(tbody);
              tableContainer.appendChild(table);
              console.log('Отработка rem функции1/1');
            }
          };
          request.onerror = (event) => {
            console.log('Отработка rem функции1');
            console.error('Ошибка при открытии курсора:', event.target.error);
          };
        }
        console.log('Отработка rem функции2');
        const request = indexedDB.open('myDatabase', 1);
        console.log('Отработка rem функции3');
        request.onerror = (event) => {
          console.log('Отработка rem функции4');
          console.error('Ошибка при открытии базы данных:', event.target.errorCode);
        };
        request.onsuccess = (event) => {
          console.log('Отработка rem функции5');
          const db = event.target.result;
          //displayDataInTable(db, 'exchangeRates', 'data-table', null);
        };
      }
        


   // Функция для загрузки списка валют на определенной странице
async function fetchCurrencies(page, perPage) {
     const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
     const data = await response.json();
     //const result = data;
     //console.log(result);
     const totalCount = data.length;
     const currencies = data.slice((page - 1) * perPage, page * perPage);
     //console.log(currencies);
     renderCurrencies(currencies);
     renderPagination(totalCount, page, perPage);    
   }

   fetchCurrencies(1, 6);
   
   // Функция для отображения списка курсов
   function renderCurrencies(currencies) {
     const content = document.getElementById('content');
     content.innerHTML = ''; // Очистка контейнера перед отрисовкой новых данных
   
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
   
 // Функция для отображения пейджинации
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
   
   // Загрузка дефолтного списка валют при загрузке страницы
   // Старый вывод фунуции первой страницы
   // fetchCurrencies(1, 6);

   // 2. Сохранение json с датой в строке в локальную базу
   function fetchDataAndSaveToDB(apiString) {
    //return new Promise((resolve, reject) => {
    //const response = await fetch(apiString);
    //const data = await response.json();
    console.log(apiString);
    const databaseName = 'myDatabase';
     //indexedDB.deleteDatabase(databaseName); 
     const request = indexedDB.open(databaseName, 1);
     request.onerror = function(event) {
          console.error(`Ошибка при открытии базы данных: ${event.target.error}`);
        };
        
        indexedDB.onblocked = function(event) {
          console.error('База данных заблокирована другим открытым соединением.');
        };
   
     request.onerror = function(event) {
       console.error("Ошибка при открытии базы данных: " + event.target.errorCode);
     };
   
     request.onupgradeneeded = function(event) {
       const db = event.target.result;
   
       if (!db.objectStoreNames.contains('exchangeRates')) {
        console.log('оздание объектного хранилища, если оно не существует');
        console.log('keyPath: cc, exchangedate');
         // Создание объектного хранилища 'exchangeRates', если оно не существует
         //const objectStore = db.createObjectStore('exchangeRates', { keyPath: 'cc' });
         const objectStore = db.createObjectStore('exchangeRates', { keyPath: ['cc', 'exchangedate'] });
   
         // Создание индекса для поля 'rate' в объектном хранилище
         objectStore.createIndex('rate', 'rate', { unique: false });
         objectStore.createIndex('exchangedate', 'exchangedate', { unique: false }); // Создаем индекс 'exchangedate
       }
     };
   
     request.onsuccess = function(event) {
       const db = event.target.result;
   
       // Загрузка данных с сервера и их сохранение в базу данных
       fetch(apiString)
         .then(response => response.json())
         .then(data => {
           //console.log('Данные полученные в API при поиске курса по дате',data);
           const transaction = db.transaction('exchangeRates', 'readwrite');
           const objectStore = transaction.objectStore('exchangeRates');

                 // Добавляем или обновляем записи

      const cursorRequest = objectStore.openCursor();
      cursorRequest.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          console.log('Данные добавленные в базу после API по дате',cursor.value);
          cursor.continue();
        }
      };
   
           // Перебор каждого элемента массива данных, полученных с сервера
           data.forEach(currency => {
             const request = objectStore.index('exchangedate').get(currency.exchangedate);
   
             request.onsuccess = function(event) {
               const existingRecord = event.target.result;
   
               if (existingRecord) {
                 // Обновление данных, если запись уже существует
                 existingRecord.rate = currency.rate;
                 const updateRequest = objectStore.put(existingRecord);
   
                 updateRequest.onsuccess = function(event) {
                   console.log(`Данные для ${currency.exchangedate} были успешно обновлены в базе данных ранее`);
                 }
                 updateRequest.onerror = function(event) {
                   console.error(`Ошибка при обновлении данных для ${currency.exchangedate} в базе данных`);
                 }
               } else {
                 // Создание новой записи, если запись не существует
                 const addRequest = objectStore.add(currency);
   
                 addRequest.onsuccess = function(event) {
                    const key = event.target.result;
                    console.log('Добавлена запись с ключом:', key);
                    console.log(`Данные для ${currency.exchangedate} были успешно добавлены в базу данных `);
                           // Если запись добавлена, вызываем функцию для отображения данных в таблице
                          // displayDataInTable(db, 'exchangeRates', 'data-table', exchangedate);
                 }
                 addRequest.onerror = function(event) {
                    console.error(`Ошибка при добавлении данных для ${currency.exchangedate} в базу данных:`, event.target.error);
                         // Если произошла ошибка при добавлении записи, вызываем функцию для отображения данных в таблице без передачи даты
                           // displayDataInTable(db, 'exchangeRates', 'data-table');
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
  
