/* eslint-disable */
import axios from "axios";

export default {

    getBlockstreamCurrentBlockHeight(){
        return axios.get("https://blockstream.info/api/blocks/tip/height")
            .then(response => { return response })
            .catch(error => error);
    },

    getBlockstreamPriorBlockHeight(priorBlockHeight) {
        return axios.get("https://blockstream.info/api/block-height/" + priorBlockHeight)
             .then(response => { return response.data })
             .catch(error => error);
    },

    async getBlockstreamPriorBlockTime(priorBlockHeight){
        let priorBlockHash = await this.getBlockstreamPriorBlockHeight(priorBlockHeight);
        return axios.get("https://blockstream.info/api/block/" + priorBlockHash)
             .then(response => { return response })
             .catch(error => error);
    },

    getBlockCypherCurrentBlockHeight(){
        return axios.get("https://api.blockcypher.com/v1/btc/main")
            .then(response => { return response })
                .catch(error => error);
    },

    getUmbrelBlockHeight() {
        return axios.get("127.0.0.1")
            .then()
    },

};
