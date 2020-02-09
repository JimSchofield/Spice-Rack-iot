<template>
  <div id="app">
    <h1>Spice Rack!</h1>
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
</template>

<script>
import SpiceRack from './service/SpiceRack'

export default {
  name: 'App',
  data() {
    return {
      direction: 'left',
      position: 0,
      $WS: null
    }
  },
  created() {
    this.$spiceRack = new SpiceRack()
  },
  methods: {
    toggleLED() {
      this.$spiceRack.toggleLED()
    },
    handleGo() {
      this.$spiceRack.to(this.position)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
