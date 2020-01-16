<template>
<div>
   <!-- current-user组件 -->
   <span>
      <slot v-bind:user="user">
          {{ user.lastName }}
      </slot>
  </span>

  <!-- 父组件 -->
  <!-- 我们可以使用 v-slot ，让它来定义我们提供的插槽props的名字 -->
  <current-user>
      <template v-slot:default="slotProps">
          {{ slotProps.user.firstName }}
      </template>
  </current-user>

</div>
</template>

<script>
export default {

}
</script>

<style>

</style>