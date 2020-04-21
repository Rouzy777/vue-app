import { getProducts, deleteProducts } from '../api/request.js';

export default {
    actions: {
        async fetchPosts({ commit }) {
            const res = await getProducts();
            commit('updatePosts', res);
        }
    },
    mutations: {
        updatePosts(state, posts) {
            state.posts = posts
        },
        removePost(state, item) {
            const res = deleteProducts()
                .then(msg => {
                    let finalQuestion = confirm('Are you sure to delete this product?');
                    if(finalQuestion) {
                        let index = state.posts.findIndex(i => i.product == item);
                        state.posts.splice(index, 1);
                        alert(msg.message);
                    }
                })
                .catch(err => {
                    alert(err.error);
                });
            console.log(res);
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
