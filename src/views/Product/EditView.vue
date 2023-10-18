<script setup>
import Card from '../../components/Card.vue'
import ProductForm from './FormView.vue'
import { useProductStore } from '@/stores/product'
import Alert from './AlertView.vue'

const store = useProductStore()
</script>

<template>
    <div class="container">
        <Card subtitle="Edit selected product" class="mt-5">
            <form @submit.prevent="store.save">
                <ProductForm :formData="store.product"/>
            </form>
        </Card>

        <Alert />
    </div>
</template>
