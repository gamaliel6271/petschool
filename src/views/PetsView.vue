<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../services/api'

const pets = ref([])
const tutores = ref([])
const carregando = ref(true)
const erro = ref('')

const nomeDoTutor = computed(() => {
  const mapa = {}
  tutores.value.forEach((tutor) => {
    mapa[String(tutor.id)] = tutor.nome
  })
  return (tutorId) => mapa[String(tutorId)] || '—'
})

async function carregarDados() {
  carregando.value = true
  erro.value = ''
  try {
    const [listaPets, listaTutores] = await Promise.all([
      api.get('/pets'),
      api.get('/tutores')
    ])
    pets.value = listaPets
    tutores.value = listaTutores
  } catch (e) {
    erro.value = 'Não foi possível carregar os dados. Verifique se o json-server está rodando (npm run api).'
  } finally {
    carregando.value = false
  }
}

onMounted(carregarDados)
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Pets</h1>
        <p class="page-subtitle">
          Os pets são cadastrados a partir da tela do tutor.
        </p>
      </div>
      <RouterLink to="/tutores" class="btn-save">
        <i class="bi bi-plus-lg"></i> Novo pet
      </RouterLink>
    </div>

    <div v-if="erro" class="alert-error-ui mb-3">{{ erro }}</div>

    <div class="card-ui p-0">
      <div v-if="carregando" class="empty-state">Carregando pets...</div>

      <div v-else-if="pets.length === 0" class="empty-state">
        Nenhum pet cadastrado.
      </div>

      <table v-else class="table table-ui">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Espécie</th>
            <th>Tutor</th>
            <th class="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pet in pets" :key="pet.id">
            <td>{{ pet.id }}</td>
            <td>{{ pet.nome }}</td>
            <td>{{ pet.especie }}</td>
            <td>{{ nomeDoTutor(pet.tutorId) }}</td>
            <td class="text-end">
              <RouterLink :to="`/pets/${pet.id}`" class="btn-soft-blue">
                <i class="bi bi-eye"></i> Visualizar
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
