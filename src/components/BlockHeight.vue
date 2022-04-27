<template>
  <div>
    <div v-if="availableBlockHeight" class="main-landing">
      <div class="block-height-header">
        <h1>Current Bitcoin Block Height*</h1>
        <p>
          *If any of the block heights shown are 0, there was an error
          retrieving them. Please confirm that you are working with the correct
          block height. The below calculations assume approx. 10-minute blocks,
          and the current time is based on your system's current time.
        </p>
      </div>
      <div class="block-height">
        <p>
          Umbrel Node Block Height:
          <a>
            Coming soon!
            <!-- {{ this.umbrelBlockHeight }} -->
          </a>
        </p>
        <p>
          Blockstream Block Height:
          <a href="https://blockstream.info/blocks/recent">
            {{ this.blockstreamBlockHeight }}
          </a>
        </p>
        <p>
          Block Cypher Block Height:
          <a href="https://live.blockcypher.com/btc/">
            {{ this.blockCypherBlockHeight }}
          </a>
        </p>
      </div>
      <div class="block-calc">
        <h3>Enter the date and time of the block you want:</h3>
        <input v-model="futureDate" type="datetime-local" />
        <div v-if="isFutureDate">
          <p>The block for {{ this.futureDateToString }} should be:</p>
          <p>
            <strong> {{ futureBlock }}</strong>
          </p>
        </div>
        <div v-else>Please enter a future date.</div>
      </div>
      <div class="date-calc">
        <h3>Enter the block for which you want to find the date:</h3>
        <input
          v-model="checkBlock"
          type="number"
          min="0"
          id="check-block"
          v-on:change="getBlockDate"
        />
        <div v-if="isFutureBlock">
          <p>Block {{ checkBlock }} should be mined around:</p>
          <p>
            <strong>{{ this.blockDateToString }}</strong>
          </p>
        </div>
        <div v-else-if="!isFutureBlock && priorBlockTimeRequestSuccess">
          <p>Block {{ checkBlock }} was mined on:</p>
          <p>
            <strong>{{ this.priorBlockTime }}</strong>
          </p>
        </div>
        <div v-else>
          <p>
            Prior block dates are unavailable at this time. Please enter a
            future block.
          </p>
        </div>
      </div>
      <div class="pepe-pic">
        <p>
          -------------------------------------------------------------------
        </p>
        <p>Here's a random Pepe while you're here:</p>
        <img v-bind:src="pepeLink" alt="Random Pepe" />
      </div>
    </div>
    <div v-else>
      <h3>Oops...it appears there is an error!</h3>
      <p>-------------------------------------------------------------------</p>
      <p>Have a random Pepe instead.</p>
      <img v-bind:src="pepeLink" alt="Random Pepe" />
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import blockHeightService from "@/services/BlockHeightService.js";

