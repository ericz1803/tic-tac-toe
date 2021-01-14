<template>
  <div id="minimax"></div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: 'minimax',
    computed: mapState({
      board: state => state.board,
      computer: state => state.computer
    }),
    props: ['x'],
    watch: {
      x: function () {
        if (this.$store.state.computer && !this.x) {
          this.makeMove();
        }
      }
    },
    methods: {
      positionValue() {
        let vic = this.$parent.checkVictory(this.board);
        if (vic) {
          if (vic[0] == 'O') {
            return 100;
          } else {
            return -100;
          }
        } else {
          return 0;
        }

      },
      makeMove() {
        let move = this.findBestMove(this.board);
        if (move.length) {
          setTimeout(() => this.$parent.place(move[0], move[1]), 350);
        } else {
          console.log("Computer did not find a move.");
        }
      },
      //minimax implementation based on https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/
      //returns coordinates of best move
      findBestMove(board) {
        //maximize
        let bestMove = [];
        let bestMoveVal = -Infinity;

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (!board[i][j]) {
              board[i][j] = 'O';
              let positionVal = this.minimax(board, false, 0);
              if (positionVal > bestMoveVal) {
                bestMove = [i, j];
                bestMoveVal = positionVal;
              }
              board[i][j] = '';
            }
          }
        }
        return bestMove;
      },
      minimax(board, maximizing, depth) {
        let score = this.positionValue();
        if (score == 100) {
          return score - depth;
        } else if (score == -100) {
          return score + depth;
        } else if (this.$parent.checkFullBoard()) {
          return 0;
        }

        let player = maximizing ? 'O' : 'X';
        let val = maximizing ? -Infinity : Infinity;
        for (let i = 0; i < 3; i++ ){
          for (let j = 0; j < 3; j++) {
            if (!board[i][j]) {
              board[i][j] = player;
              if (maximizing) {
                val = Math.max(val, this.minimax(board, !maximizing, depth + 1));
              } else {
                val = Math.min(val, this.minimax(board, !maximizing, depth + 1));
              }
              board[i][j] = '';
            }
          }
        }
        return val;       
      }
    },
  };
</script>

<style scoped></style>