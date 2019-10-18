<template>
    <div id="board">
      <h2>{{ turnLetter }}'s Turn</h2>
      <table class="table table-bordered" ref="grid">
          <tr v-for="(row, i) in board" :key="`board-${i}`">
            <td v-for="(x, j) in row" :key="`cell-${j}`" v-on:click="placeToken(i, j); $set(hover, i*3+j, false)" v-on:mouseover="x ? $set(hover, i*3+j, false) : $set(hover, i*3+j, true)" v-on:mouseleave="$set(hover, i*3+j, false)">
              {{ x }} <span class="hover-text" v-show="hover[i*3 + j]">{{ turnLetter }}</span>
            </td>
          </tr>
      </table>
      <div id="drawing">
        
      </div>
    </div>
    
</template>

<script>
  import SVG from 'svg.js';

  export default {
    name: 'board',
    data() {
      return {
        hover: [false, false, false, false, false, false, false, false, false],
      }
    }, 
    props: ['board', 'x', 'bus'],
    computed: {
      turnLetter: function() {
        return (this.x ? 'X' : 'O');
      },
    },
    methods: {
      placeToken: function(i, j) {
        this.$emit('place', i, j);
      }, 
      victory: function(letter, points) {
        console.log(letter + " Wins!");
        console.log(points);
        this.drawLine(points[0], points[1]);
      },
      drawLine: function(a, b) {
        let domRect = this.$refs.grid.getBoundingClientRect();
        let draw = SVG('drawing').size(window.innerWidth, window.innerHeight);
        //let line = draw.path('M' + (domRect.left + 150 * a[0] + 75) + ' ' + (domRect.top + 150 * a[1] + 75) + ' L' + (domRect.left + 150 * b[0] + 75) + ' ' + (domRect.top + 150 * b[1] + 75));
        let line = draw.line(domRect.left + 150 * a[1] + 75, domRect.top + 150 * a[0] + 75, domRect.left + 150 * b[1] + 75, domRect.top + 150 * b[0] + 75);
        line = line.stroke({linecap: 'round', width: 7, dasharray: line.length, dashoffset: line.length});
        line = line.animate().attr({ fill: '#f03' });
        console.log("drawing");
      }
    },
    mounted() {
      this.bus.$on('victory', this.victory)
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

#drawing {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.hover-text {
  color: rgba(0, 0, 0, 0.5);
}

</style>