document.addEventListener('DOMContentLoaded', () => {
    const rows = parseInt(prompt('Մուտքագրեք տողերի քանակը` (10-30):'), 10) || 10;
    const cols = parseInt(prompt('Մուտքագրեք սյունակների քանակը `(10-30):'), 10) || 10;

    if (rows < 10 || cols < 10 || rows > 30 || cols > 30) {
      alert('Խնդրում ենք մուտքագրել թվեր նշված միջակայքում (10-30).');
      return;
    }

    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timerDisplay';
    document.body.appendChild(timerDisplay);

    const snakeBoard = document.createElement('table');
    snakeBoard.id = 'snakeBoard';
    document.body.appendChild(snakeBoard);

    let board = createEmptyBoard(rows, cols);
    let snake = [{ row: 2, col: 2 }];
    let direction = 'right';
    let intervalId;
    let startTime;
    let score = 0; 
    let foodCount = 0; // Օգտագործված սննդի քանակը
    let startTimestamp;      

    function renderBoard() {
      snakeBoard.innerHTML = ''; //Մաքրել snakeBoard-ի բովանդակությունը
      //Կրկնեք board-ի յուրաքանչյուր տողի միջով
      for (let i = 0; i < rows; i++) {
        const rowElement = document.createElement('tr');//// Ստեղծեք նոր <td> տարր յուրաքանչյուր բջիջի համար
        for (let j = 0; j < cols; j++) {
          const cellElement = document.createElement('td');
          if (board[i][j] === 1) {
            cellElement.className = 'snake';
            if (i === snake[0].row && j === snake[0].col) {
              cellElement.classList.add('snake-head');
            }
          } else if (board[i][j] === 2) {
            cellElement.className = 'food';
          }
          rowElement.appendChild(cellElement);//// Ներկայիս տողում ավելացրեք cell-ը
        }
        snakeBoard.appendChild(rowElement);//// Կցեք տողի տարրը snakeBoard-ին
      }
    }


    // createEmptyBoard ֆունկցիան պատասխանատու է
    // մատրիցան ստեղծելու և վերադարձնելու համար։
    function createEmptyBoard(rows, cols) {
      const board = [];
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          row.push(0);
        }
        board.push(row);
      }
      return board;
    }


    //Տրամադրված կոդի renderBoard ֆունկցիան պատասխանատու է HTML փաստաթղթում խաղի տախտակի տեսողական ներկայացման թարմացման համար՝
    // հիմնվելով խաղի ներկա վիճակի վրա:
 

    function updateSnake() {
      const head = { ...snake[0] }; //Ստեղծել օձի գլխի պատճենը.
      switch (direction) {          
        //Թարմացրել գլխի դիրքը ընթացիկ ուղղության հիման վրա.
        case 'up':
          head.row = (head.row - 1 + rows) % rows;
          break;
        case 'down':
          head.row = (head.row + 1) % rows;
          break; 
        case 'left':
          head.col = (head.col - 1 + cols) % cols;
          break;
        case 'right':
          head.col = (head.col + 1) % cols;
          break;
      }

      
      if (
        checkSelfCollision(head) // ստուգում է, թե արդյոք օձի գլուխը բախվել է օձի մարմնի որևէ այլ մասի:
      ) {
        clearInterval(intervalId);
        alert(`Խաղն ավարտված է!\nTime: ${getTimeElapsed(startTime)} Վայրկյան\nԿերած խնձորներ: ${foodCount}`);
        resetGame();
        startGame(); //Ավտոմատ կերպով սկսել նոր խաղ
        return;
      }

      snake.unshift(head);

      // սննդի ստուգում
      if (board[head.row][head.col] === 2) {
        // մեծացրել օձի երկարությունը
        board[head.row][head.col] = 1;
        generateFood();
        foodCount += 1;
      } else {
        // Տեղափոխել օձը
        const tail = snake.pop();
        board[tail.row][tail.col] = 0;
      }

      board[head.row][head.col] = 1;
      renderBoard();
      updateTimer();
    }

    function checkSelfCollision(head) {
      return snake.some(segment => segment.row === head.row && segment.col === head.col);
    }


    //ֆունկցիան պատասխանատու է խաղատախտակի վրա նոր սննդամթերքի պատահական տեղադրման համար:
    function generateFood() {
      const emptyCells = [];
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (board[i][j] === 0) {
            emptyCells.push({ row: i, col: j });
          }
        }
      }

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const foodLocation = emptyCells[randomIndex];
        board[foodLocation.row][foodLocation.col] = 2; //2-ը ներկայացնում է սնունդ
      }
    }

    function resetGame() {
      clearInterval(intervalId);
      board = createEmptyBoard(rows, cols);
      snake = [{ row: 2, col: 2 }];
      direction = 'right';
      startTime = undefined;
      foodCount = 0;
      renderBoard();
      updateTimer();
    }

    function startGame() {
      generateFood();
      renderBoard();
      startTime = Date.now();
      intervalId = setInterval(updateSnake, 200);
      
    }



    function updateTimer() {
      if (startTime) {
        const elapsedMilliseconds = Date.now() - startTime;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        timerDisplay.textContent = `Time: ${elapsedSeconds} seconds`;
      }
    }


    //ֆունկցիան հաշվարկում է վայրկյաններով անցած ժամանակը տվյալ մեկնարկի ժամանակի և ընթացիկ ժամանակի միջև
    function getTimeElapsed(startTimestamp) {
      if (startTimestamp) {
        const elapsedMilliseconds = Date.now() - startTimestamp;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        return elapsedSeconds;
      }
      return 0;
    }

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          if (direction !== 'down') direction = 'up';
          break;
        case 'ArrowDown':
          if (direction !== 'up') direction = 'down';
          break;
        case 'ArrowLeft':
          if (direction !== 'right') direction = 'left';
          break;
        case 'ArrowRight':
          if (direction !== 'left') direction = 'right';
          break;
      }
    });

    // Սկսել խաղը
    startGame();
  });



