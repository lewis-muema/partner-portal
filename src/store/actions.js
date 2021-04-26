import axios from 'axios';

export default {
    requestAxiosPost({ commit, dispatch }, payload) {
        return new Promise((resolve, reject) => {
        const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: localStorage.token,
              'Accept-Language': localStorage.getItem('language'),
            },
        };
        axios.post(payload.url, payload.payload, config).then(response => {
            if (response.data.status) {
                resolve(response);
            } else {
                resolve(response);
            }
        }).catch(error => {
            reject(error);
        });
        });
    },
    requestAxiosGet({ commit, dispatch }, payload) {
        return new Promise((resolve, reject) => {
        const config = {
            headers: {
              'Content-Type': 'application/json',
               Authorization: localStorage.token,
              'Accept-Language': localStorage.getItem('language'),
            },
        };
        axios.get(payload.url, config).then(response => {
            if (response.data.status) {
                resolve(response);
            } else {
                resolve(response);
            }
        }).catch(error => {
            reject(error);
        });
        });
    },
};
