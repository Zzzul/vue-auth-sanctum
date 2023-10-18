<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import Input from '@/components/Form/Input.vue'
import { onMounted, watch } from 'vue'
import { useProductStore } from '@/stores/product'
import Button from '@/components/Button.vue'
import BIcon from '@/components/Icon/BIcon.vue'

const props = defineProps({
    formData: {
        type: Object,
        required: true
    }
})

const store = useProductStore()
const { values, meta, errors, defineInputBinds, defineComponentBinds, setValues } = useForm({
    validationSchema: yup.object({
        email: yup.string().email().required(),
        name: yup.string().required(),
    }),
})

const email = defineInputBinds('email', {
    validateOnInput: true,
})

const name = defineComponentBinds('name', {
    validateOnInput: true,
})

watch(values, () => {
    store.form = values
    store.validationErrors = null
})

onMounted(() => {
    store.validationErrors = null
    setValues({...props.formData})
})
</script>
<template>
    <Input v-bind="name" class="mb-3" label="Name" id="name" placeholder="name" :error="errors.name" />

    <label for="email" class="form-label">Email</label>
    <input v-bind="email" class="form-control" :class="{ 'is-invalid': errors.email }" id="email" type="text"
        placeholder="Email" />
    <div class="text-danger" v-if="errors.email">
        {{ errors.email }}
    </div>

    <Button class="mt-3" type="submit" :is-small="true" :disabled="!meta.valid && meta.touched">
        <BIcon name="save" /> <span class="ps-1">Save</span>
    </Button>
</template>