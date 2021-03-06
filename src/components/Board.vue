<template>
    <div id="board">
      <h2>{{ displayTurn }} Turn</h2>
      <table class="table table-bordered" ref="grid">
        <tr v-for="(row, i) in board" :key="`board-${i}`">
          <td v-for="(x, j) in row" :key="`cell-${j}`" v-on:click="placeToken(i, j); $set(hover, i*3+j, false)" 
            v-on:mouseover="x ? $set(hover, i*3+j, false) : $set(hover, i*3+j, true)" v-on:mouseleave="$set(hover, i*3+j, false)"
          >
            {{ x }} <span class="hover-text" v-show="hover[i*3 + j]">{{ hoverLetter }}</span>
          </td>
        </tr>
      </table>
      <div id="drawing"></div>
      <div class="transitionWrapper">
        <transition name="fade">
          <div v-if="isShowing">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-mask">
                <div class="modal-wrapper">
                  <div class="modal-content">
                    <h1 class="modal-title">{{ winner ? winner + ' Wins!' : 'Tie Game!'}}</h1>
                    <div class="buttonWrapper">
                      <button class="button btn btn-light" type="button" v-on:click="newGame()">
                        <i class="fas fa-redo fa-4x"></i>
                      </button>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    
</template>

<script>
  import { SVG } from '@svgdotjs/svg.js';
  import { mapState } from 'vuex';

  export default {
    name: 'board',
    data() {
      return {
        hover: [false, false, false, false, false, false, false, false, false],
        isShowing: false,
        winner: '',
      }
    }, 
    props: ['x', 'bus'],
    computed: {
      ...mapState({
        board: state => state.board,
        computer: state => state.computer,
      }),
      hoverLetter () {
          return (this.x ? 'X' : 'O');
      },
      displayTurn (state) {
        if (state.computer) {
          return (this.x ? 'Your' : "Computer's");
        }
        else {
          return (this.x ? "X's" : "O's");
        }
      },
    },
    methods: {
      placeToken: function(i, j) {
        if (!this.computer || this.x) {
          this.$parent.place(i, j);
        }
      }, 
      endGame: function(letter, points) {
        this.winner = letter;
        if (this.winner) {
          console.log(letter + " Wins!");
          this.drawLine(points[0], points[1]);
          setTimeout(this.showModal, 1750);
        } else {
          setTimeout(this.showModal, 250);
        }
      },
      drawLine: function(a, b) {
        let domRect = this.$refs.grid.getBoundingClientRect();
        let draw = SVG().addTo('#drawing').size(window.innerWidth, window.innerHeight);
        let str = 'M' + (domRect.left + 150 * a[1] + 75) + ' ' + (domRect.top + 150 * a[0] + 75) + ' L' + (domRect.left + 150 * b[1] + 75) + ' '  + (domRect.top + 150 * b[0] + 75); //svg path for line
        let path = draw.path(str);
        let len = path.length();
        path.attr('stroke-dashoffset', len).animate(1000, 100, 'now').ease('<>').attr('stroke-dashoffset', 0); //drawing animation
        path.stroke({linecap: 'round', width: 7, dasharray: len, color: '#000'});
      },
      showModal: function() {
        this.isShowing = true;
      },
      newGame: function() {
        this.$parent.startNewGame();
        this.isShowing = false;
        this.hover = [false, false, false, false, false, false, false, false, false];
        this.winner = '';
        document.getElementById('drawing').innerHTML = '';
      },
    },
    mounted() {
      this.bus.$on('endGame', this.endGame)
    },
  }
</script>

<style scoped>
#board {
  text-align: center;
}

table {
  width: auto;
  margin: auto;
}

table td {
  width: 150px;
  height: 150px;
  text-align: center;
  vertical-align: middle;
  position: relative;
  font-size: 48px;
}

table td:hover {
  cursor: default;
}

#drawing {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
}

.hover-text {
  color: rgba(0, 0, 0, 0.5);
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
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity 1.0s ease;
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
  margin-top: 25px;
}

.button {
  width: 150px;
  height: 150px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-enter-to, .fade-leave {
  opacity: 1;
}

</style>