<script setup>
import helper from '../../utils/helper'

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  meta: {
    type: [Object, Array],
    required: true
  }
})

const emit = defineEmits(['getData'])

/**
 * A function that handles pagination change.
 *
 * @param {number} page - The page number to fetch data for.
 * @return {void} No return value.
 */
const paginationChange = (page) => {
  emit('getData', page)
}
</script>

<template>
  <div class="row" v-if="isLoading">
    <div class="col-md-2">
      <p class="placeholder-glow m-0 p-0">
        <span class="placeholder col-12"></span>
      </p>
    </div>
    <div class="col-md-7"></div>
    <div class="col-md-3">
      <p class="placeholder-glow m-0 p-0">
        <span class="placeholder col-12"></span>
      </p>
    </div>
  </div>

  <div class="row">
    <div class="col-md-4">
      <p v-if="!isLoading" class="text-muted">Showing {{ meta?.from }} - {{ meta?.to }} of {{ meta?.total }}</p>
    </div>

    <div class="col-md-8">
      <nav aria-label="Page navigation" v-if="!isLoading">
        <ul class="pagination pagination-sm justify-content-end">
          <li class="page-item" v-for="(link, i) in meta?.links" :key="i" :class="{ disabled: !link.url }">
            <a class="page-link" v-html="link.label" @click="paginationChange(helper.getPaginationPageFrom(link.url))"
              style="cursor: pointer" v-if="!link.active"></a>
            <span class="page-link active" style="cursor: disabled" v-else>{{ link.label }}</span>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
