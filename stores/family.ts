import { defineStore } from 'pinia'

export const useFamilyStore = defineStore('family', {
  state: () => ({
    id: '',
    code: '',
  }),
  actions: {
    setId(newId: string) {
      this.id = newId
    },
    setCode(newCode: string) {
      this.code = newCode
    },
    clearFamily() {
      this.id = ''
      this.code = ''
    },
  },
})
