<template>
    <div v-if="!error" class='container mx-auto' id="app">
        <div class="row justify-content-center mb-2">
            <div class='mx-3' v-for="(item, i) in names" :key="`item-${i}`">
                <input class="form-check-input" type="checkbox" v-model='checked' :value='item' :id="`check${i}`">
                <label class="form-check-label" v-bind:for="`check${i}`">
                    {{item | capitalize}}
                </label>
            </div>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th v-for='(item, i) in checked' @click='replace(i)' :key='`item${i}`'>{{item | capitalize}} <span class='bg-dark text-light rounded px-1 ml-1' @click='sort(item)' v-if='i == 0'>&#9650;</span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in paginatedData" :key="product.id">
                    <td v-for='(item, i) in checked' :key='`item${i}`'>{{product[item]}}</td>
                    <td class='text-center'><span @click='deleteItem(product.product)' class='bg-danger text-light font-weight-bold px-1 rounded times'>&times;</span></td>
                </tr>
            </tbody>
        </table>
        <div class='text-center'>
            <button @click="prevPage" :disabled="pageNumber==0" class='btn btn-primary mx-2 px-3'>Prev</button>
            <select v-model='size'>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
            </select>
            <button @click="nextPage" :disabled="pageNumber >= pageCount - 1" class='btn btn-primary mx-2 px-3'>Next</button>
        </div>
    </div>
    <div v-else>
        <h3 class='font-weight-bold mb-2'>Ошибка сервера!</h3>
        <button class='btn btn-primary' @click='retry'>Нажмите для повторения</button>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    data() {
        return {
          error: "",
          names: ["product", "calories", "fat", "carbs", "protein", "iron"],
          checked: ["product", "calories", "fat", "carbs", "protein", "iron"],
          pageNumber: 0,
          size: 10
        }
    },
    computed: {
        ...mapGetters(["allPosts"]),
        pageCount(){
            let l = this.allPosts.length,
                s = this.size;
            return Math.ceil(l/s);
        },
        paginatedData(){
            const start = this.pageNumber * this.size,
                    end = start + Number(this.size);
            return this.allPosts.slice(start, end);
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    methods: {
        ...mapActions(["fetchPosts"]),
        retry() {
            this.error = '';
            this.fetchPosts().catch(error => {
                this.error = error.error
            });
        },
        deleteItem(product) {
            this.$store.commit('removePost', product);
        },
        replace(index) {
            let removed = this.checked.splice(index, 1);
            this.checked.unshift(removed.join());
        },
        sort(el) {
            this.allPosts.sort((a, b) => {
                if(el === 'product') {
                    return a[el].localeCompare(b[el])
                } else {
                    return a[el] - b[el];
                }
            });
        },
        nextPage() {
            this.pageNumber++;
        },
        prevPage() {
            this.pageNumber--;
        }
    },
    async mounted() {
        this.fetchPosts().catch(error => {
            this.error = error.error
        });
    }
};
</script>

<style>
.post {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
}

th, .times {
    cursor: pointer;
}
</style>
