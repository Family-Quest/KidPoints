import { defineStore } from 'pinia'

export const useFamilyStore = defineStore('family', {
  state: () => ({
    id: '',
    code: '',
    name: '',
  }),
  actions: {
    setId(newId: string) {
      this.id = newId
    },
    setCode(newCode: string) {
      this.code = newCode
    },
    setName(newName: string) {
      this.name = newName
    },
    clearFamily() {
      this.id = ''
      this.code = ''
      this.name = ''
    },
  },
})
