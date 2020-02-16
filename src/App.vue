<template>
  <div id="app">
    <h1>Spice Rack!</h1>
    <div>
      <div>
        <label for="position">Position to travel to (cm):</label>
        <input type="text" v-model="position" />
      </div>
      <div>
        <button @click="handleGo">Go!</button>
      </div>
      <div>
        <button @click="$spiceRack.push()">Push!</button>
      </div>
      <div>
        <button @click="toggleLED">Toggle</button>
      </div>
    </div>
    <div class="inner">
      <h2>Set up spice locations:</h2>
      <transition-group tag="ul" name="list">
        <li v-for="(spice, index) in spiceArray" :key="spice.id">
          <input type="text" :value="spice.name" @input="updateProperty($event, index, 'name')"/>
          <input type="number" :value="spice.position" min="3" max="53" @input="updateProperty($event,index, 'position')" />
          <label for="checked">
            <input type="checkbox" id="checked" :checked="spice.checked" @change="updateChecked($event, index)" />
            Select
          </label>
          <button @click="removeSpiceByIndex(index)">❌</button>
        </li>
      </transition-group>
      <button @click="addSpiceEntry">➕ add a spice</button>
    </div>

    <button @click="start">Begin</button>
  </div>
</template>

<script>
import SpiceRack from './service/SpiceRack'

export default {
  name: 'App',
  data() {
    return {
      modalOpen: false,
      direction: 'left',
      position: 0,
      spiceArray: [],
      $WS: null
    }
  },
  created() {
    this.$spiceRack = new SpiceRack()

    const spiceArray = JSON.parse(localStorage.getItem('spiceArray'))
    if (spiceArray) {
      this.spiceArray = spiceArray
    }
  },
  computed: {
    getSpiceArrayCopy() {
      return JSON.parse(JSON.stringify(this.spiceArray))
    }
  },
  methods: {
    addSpiceEntry() {
      this.spiceArray.push({
        name: '',
        position: 0,
        id: Math.floor(Math.random() * 100000)
      })
    },
    toggleLED() {
      this.$spiceRack.toggleLED()
    },
    handleGo() {
      this.$spiceRack.to(this.position, true)
    },
    updateProperty(event, index, property) {
      this.spiceArray[index][property] = event.target.value
      this.saveArray()
    },
    updateChecked(event, index) {
      this.spiceArray[index].checked = event.target.checked
      this.saveArray()
    },
    removeSpiceByIndex(index) {
      this.spiceArray.splice(index, 1)
      this.saveArray()
    },
    saveArray() {
      localStorage.setItem('spiceArray', JSON.stringify(this.spiceArray))
    },
    start() {
      this.$spiceRack.startFetching(this.getSpiceArrayCopy.filter(spice => spice.checked))
    }
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.inner {
  margin: auto;
  max-width: 500px;
  padding: 2em;
  background: white;
  border-radius: 8px;
}

ul {
  margin: 0;
  list-style-type: none;
  padding: 0 0 1em 0;
}

li {
  display: flex;

  & > * + * {
    margin-left: 1em;
  }
}
</style>
