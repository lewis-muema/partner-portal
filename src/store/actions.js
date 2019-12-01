import axios from 'axios';

export default {
    requestAxios({ commit, dispatch }, payload) {
        return new Promise((resolve, reject) => {
        const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.token,
            },
        };
        axios.post(payload.url, payload.payload, config).then(response => {
            if (response.data.status) {
                resolve(response.data);
            } else {
                resolve(response.data);
            }
        }).catch(error => {
            reject(error);
        });
        });
    },
};
