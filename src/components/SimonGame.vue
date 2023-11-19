<template>
  <div class="simon-game">
    <div class="simon-game__board">
      <span v-show="gameStatus === 'lose'">
        Вы проиграли. Ваш счёт {{ roundColors.length - 1 }}
      </span>

      <button
        class="simon-game__button-start"
        v-show="gameStatus === 'wait for start' || gameStatus === 'lose'"
        @click="startGame()"
      >
        Играть
      </button>

      <span v-show="gameStatus === 'gameplay' || gameStatus === 'animation'">
        Раунд: {{ roundColors.length }}
      </span>

      <label>
        <span>Сложность:</span>
        <select
          v-model="difficultyFactor"
          :disabled="gameStatus === 'gameplay' || gameStatus === 'animation'"
        >
          <option value="1.5" selected>Легкая</option>
          <option value="1">Средняя</option>
          <option value="0.4">Сложная</option>
        </select>
      </label>
    </div>

    <div class="simon-game__game-field">
      <button
        v-for="(color, key) in gameColors"
        :key="key"
        :class="[
          'simon-game__field-button',
          `simon-game__field-button--${color}`,
          { 'simon-game__field-button--active': activeButton === color }
        ]"
        :disabled="gameStatus !== 'gameplay'"
        @click="gameButtonClickHandler(color)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import redSound from "@/assets/sounds/red.mp3";
import blueSound from "@/assets/sounds/blue.mp3";
import yellowSound from "@/assets/sounds/yellow.mp3";
import greenSound from "@/assets/sounds/green.mp3";

type GameColor = "red" | "blue" | "yellow" | "green";
type GameStatus = "wait for start" | "animation" | "gameplay" | "lose";

interface GameButton {
  sound: HTMLAudioElement;
}

export default Vue.extend({
  name: "SimonGame",
  data() {
    return {
      gameButton: {
        red: {
          sound: new Audio(redSound)
        },
        blue: {
          sound: new Audio(blueSound)
        },
        yellow: {
          sound: new Audio(yellowSound)
        },
        green: {
          sound: new Audio(greenSound)
        }
      } as Record<GameColor, GameButton>,
      gameStatus: "wait for start" as GameStatus,
      activeButton: null as GameColor | null,
      roundProgress: -1,
      roundColors: [] as GameColor[],
      difficultyFactor: "1.5"
    };
  },
  computed: {
    gameColors(): GameColor[] {
      return Object.keys(this.gameButton) as GameColor[];
    },
    difficulty(): number {
      return +this.difficultyFactor * 1000;
    }
  },
  methods: {
    startGame() {
      this.roundProgress = -1;
      this.roundColors = [this.generateColor()];
      this.gameStatus = "animation";
      setTimeout(this.animate, 500);
    },
    nextRound() {
      this.roundProgress = -1;
      this.roundColors.push(this.generateColor());
      this.gameStatus = "animation";
      setTimeout(this.animate, this.difficulty + 500);
    },
    async animate() {
      for (let i = 0; i < this.roundColors.length; i++) {
        const color = this.roundColors[i];
        // eslint-disable-next-line no-await-in-loop
        await new Promise<void>((resolve) => {
          this.activeButton = color;
          this.playSound(color);

          setTimeout(() => {
            this.activeButton = null;
            setTimeout(resolve, 100);
          }, this.difficulty);
        });
      }

      this.activeButton = null;
      this.gameStatus = "gameplay";
    },
    playSound(color: GameColor) {
      const button = this.gameButton[color];
      if (!button.sound.paused) {
        button.sound.currentTime = 0;
      } else {
        button.sound.play();
      }
    },
    gameButtonClickHandler(color: GameColor) {
      this.playSound(color);

      if (this.roundColors[++this.roundProgress] !== color) {
        this.gameStatus = "lose";
        return;
      }

      if (this.roundProgress === this.roundColors.length - 1) this.nextRound();
    },
    generateColor(): GameColor {
      return this.gameColors[Math.floor(Math.random() * 4)];
    }
  }
});
</script>

<style scoped>
.simon-game {
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.simon-game__game-field {
  display: flex;
  flex-wrap: wrap;
  width: 350px;
  height: 350px;
  background-color: black;
  clip-path: circle();
}

.simon-game__board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  height: min-content;
  padding: 2rem;
  border-radius: 1rem;
  background-color: var(--primary-color);
}

.simon-game__board span {
  color: var(--secondary-color);
  font-size: 1.3rem;
}

.simon-game__board select {
  font-size: 1rem;
  margin-left: 0.5rem;
  background-color: var(--secondary-color);
}

.simon-game__button-start {
  width: min-content;
  border-radius: 0.5rem;
  padding: 0.5rem;
  font-size: 1.2rem;
  color: var(--quaternary-color);
  background-color: var(--secondary-color);
}

.simon-game__field-button {
  width: 50%;
  height: 50%;
  opacity: 0.5;
}

.simon-game__field-button:active:enabled,
.simon-game__field-button--active {
  opacity: 1;
}

.simon-game__field-button--red {
  background-color: red;
}

.simon-game__field-button--blue {
  background-color: blue;
}

.simon-game__field-button--yellow {
  background-color: yellow;
}

.simon-game__field-button--green {
  background-color: green;
}
</style>