export default {
  name: "BlockHeight",
  data() {
    return {
      futureDate: "",
      checkBlock: 0,
      priorBlockTimeRequestSuccess: false,
    }
  },
  computed: {
    blockstreamBlockHeight() {
      return this.$store.state.blockstreamBlockHeight;
    },
    blockCypherBlockHeight() {
      return this.$store.state.blockCypherBlockHeight;
    },
    umbrelBlockHeight() {
      return this.$store.state.umbrelBlockHeight;
    },
    availableBlockHeight() {
      return (this.blockstreamBlockHeight != 0 || this.blockCypherBlockHeight != 0 || this.umbrelBlockHeight != 0) ? true : false;
    },
    randomNumber() {
      let randomNum = 0;
      while (randomNum === 0) {
        randomNum = Math.floor(Math.random() * 2317);
      };
      return randomNum;
    },
    pepeLink() {
      return this.$store.state.pepeLinks[this.randomNumber];
    },
    currentDateTime() {
      return new Date();
    },
    currentDateTimeFormatted() {
      let currentDateTimeFormattedString = this.currentDateTime.getFullYear().toString() + "-" + 
        (this.currentDateTime.getMonth() + 1).toString().padStart(2, '0') + 
        "-" + this.currentDateTime.getDate().toString().padStart(2, '0') + 
        "T" + this.currentDateTime.getHours().toString().padStart(2, '0') + ":" + 
        this.currentDateTime.getMinutes().toString().padStart(2, '0');
      return currentDateTimeFormattedString;
    },
    currentBlockHeight() {
      return Math.max(this.blockstreamBlockHeight, this.blockCypherBlockHeight, this.umbrelBlockHeight);
    },
    differenceBewteenDates() {
      let minutesBetweenDates = (new Date(this.futureDate) - new Date(this.currentDateTimeFormatted)) / 1000 / 60;
      return minutesBetweenDates;
    },
    futureBlock() {
      return this.$store.state.blockstreamBlockHeight + (1 * Math.floor(this.differenceBewteenDates / 10));
    },
    isFutureDate() {
      return (this.differenceBewteenDates >= 0) ? true : false;
    },
    isFutureBlock() {
      return (this.checkBlock > this.currentBlockHeight) ? true : false;
    },
    futureDateToString() {
      return this.dateToString(new Date(this.futureDate));
    },
    blockDate() {
      let millisecondsToAddToDate = (this.checkBlock - this.currentBlockHeight) * 60 * 1000 * 10;
      return Date.now() + millisecondsToAddToDate;
    },
    blockDateToString() {
      return this.dateToString(new Date(this.blockDate));
    },
    priorBlockTime() {
      return this.$store.state.priorBlockTime;
    },
  },
  methods: {
    dateToString(date) {
      return date.toLocaleDateString() + " " + date.toLocaleTimeString().substring(0, date.toLocaleTimeString().length - 6) +
        date.toLocaleTimeString().substring(date.toLocaleTimeString().length - 3);
    },
    async getBlockstreamBlockHeight() {
      let blockstreamResponse = await blockHeightService.getBlockstreamCurrentBlockHeight()
        .then(response => response);
      if (blockstreamResponse.status != 200) {
        this.$store.commit("SET_BLOCKSTREAM_BLOCK_HEIGHT", 0);
      } else {
        this.$store.commit("SET_BLOCKSTREAM_BLOCK_HEIGHT", blockstreamResponse.data);
      }
    },
    async getBlockCypherBlockHeight() {
      let blockCypherResponse = await blockHeightService.getBlockCypherCurrentBlockHeight()
        .then(response => response);
      if (blockCypherResponse.status != 200) {
        this.$store.commit("SET_BLOCK_CYPHER_BLOCK_HEIGHT", 0);
      } else {
        this.$store.commit("SET_BLOCK_CYPHER_BLOCK_HEIGHT", blockCypherResponse.data.height);
      }
    },
    async getBlockDate() {
      if (!this.isFutureBlock) {
        let blockToCheckDate = await blockHeightService.getBlockstreamPriorBlockTime(this.checkBlock)
          .then(response => response);
          if (blockToCheckDate.status != 200) {
            this.priorBlockTimeRequestSuccess = false;
          } else {
            this.priorBlockTimeRequestSuccess = true;
            let timestamp = blockToCheckDate.data.timestamp * 1000;
            let date = new Date(timestamp);
            this.$store.commit("SET_PRIOR_BLOCK_TIME", this.dateToString(date));
          }
      }
    }
  },
  created() {
    this.getBlockstreamBlockHeight();
    this.getBlockCypherBlockHeight();
    this.futureDate = this.currentDateTimeFormatted;
    this.getBlockDate();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

a {
  color: #42b983;
}

.main-landing {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  grid-template-areas:
    "title blocks"
    "block-calc date-calc"
    "pepe pepe";
}

.block-height-header {
  grid-area: title;
  justify-content: right;
}

.block-height {
  grid-area: blocks;
  margin: auto;
}

.block-calc {
  grid-area: block-calc;
}

.date-calc {
  grid-area: date-calc;
}

.pepe-pic {
  grid-area: pepe;
}

#check-block {
  text-align: center;
}
</style>
