<script setup>
import { onMounted, ref, watch } from 'vue'
import { useProductStore } from '@/stores/product'
import Button from '@/components/Button.vue'
import { useToast } from 'vue-toastification'
import Select from '@/components/Form/Select.vue'
import Input from '@/components/Form/Input.vue'
import Row from '@/components/Grid/Row.vue'
import Col from '@/components/Grid/Col.vue'
import BIcon from '@/components/Icon/BIcon.vue'
import Card from '@/components/Card.vue'
import debounce from 'lodash/debounce'
import Pagination from '@/components/Table/Pagination.vue'
import Table from '@/components/Table/TableIndex.vue'
import paginationPerPage from '@/utils/paginationPerPage'
import { useRouter } from 'vue-router'

const router = useRouter()
const productStore = useProductStore()
const toast = useToast()
const search = ref(productStore.search)
const perPage = ref(productStore.perPage)
const tdWidth = [
    { index: 1, width: 20 },
]

onMounted(() => {
    getProducts(productStore.page)
})

const edit = (id) => {
    // productStore.getProductById(id)
    // productStore.form = productStore.product
    router.replace({ name: 'productsEdit', params: { id } })
}

/**
 * Retrieves products from the server.
 *
 * @param {number} page - The page number of products to retrieve. Default is 1.
 * @return {void}
 */
const getProducts = (page = 1) => {
    productStore.page = page
    productStore.getAllProducts()
}

/**
 * Reloads the products and displays a success toast.
 *
 * @return {void} void - there is no return value
 */
const reload = () => {
    productStore.clear()
    search.value = ''
    perPage.value = 10
    getProducts()
    toast.success('Reloaded')
}

watch(perPage, debounce(() => {
    productStore.perPage = perPage.value
    getProducts()
}), 500)

watch(search, debounce(() => {
    productStore.search = search.value
    getProducts()
}, 500))
</script>

<template>
    <div class="container">
        <div class="d-flex justify-content-between">
            <h4 class="mt-4 mb-0">Product page</h4>
            <Button :is-small="true" class="my-3" type="link" :to="{ name: 'productsCreate' }">
                <BIcon name="plus" />
                Create new product
            </Button>
        </div>

        <Row>
            <Col md="1">
            <Button :is-small="true" @click="reload" class="mt-4" :disabled="productStore.isLoading">
                <BIcon name="arrow-repeat" />
                Reload
            </Button>
            </Col>
            <Col md="7">
            </Col>
            <Col md="3">
            <Input type="search" id="search" v-model="search" label="Search" placeholder="Search" :required="false"
                :is-small="true" :isLoading="productStore.isLoading" :disabled="productStore.isLoading" />
            </Col>
            <Col md="1">
            <Select :options="paginationPerPage" id="per-page" v-model="perPage" label="Per page" :show-empty-option="false"
                :is-small="true" :disabled="productStore.isLoading" />
            </Col>
        </Row>

        <Card class="my-3">
            <Table :colspan="2" :total="productStore?.products?.meta?.total" :is-loading="productStore.isLoading"
                :width="tdWidth">
                <template #thead>
                    <tr>
                        <th @click="productStore.setOrderBy('name')" style="cursor: pointer">
                            Name
                            <i :class="`bi bi-arrows-${productStore.orderByAsc ? 'collapse' : 'expand'}`"></i>
                        </th>
                        <th>Action</th>
                    </tr>
                </template>
                <template #tbody>
                    <template v-if="!productStore.isLoading">
                        <tr v-for="product in productStore.products.products" :key="product.id">
                            <td>{{ product.name }}
                                <span v-if="product.code_mold"> - {{ product.code_mold }}</span>
                                <span v-if="product?.product_size"> - {{ product.product_size?.name }}</span>
                            </td>
                            <td width="20">
                                <router-link :to="{ name: 'productsDetail', params: { id: product.id } }">
                                    <BIcon name="eye" />
                                </router-link>
                                <a @click="edit(product.id)" class="text-warning ms-2" style="cursor: pointer;">
                                    <BIcon name="pencil" />
                                </a>
                            </td>
                        </tr>
                    </template>
                </template>
            </Table>
        </Card>

        <Pagination :meta="productStore?.products?.meta" :is-loading="productStore.isLoading" @getData="getProducts" />
    </div>
</template>