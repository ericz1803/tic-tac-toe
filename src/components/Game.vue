<template>
  <div id="game">
    <div class="transitionWrapper">
      <transition name="fade">
        <div v-if="isShowing">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-mask">
              <div class="modal-wrapper">
                <div class="modal-content">
                  <h1 class="modal-title">Play Against...</h1>
                  <div class="row">
                    <div class="buttonWrapper">
                      <button
                        class="button btn btn-light"
                        type="button"
                        v-on:click="beginGame('human')"
                      >
                        <h4>Human</h4>
                        <i class="fas fa-user fa-4x"></i>
                      </button>
                    </div>
                    <div class="buttonWrapper">
                      <button
                        class="button btn btn-light"
                        type="button"
                        v-on:click="beginGame('computer')"
                      >
                        <h4>Computer</h4>
                        <i class="fas fa-desktop fa-4x"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <Board :x="x" :bus="bus" />
    <Minimax :x="x" />
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from 'vuex';

import Board from "./Board.vue";
import Minimax from "./Minimax.vue";

export default {
  name: "game",
  components: {
    Board,
    Minimax
  },
  computed: mapState({
    board: state => state.board,
    computer: state => state.computer,
  }),
  data() {
    return {
      x: true,
      isShowing: true,
      bus: new Vue()
    };
  },
  methods: {
    //return: [winning letter, [[x1, y1][x2, y2]] (squares to draw line through)] if there is a winner,
    //otherwise return false
    checkVictory: function(board) {
      //check rows and cols
      for (let i = 0; i < 3; i++) {
        if (
          board[i][0] &&
          board[i][0] == board[i][1] &&
          board[i][1] == board[i][2]
        ) {
          return [
            board[i][0],
            [[i, 0], [i, 2]]
          ];
        } else if (
          board[0][i] &&
          board[0][i] == board[1][i] &&
          board[1][i] == board[2][i]
        ) {
          return [
            board[0][i],
            [[0, i], [2, i]]
          ];
        }
      }

      //check diagonals
      if (
        board[0][0] &&
        board[0][0] == board[1][1] &&
        board[1][1] == board[2][2]
      ) {
        return [
          board[0][0],
          [[0, 0], [2, 2]]
        ];
      } else if (
        board[2][0] &&
        board[2][0] == board[1][1] &&
        board[1][1] == board[0][2]
      ) {
        return [
          board[0][2],
          [[0, 2], [2, 0]]
        ];
      }
      return false;
    },

    //check if all squares are filled
    checkFullBoard() {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!this.board[i][j]) {
            return false;
          }
        }
      }
      return true;
    },
    place: function(i, j) {
      if (!this.board[i][j]) {
        let val = this.x ? "X" : "O";
        this.$store.commit('set', {i: i, j: j, val: val}) //update array this way to force rerender

        //other player's turn
        this.x = !this.x;

        //check if one player has won or it is a tie
        let vic = this.checkVictory(this.board);
        if (vic) {
          this.bus.$emit("endGame", vic[0], vic[1]);
        } else if (this.checkFullBoard()) {
          this.bus.$emit("endGame", "", []);
        }
      }
    },
    beginGame: function(opponent) {
      if (opponent == "computer") {
        this.$store.commit('setComputer', true);
      } else {
        this.$store.commit('setComputer', false);
      }
      this.isShowing = false;
    },
    startNewGame: function() {
      this.x = true;
      this.$store.commit('reset');
      this.isShowing = true;
    }
  }
};
</script>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.transitionWrapper {
  position: relative;
  z-index: 9998;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 1s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-content {
  padding: 25px;
  left: 25%;
  text-align: center;
  width: 50%;
}

.buttonWrapper {
  margin: 25px 1em;
}

.button {
  width: 150px;
  height: 150px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}
</style>