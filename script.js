// Timer
      function updateTime() {
        const now = new Date().getTime();
        const distance = now - startTime;

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');

        const timerDiv = document.getElementById('timer');
        timerDiv.innerHTML = `${minutesStr}:${secondsStr}`;
      }

      let startTime;
      let timerInterval;

      function startTimer() {
        startTime = new Date().getTime();
        timerInterval = setInterval(function() {
          updateTime();
          if (Lösungszahl.length === 0) {
            clearInterval(timerInterval);
            const now = new Date().getTime();
            const distance = now - startTime;
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            const timeString = `${minutes} Minuten und ${seconds} Sekunden`;
            alert(`Du hast ${timeString} gebraucht.`);
            saveTime(timeString);
          }
        }, 1000);
      }

      function saveTime(timeString) {
        // Holen Sie sich die bisher gespeicherten Zeiten oder erstellen Sie ein leeres Array, wenn keine vorhanden sind
        let times = JSON.parse(localStorage.getItem("times")) || [];
        // Fügen Sie die neue Zeit hinzu
        times.push(timeString);
        // Speichern Sie das aktualisierte Array in localStorage
        localStorage.setItem("times", JSON.stringify(times));
      
        // Öffnen der Datenbank
        const request = window.indexedDB.open('ZeitenDB', 1);
      
        // Wenn die Datenbank geöffnet wurde
        request.onsuccess = function(event) {
          const db = event.target.result;
      
          // Hinzufügen der Zeit in die Datenbank
          const addRequest = db.transaction('zeiten', 'readwrite')
            .objectStore('zeiten')
            .add({ time: timeString });
      
          addRequest.onsuccess = function() {
            console.log('Zeit erfolgreich in Datenbank gespeichert');
          };
      
          addRequest.onerror = function() {
            console.error('Fehler beim Speichern der Zeit in Datenbank');
          };
        };
      
        // Wenn die Datenbank nicht geöffnet werden kann
        request.onerror = function(event) {
          console.error('Fehler beim Öffnen der Datenbank');
        };
      
        // Erstellen des Object Stores, wenn die Datenbank neu erstellt wird
        request.onupgradeneeded = function(event) {
          const db = event.target.result;
      
          const objectStore = db.createObjectStore('zeiten', { keyPath: 'id', autoIncrement:true });
      
          console.log('Object Store erfolgreich erstellt');
        };
      }

      function showTimeList() {
        const timeListElement = document.getElementById('timeList');

        // Leeren der Tabelle, bevor neue Daten hinzugefügt werden
        timeListElement.innerHTML = '';
      
        // Öffnen der Datenbank
        const request = window.indexedDB.open('ZeitenDB', 1);
      
        // Wenn die Datenbank geöffnet wurde
        request.onsuccess = function(event) {
          const db = event.target.result;
      
          // Öffnen des Object Stores
          const transaction = db.transaction('zeiten', 'readonly');
          const objectStore = transaction.objectStore('zeiten');
      
          // Abrufen aller gespeicherten Zeiten
          const getRequest = objectStore.getAll();
      
          getRequest.onsuccess = function() {
            const timeList = getRequest.result;
            // Anzeigen der Zeiten auf der Webseite
            timeList.forEach(time => {
              const listItem = document.createElement('li');
              listItem.textContent = time.time;
              timeListElement.appendChild(listItem);
            });
          };
        };
      
        // Wenn die Datenbank nicht geöffnet werden kann
        request.onerror = function(event) {
          console.error('Fehler beim Öffnen der Datenbank');
        };
      }
      
      // Event Listener hinzufügen
      document.getElementById('button2').addEventListener('click', showTimeList);
      
      document.getElementById('button1').addEventListener('click', function() {
        if (Lösungszahl.length === 50) {
          startTimer();
        }
      });

      let Lösungszahl = Array.from({length: 50}, (v, k) => k + 1);

      function generateRandomNumber() {
        // Wähle eine zufällige Zahl aus dem Array
        const index = Math.floor(Math.random() * Lösungszahl.length);
        window.Zahl = Lösungszahl[index];

        // Entferne die verwendete Zahl aus dem Array
        Lösungszahl.splice(index, 1);
      }

      // Füge einen Event Listener hinzu, der die generateRandomNumber-Funktion ausführt, wenn der Button geklickt wird
      document.getElementById('button1').addEventListener('click', () => {
        generateRandomNumber();
        document.getElementById('number1').value = window.Zahl;
      });

      const Spielfeld = [
        1, 1, 1, 1, 1,
        2, 2, 2, 2, 2, 2,
        3, 3, 3, 3, 3, 3,
        4, 4, 4, 4, 4,
        5, 5, 5, 5, 5, 5,
        6, 6, 6, 6, 6,
        7, 7, 7, 7, 7,
        8, 8, 8, 8, 8, 8,
        9, 9, 9, 9, 9
      ]; // Pool an Zahlen, aus denen die Buttons generiert werden sollen

      const table = document.getElementById('gameTable');
      const selectedNumbers = document.getElementById('selectedNumbers');

      let clicks = 0; // Zähle, wie viele Klicks auf Buttons stattgefunden haben

      for (let i = 0; i < 7; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
          const cell = document.createElement('td');
          const button = document.createElement('button');

          // Wähle eine zufällige Zahl aus dem Array
          const index = Math.floor(Math.random() * Spielfeld.length);
          const number = Spielfeld[index];

          // Setze den Text des Buttons auf die zufällige Zahl
          button.innerHTML = number;

          // Entferne die verwendete Zahl aus dem Array
          Spielfeld.splice(index, 1);

            // Überprüfen der position
          function isAdjacent(row, column) {
            if (clicks === 0) {
              return true;
            } else if (lastRow === row && Math.abs(lastColumn - column) <= 1) {
              return true;
            } else if (lastColumn === column && Math.abs(lastRow - row) <= 1) {
              return true;
            } else if (Math.abs(lastRow - row) === 1 && Math.abs(lastColumn - column) === 1) {
              return true;
            } else {
              return false;
            }
          }

           // Füge einen Event-Listener hinzu, um auf Klick-Ereignisse zu reagieren
           button.addEventListener('click', () => {
            if (clicks === 0 || isAdjacent(i, j)) {
              // Erhöhe den Klick-Zähler um 1 und speichere die Zeile und Spalte der aktuellen Schaltfläche
              clicks++;
              lastRow = i;
              lastColumn = j;

              if (clicks <= 3) {
                // Setze die Hintergrundfarbe des Buttons auf schwarz
                button.style.backgroundColor = 'black';
                button.style.color = 'white';
                // Füge den Text des gedrückten Buttons zu den ausgewählten Zahlen hinzu
                selectedNumbers.innerHTML += `${button.innerHTML} `;

                button.disabled = true;

                // Berechne das Ergebnis, falls alle 3 Knöpfe gedrückt wurden (Addition)
                if (clicks === 3) {
                  const result = parseInt(selectedNumbers.innerHTML.split(' ')[0]) *
                                parseInt(selectedNumbers.innerHTML.split(' ')[1]) +
                                parseInt(selectedNumbers.innerHTML.split(' ')[2]);
                  document.getElementById('result').value = result;
                
                // Berechne das Ergebnis, falls alle 3 Knöpfe gedrückt wurden (Subtraktion)
                  const result1 = parseInt(selectedNumbers.innerHTML.split(' ')[0]) *
                                parseInt(selectedNumbers.innerHTML.split(' ')[1]) -
                                parseInt(selectedNumbers.innerHTML.split(' ')[2]);
                  document.getElementById('result2').value = result1;
                
                const buttons = document.querySelectorAll('button');

                buttons.forEach(button => {
                    button.disabled = true;
                  });

                  const solution = window.Zahl;
                  const var1 = result;
                  const var2 = result1;
                
                  // Compare result1 to the solution
                  if (var1 === solution) {
                    buttons.forEach((button) => {
                        button.style.backgroundColor = 'green';
                        button.style.color = 'black';
                    });

                    // Ton abspielen
                    const audio = new Audio('Musik/korrekt.mp3');
                    audio.play();
                    }
                    else if (var2 === solution) {
                        buttons.forEach((button) => {
                            button.style.backgroundColor = 'green';
                            button.style.color = 'black';
                        });

                        // Ton abspielen
                        const audio = new Audio('Musik/korrekt.mp3');
                        audio.play();
                      } 
                    else {
                      buttons.forEach((button) => {
                        button.style.backgroundColor = 'red';
                        button.style.color = 'black';
                    });
                    // Ton abspielen
                    const audio = new Audio('Musik/wrong.mp3');
                    audio.play();
                    setTimeout(() => {
                       alert('Das ist leider Falsch');
                      }, 100);
                    }
                }
                
                if (clicks === 3) {
                  clicks = 0;
                  setTimeout(() => {
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach((button) => {
                      button.disabled = false;
                      button.style.backgroundColor = '';
                      button.style.color = '';
                      document.getElementById('result2').value = '';
                      document.getElementById('result').value = '';
                      selectedNumbers.innerHTML = '';
                    });
                  }, 1000);
                }
              }
            }
          });
          cell.appendChild(button);
          row.appendChild(cell);
        }
        table.appendChild(row);
      }

const helpButton = document.getElementById("hilfe");
const helpOverlay = document.getElementById("overlay");
const helpText = document.getElementById("text");
const closeButton = document.getElementById("close");

helpButton.addEventListener("click", function() {
    helpOverlay.style.display = "block";
    closeButton.style.display = "block";
});

closeButton.addEventListener("click", function() {
    helpOverlay.style.display = "none";
    closeButton.style.display = "none";
});
