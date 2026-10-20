<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { api } from '../services/api'
import { maskTelefone } from '../utils/masks'

const router = useRouter()

const tutores = ref([])
const pets = ref([])
const carregando = ref(true)
const erro = ref('')
const aviso = ref('')

const petsPorTutor = computed(() => {
  const mapa = {}
  pets.value.forEach((pet) => {
    const chave = String(pet.tutorId)
    if (!mapa[chave]) mapa[chave] = []
    mapa[chave].push(pet)
  })
  return mapa
})

function petsDoTutor(tutorId) {
  return petsPorTutor.value[String(tutorId)] || []
}

async function carregarDados() {
  carregando.value = true
  erro.value = ''
  try {
    const [listaTutores, listaPets] = await Promise.all([
      api.get('/tutores'),
      api.get('/pets')
    ])
    tutores.value = listaTutores
    pets.value = listaPets
  } catch (e) {
    erro.value = 'Não foi possível carregar os dados. Verifique se o json-server está rodando (npm run api).'
  } finally {
    carregando.value = false
  }
}

async function excluirTutor(tutor) {
  aviso.value = ''

  // Antes de excluir, verificamos se o tutor possui pets vinculados
  const vinculados = petsDoTutor(tutor.id)
  if (vinculados.length > 0) {
    aviso.value = `O tutor ${tutor.nome} possui ${vinculados.length} pet(s) vinculado(s). Remova ou transfira os pets antes de excluir.`
    return
  }

  const confirmado = window.confirm('Deseja realmente remover este tutor?')
  if (!confirmado) return

  try {
    await api.remove(`/tutores/${tutor.id}`)
    await carregarDados()
  } catch (e) {
    erro.value = 'Não foi possível remover o tutor.'
  }
}

function formatarTelefone(telefone) {
  return maskTelefone(telefone)
}

onMounted(carregarDados)
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Tutores</h1>
        <p class="page-subtitle">Gerencie os tutores e veja os pets vinculados a cada um.</p>
      </div>
      <RouterLink to="/tutores/novo" class="btn-save">
        <i class="bi bi-plus-lg"></i> Novo tutor
      </RouterLink>
    </div>

    <div v-if="erro" class="alert-error-ui mb-3">{{ erro }}</div>
    <div v-if="aviso" class="alert-info-ui mb-3">{{ aviso }}</div>

    <div class="card-ui p-0">
      <div v-if="carregando" class="empty-state">Carregando tutores...</div>

      <div v-else-if="tutores.length === 0" class="empty-state">
        Nenhum tutor cadastrado.
      </div>

      <table v-else class="table table-ui">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome completo</th>
            <th>Telefone</th>
            <th>Qtd. de pets</th>
            <th>Pets vinculados</th>
            <th class="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tutor in tutores" :key="tutor.id">
            <td>{{ tutor.id }}</td>
            <td>{{ tutor.nome }}</td>
            <td>{{ formatarTelefone(tutor.telefone) }}</td>
            <td>
              <span class="badge-pets">{{ petsDoTutor(tutor.id).length }}</span>
            </td>
            <td>
              <span v-if="petsDoTutor(tutor.id).length">
                {{ petsDoTutor(tutor.id).map((p) => p.nome).join(', ') }}
              </span>
              <span v-else class="text-muted">Nenhum pet vinculado</span>
            </td>
            <td class="text-end">
              <RouterLink :to="`/tutores/${tutor.id}`" class="btn-soft-blue me-2">
                <i class="bi bi-eye"></i> Visualizar
              </RouterLink>
              <button class="btn-soft-red" @click="excluirTutor(tutor)">
                <i class="bi bi-trash"></i> Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
