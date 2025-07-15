import { defineStore } from 'pinia'

export const useFamilyStore = defineStore('family', {
  state: () => ({
    id: undefined as string | undefined,
    code: undefined as string | undefined,
    name: undefined as string | undefined,
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
      this.id = undefined
      this.code = undefined
      this.name = undefined
    },
  },
})
