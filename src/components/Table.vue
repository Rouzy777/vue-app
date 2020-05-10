<template>
    <div v-if="!error" class='adaptation container-fluid mx-auto px-lg-4' id="app">
        <h1>Table UI</h1>
        <hr>
        <div class="mx-auto row mb-2">
            <div class="d-flex col px-0 align-self-center">
                <p class='my-auto mr-2'>Sorting by: </p>
                <button class="btn mx-1 px-2 pointer capitalize" v-for="(item, i) in names" @click='replace(item)' :class='{ "btn-success text-light rounded": item == checked[0] }' :key="`item-${i}`">{{item}}</button>
            </div>
            <div class="d-flex col mt-lg-0 mt-3 px-0 col pl-0">
                <button class='btn border' @click='deleteItem' :disabled='!selected.length' :class='{ "btn-success": selected.length }'>
                    Delete {{!selected.length ? "" : selected.length}}
                </button>
                <multiselect class='per-page pointer col-3 px-0 mx-2'
                             v-model="size"
                             :options="sizeList"
                             :searchable="false"
                             :close-on-select="true"
                             :allow-empty="false"
                             :show-labels="false"/>
                <button @click="prevPage" :disabled="pageNumber==0" class='btn border font-weight-bold'>&lt;</button>
                <p class='my-auto mx-2'>{{paginatedData.postNumberStart}} - {{paginatedData.postNumberEnd}} of {{this.allPosts.length}}</p>
                <button @click="nextPage" :disabled="pageNumber >= pageCount - 1" class='btn border font-weight-bold'>&gt;</button>
                <multiselect class='col ml-2 px-0'
                             v-model="checked"
                             :options="names"
                             :multiple="true"
                             :close-on-select="false"
                             :clear-on-select="false"
                             deselectLabel='Remove'
                             selectLabel='Add'>
                    <template slot="selection" slot-scope="{values}">
                          <span>{{ values.length }} columns selected</span>
                    </template>
                </multiselect>
            </div>
        </div>
        <table class="table mt-4 table-striped table-borderless">
            <thead>
                <tr>
                    <td class='text-center'><input type="checkbox" v-model='checkedAll' @click='checkAll'></td>
                    <th v-for='(item, i) in checked' class='capitalize' :class='{"text-success": item === checked[0]}' :key='`item${i}`'>{{item}} <span class='pointer text-dark px-1 ml-1' @click='sort(item)' v-if='i == 0'>&uarr;</span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in paginatedData.posts" :key="product.id">
                    <td class='text-center'><input type="checkbox" v-model='selected' :value='product.product'></td>
                    <td v-for='(item, i) in checked' :key='`item${i}`'>{{product[item]}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else>
        <h3 class='font-weight-bold mb-2'>Ошибка сервера!</h3>
        <button class='btn btn-primary' @click='retry'>Нажмите для повторения</button>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Multiselect from 'vue-multiselect';
export default {
    data() {
        return {
          error: "",
          names: ["product", "calories", "fat", "carbs", "protein", "iron"],
          checked: ["product", "calories", "fat", "carbs", "protein", "iron"],
          selected: [],
          pageNumber: 0,
          size: 10,
          sizeList: [10, 15, 20],
          checkedAll: false
        }
    },
    components: {
        Multiselect
    },
    computed: {
        ...mapGetters([
            "allPosts"
        ]),
        pageCount() {
            let l = this.allPosts.length,
                s = this.size;
            return Math.ceil(l/s);
        },
        paginatedData() {
            const start = this.pageNumber * this.size,
                    end = start + Number(this.size),
                    finalObj = {
                        posts: this.allPosts.slice(start, end),
                        postNumberStart: start+1,
                        postNumberEnd: end
                    };
            return finalObj;
        }
    },
    watch: {
        selected: function() {
            this.checkForAllCheckbox();
        }
    },
    methods: {
        ...mapActions([
            "fetchPosts",
            "deleteProduct"
        ]),
        retry() {
            this.error = '';
            this.fetchPosts().catch(error => {
                this.error = error.error
            });
        },
        checkForAllCheckbox() {
            let counter = 0;
            for(let i of this.paginatedData.posts) {
                if(this.selected.includes(i.product)) {
                    counter++;
                }
            }
            this.checkedAll = counter === this.size ? true : false;
        },
        checkAll() {
            this.checkedAll = !this.checkedAll;
            if(this.checkedAll) {
                for(let i of this.paginatedData.posts) {
                    if(!this.selected.includes(i.product)) {
                        this.selected.push(i.product);
                    }
                }
            } else {
                for(let i of this.paginatedData.posts) {
                    this.selected.indexOf(i.product) !== -1 && this.selected.splice(this.selected.indexOf(i.product), 1)
                }
            }
        },
        deleteItem() {
            this.deleteProduct(this.selected).then((res) => {
                if(res === "deleted") {
                    this.checkedAll = false;
                    this.selected = [];
                    alert(res);
                } else if (res === "Server error") {
                    alert(res);
                }
            });
        },
        replace(item) {
            let index = this.checked.indexOf(item);
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
            this.checkForAllCheckbox();
        },
        prevPage() {
            this.pageNumber--;
            this.checkForAllCheckbox();
        }
    },
    async mounted() {
        this.fetchPosts().catch(error => {
            this.error = error.error
        });
    }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
.adaptation {
    display: block;
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
}

.post {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.multiselect__input {
    display: none;
}

.multiselect__option span, .capitalize {
    text-transform: capitalize;
}

.per-page .multiselect__option span::after, .per-page .multiselect__single::after {
    content: " Per Page";
}

.times, .pointer {
    cursor: pointer;
}
</style>
