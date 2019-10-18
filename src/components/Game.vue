<template>
  <div id="game">
    <Board :board.sync="board" :x="x" :bus="bus" @place="place"/>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Board from './Board.vue'

  export default {
    name: 'game',
    components: {
      Board
    },
    data() {
      return {
        x: true,
        board: [
          ['', '', ''],
          ['', '', ''],
          ['', '', '']
        ],
        bus: new Vue(),
      }
    },
    methods: {
      checkVictory: function() {
        //return: [winning letter, [[i, j][x, y]] (squares to draw line through)] 

        //check rows and cols
        for (let i = 0; i < 3; i++) {
          //check equal and not null
          if (this.board[i][0] && this.board[i][0] == this.board[i][1] && this.board[i][1] == this.board[i][2]) {
            return [this.board[i][0], [[i, 0], [i, 2]]];
          }
          if (this.board[0][i] && this.board[0][i] == this.board[1][i] && this.board[1][i] == this.board[2][i]) {
            return [this.board[0][i], [[0, i], [2, i]]];
          }
        }
        //check diagonals
        if (this.board[0][0] && this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2]) {
          return [this.board[0][0], [[0, 0], [2, 2]]];
        }
        if (this.board[2][0] && this.board[2][0] == this.board[1][1] && this.board[1][1] == this.board[0][2]) {
          return [this.board[0][2], [[0, 2], [2, 0]]];
        }
        return false;
      },
      place: function(i, j) {
        if (!this.board[i][j]) {
          //update array using Vue.set to force rerender
          let letter = this.x ? 'X' : 'O';
          let row = this.board[i];
          row[j] = letter;
          this.$set(this.board, i, row);
          
          //other player's turn
          this.x = !this.x;
          //TODO call checkVictory
          let vic = this.checkVictory();
          if (vic) {
            this.bus.$emit('victory', vic[0], vic[1]);
          }
        }
      },
    },
  }
</script>

<style scoped></style>