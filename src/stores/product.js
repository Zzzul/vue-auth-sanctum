import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '../api/useAPI'
import { useToast } from "vue-toastification"
import { useAuthStore } from './auth'

export const useProductStore = defineStore('product', () => {
    const api = useApi()
    const toast = useToast()
    const auth = useAuthStore()
    const products = ref([])
    const product = ref({})
    const page = ref(1)
    const perPage = ref(10)
    const orderByField = ref('')
    const orderByAsc = ref(true)
    const isLoading = ref(false)
    const search = ref('')
    const form = ref({})
    const validationErrors = ref(null)

    /**
     * Retrieves all products from the API.
     *
     * @return {Promise<void>} - A promise that resolves when the products are retrieved successfully, or rejects with an error.
     */
    const getAllProducts = async () => {
        isLoading.value = true
        await api.get(`/products?page=${page.value}&per_page=${perPage.value}&order_by=${orderByField.value}&order_type=${orderByAsc.value ? 'asc' : 'desc'}&search=${search.value}`, {
            headers: auth.getTokenHeader()
        })
            .then(({ data }) => {
                products.value = data
                isLoading.value = false
            })
            .catch(({ response }) => {
                toast.error(response.data.message)
            })
    }

    /**
     * Retrieves a product by its ID from the API.
     *
     * @param {number} id - The ID of the product to retrieve.
     * @return {Promise} - A promise that resolves to the retrieved product.
     */
    const getProductById = async (id) => {
        await api.get(`/products/${id}`, {
            headers: auth.getTokenHeader()
        })
            .then(({ data }) => {
                product.value = data.products
                // form.value = data.products
            })
            .catch(({ response }) => {
                toast.error(response.data.message)
            })
    }

    /**
     * Sets the order by field and toggles the order by ascending value.
     *
     * @param {string} field - The field to order by.
     * @return {void} - This function does not return a value.
     */
    const setOrderBy = (field) => {
        orderByField.value = field
        orderByAsc.value = !orderByAsc.value

        getAllProducts()
    }

    /**
     * Clears the state of the variables used in the function.
     *
     * @return {void} No return value.
     */
    const clear = () => {
        products.value = []
        product.value = {}
        page.value = 1
        perPage.value = 10
        orderByField.value = ''
        orderByAsc.value = true
        search.value = ''
    }

    const save = async () => {
        await api.post('/products', form.value, {
            headers: auth.getTokenHeader()
        })
            .then(({ data }) => {
                toast.success(data.message)
                console.log(data)
            })
            .catch(({ response }) => {
                toast.warning(response.data.message)
                validationErrors.value = response.data.errors
                console.log(response?.data?.errors)
            })
    }

    return {
        products, product, getAllProducts, getProductById, page, perPage, orderByField, orderByAsc, setOrderBy, isLoading, search, clear, form, save, validationErrors
    }
}, { persist: true })
