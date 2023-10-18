import { useAuthStore } from '@/stores/auth'
import { useToast } from "vue-toastification"

/**
 * Middleware - if user lost authentication (401) it gets kicked out
 * FROM https://youtu.be/BWNcuB3LQz8?t=1119
 */
const middleware401 = async error => {
	const { status } = error.request
    const toast = useToast()

	if (status === 401 || status === 419) {
		const auth = useAuthStore()
		toast.warning(error?.response?.data?.message ?? 'You lost your credentials - will be redirected to login page.')
		setTimeout(async () => await auth.clearState(), 1000)
		return Promise.reject({
			name: 'Permission denied',
			message: 'You lost your credentials - will be redirected to login page.',
		})
	}
	return Promise.reject(error)
}

export { middleware401 as default }