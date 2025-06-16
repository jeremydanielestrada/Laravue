import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useLogin() {
  //utilize variable
  const router = useRouter()

  const formData = ref({
    email: '',
    password: '',
  })
}
