<script setup lang="ts">
import { ref } from "vue";

let formValue = ref({
  user: {
    name: "",
    age: "",
  },
  phone: "",
});

function handleValidateClick(e: MouseEvent) {
  e.preventDefault();
//   formValue.value?.validate((errors) => {
//     if (!errors) {
//       message.success("Valid");
//     } else {
//       console.log(errors);
//       message.error("Invalid");
//     }
//   });
}
</script>

<template>
  <n-form ref="">
    <n-form-item label="姓名" path="user.name">
      <n-input v-model:value="formValue.user.name" placeholder="输入姓名" />
    </n-form-item>
    <n-form-item label="年龄" path="user.age">
      <n-input v-model:value="formValue.user.age" placeholder="输入年龄" />
    </n-form-item>
    <n-form-item label="电话号码" path="phone">
      <n-input v-model:value="formValue.phone" placeholder="电话号码" />
    </n-form-item>
    <n-form-item>
      <n-button attr-type="button" @click="handleValidateClick">
        验证
      </n-button>
    </n-form-item>
  </n-form>
</template>
