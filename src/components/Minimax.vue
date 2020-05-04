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
      positionValue: function(board) {
        //return: 100 for O win, -100 for X win, 0 else

        //check rows and cols
        for (let i = 0; i < 3; i++) {
          //check equal and not null
          if (
            board[i][0] &&
            board[i][0] == board[i][1] &&
            board[i][1] == board[i][2]
          ) {
            return board[i][0] == 'O' ? 100 : -100;
          }
          if (
            board[0][i] &&
            board[0][i] == board[1][i] &&
            board[1][i] == board[2][i]
          ) {
            return board[0][i]  == 'O' ? 100 : -100;
          }
        }

        //check diagonals
        if (
          board[0][0] &&
          board[0][0] == board[1][1] &&
          board[1][1] == board[2][2]
        ) {
          return board[0][0] == 'O' ? 100 : -100;
        }
        if (
          board[2][0] &&
          board[2][0] == board[1][1] &&
          board[1][1] == board[0][2]
        ) {
          return board[0][2]  == 'O' ? 100 : -100;
        }
        return 0;
      },
      checkFullBoard(board) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (!board[i][j]) {
              return false;
            }
          }
        }
        return true;
      },
      makeMove() {
        let move = this.findBestMove(this.board);
        if (move.length) {
          setTimeout(() => this.$emit('place', move[0], move[1]), 350);
        } else {
          console.log("Computer did not find a move.");
        }
      },
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
        let score = this.positionValue(board);
        if (score == 100) {
          return score - depth;
        } else if (score == -100) {
          return score + depth;
        } else if (this.checkFullBoard(board)) {
          return 0;
        }

        let player = maximizing ? 'O' : 'X';
        if (maximizing) {
          let val = -Infinity;
          for (let i = 0; i < 3; i++ ){
            for (let j = 0; j < 3; j++) {
              if (!board[i][j]) {
                board[i][j] = player;
                val = Math.max(val, this.minimax(board, !maximizing, depth + 1));
                board[i][j] = '';
              }
            }
          }
          return val;
        } else {
          let val = Infinity;
          for (let i = 0; i < 3; i++ ){
            for (let j = 0; j < 3; j++) {
              if (!board[i][j]) {
                board[i][j] = player;
                val = Math.min(val, this.minimax(board, !maximizing, depth + 1));
                board[i][j] = '';
              }
            }
          }
          return val;
        }
        
      }
    },
    mounted: function() {
      //generate tree
    }
  };
</script>

<style scoped></style>