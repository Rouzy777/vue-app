import { getProducts, deleteProducts } from '../api/request.js';

export default {
    actions: {
        async fetchPosts({ commit }) {
            const res = await getProducts();
            commit('updatePosts', res);
        },
        deleteProduct({state}, item) {
            return deleteProducts()
                .then(msg => {
                    let finalQuestion = confirm('Are you sure to delete this product?');
                    if(finalQuestion) {
                        for(let product of item) {
                            let index = state.posts.findIndex(i => i.product == product);
                            state.posts.splice(index, 1);
                        }
                        return msg.message
                    }
                })
                .catch(err => {
                    return err.error
                });
        }
    },
    mutations: {
        updatePosts(state, posts) {
            state.posts = posts
        }
    },
    state: {
        posts: []
    },
    getters: {
        allPosts(state) {
            return state.posts
        }
    }
}
