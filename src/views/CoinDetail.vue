<template>
  <div class="flex-col">

    <div class="flex justify-center">
      <bounce-loader :loading="isLoading" :color="'#68d391'" :size="100"></bounce-loader>
    </div>

    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
                class="w-20 h-20 mr-5"
               :alt="asset.name" />
            <h1 class="text-5xl">
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ $filters.DollarFilter(asset.priceUsd) }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ asset.changePercent24Hr }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >Cambiar</button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              />
            </label>
          </div>

          <span class="text-xl"></span>
        </div>
      </div>

      <line-chart class="my-10"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map(h => [h.date, parseFloat(h.priceUsd).toFixed(2)])">
      </line-chart>

      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr v-for="m in markets" :key="`${m.exchangeId}-${m.priceUsd}`" class="border-b">
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ $filters.DollarFilter(m.priceUsd) }}</td>
          <td> {{ m.baseSymbol }} / {{ m.quoteSymbol }} </td>
          <td>
            <PxButton v-if="m.url" @click="getWebsite(m)">
              <slot>Obtener Link</slot>
            </PxButton>
            <a v-else class="hover:underline text-green-600" target="blank">{{ m.url }}</a>
          </td>
        </tr>
      </table>

    </template>
  </div> 
</template>

<script>
import api from '@/api';
import PxButton from "@/components/PxButton.vue";

export default {
  name: 'CoinDetail',
  components: {
    PxButton
  },  
  data() {
    return {
      asset: {},
      history: [],
      markets: [],
      isLoading: false
    }
  },

  computed: {
    min() {
        return Math.min(
            ...this.history.map( h => parseFloat(h.priceUsd).toFixed(2))
        )
    },
    max() {
        return Math.max(
            ...this.history.map( h => parseFloat(h.priceUsd).toFixed(2))
        )
    },
    avg() {
        return Math.abs(
            ...this.history.map( h => parseFloat(h.priceUsd).toFixed(2))
        )
    }
  },
  watch: {
    $route() {
      this.getCoin()
    }
  },
  created() {
    this.getCoin();
  },
  methods: {
    getCoin() {
        const id = this.$route.params.id;
        this.isLoading = true;

        Promise.all([
            api.getAsset(id),
            api.getAssetHistory(id),
            api.getMarkets(id)
        ])
        .then(([asset, history, markets]) => {
            this.asset = asset;
            this.history = history;
            this.markets = markets;
        })
        .finally(() => (this.isLoading = false))
    },
    getWebsite(exchange) {
      return api.getExhange(exchange.exchangeId)
                .then(res => {
                  exchange.url = res.exchangeUrl;
                })
    }
  }
}
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>

