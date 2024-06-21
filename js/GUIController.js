/*
Kontroler GUI, którego zadaniem jest aktualizacja wyświetlanych informacji o:
- stanie życia gracza,
- aktualnej punktacji gracza,
- infromacji o zatrzymaniu rozgrywki,
- informacji o zakończeniu rozgrywki.
*/
export class GUIController {
    constructor(middleText, scoreBoard, healthText) {
      this.initialize(middleText, scoreBoard, healthText);    
    }
  
    initialize(middleText, scoreBoard, healthText) {
        this.middleText = middleText;
        this.paused = true;
        this.gameIsOver = false;
        this.scoreBoard = scoreBoard;
        this.score = 0;
        this.healthText = healthText;
        this.health = 3;
        this.gameOverText = "GAME OVER";
        this.pauseText = "PAUSE";
    }

    gameOver() {
        this.paused = true;
        this.gameIsOver = true; 
        this.middleText.style.display = "block";
        this.middleText.innerHTML = this.gameOverText;
    }

    pauseGame() {
        if (this.paused && !this.gameIsOver) {
            this.paused = false;
            this.middleText.style.display = "none"; 
        } else {
            this.paused = true;
            this.middleText.style.display = "block";
        }
    }

    updateScore() {
        let scoreText = this.scoreBoard.innerHTML.slice(0, 7);
        scoreText += this.score;
  
        this.scoreBoard.innerHTML = scoreText;
    }
  
    addPoints() {
        this.score += 10;
        this.updateScore();
    }

    resetScore() {
        this.score = 0;

        let scoreText = this.scoreBoard.innerHTML.slice(0, 7);
        scoreText += this.score;
  
        this.scoreBoard.innerHTML = scoreText;
    }

    substractHeatlh() {
        this.health -= 1;
        this.updateHealth();
    }

    updateHealth() {
        let healthText = this.healthText.innerHTML.slice(0, 8);
        healthText += this.health;
  
        this.healthText.innerHTML = healthText; 
    }

    resetHealth() {
        this.health = 3;

        let healthText = this.healthText.innerHTML.slice(0, 8);
        healthText += this.health;
  
        this.healthText.innerHTML = healthText; 
    }

    resetGame() {
        this.resetHealth();
        this.resetScore();

        this.paused = false;
        this.gameIsOver = false;
        this.middleText.style.display = "none";
        this.middleText.innerHTML = this.pauseText;
    }
        
  };