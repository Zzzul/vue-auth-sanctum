import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '../api/useAPI'
import { useRouter } from 'vue-router'
import { useToast } from "vue-toastification"
import { useRedirectStore } from './redirect'

export const useAuthStore = defineStore('auth', () => {
    const api = useApi()
    const router = useRouter()
    const toast = useToast()
    const redirect = useRedirectStore()

    const token = ref(null)
    const isLoggedIn = ref(false)
    const user = ref(null)
    const validationErrors = ref(null)

    /**
     * Sends a login request to the server with the provided username and password.
     *
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @return {Promise<void>} - A promise that resolves with no value.
     */
    const login = async (username, password) => {
        await api.post('/auth/login', { username, password })
            .then(({ data }) => {
                setAsLoggedIn(data)
                toast.success(data.message)

                if (redirect.route) {
                    const { name } = redirect.route
                    redirect.clearRoute()
                    router.push(name)
                    return
                }

                router.push({ name: 'home' })
            })
            .catch(({ response }) => {
                validationErrors.value = response?.data?.errors
                toast.error(response.data.message)
            })
    }

    /**
     * Generate the token header for API requests.
     *
     * @return {object} The token header object.
     */
    const getTokenHeader = () => {
        return {
            Authorization: `Bearer ${token.value}`
        }
    }

    /**
     * Logs the user out by making a POST request to the logout endpoint.
     *
     * @return {Promise<void>} A promise that resolves when the logout process is complete.
     */
    const logout = async () => {
        await api.post('/auth/logout', '', {
            headers: {
                Authorization: `Bearer ${token.value}`
            },
        }).then(({ data }) => {
            redirect.setRoute(null)
            toast.success(data.message)
            clearState()
            // router.push({ name: 'login' })
        }).catch(({ response }) => {
            validationErrors.value = response.data.errors
            toast.error(response.data.message)
        })
    }

    /**
     * Resets the validation errors to null.
     */
    const resetValidationErrors = () => {
        validationErrors.value = null
    }

    /**
     * Clears the state of the application.
     */
    const clearState = () => {
        token.value = null
        isLoggedIn.value = false
        user.value = null
        validationErrors.value = null
        router.push({ name: 'login' })
    }

    /**
     * Set the user as logged in.
     *
     * @param {object} data - The data containing the user's token, user object, and validation errors.
     */
    const setAsLoggedIn = (data) => {
        token.value = data.token
        isLoggedIn.value = true
        user.value = data.user
        validationErrors.value = null
    }

    return {
        login,
        logout,
        isLoggedIn,
        user,
        token,
        validationErrors,
        resetValidationErrors,
        clearState,
        setAsLoggedIn,
        getTokenHeader
    }
}, { persist: true })
