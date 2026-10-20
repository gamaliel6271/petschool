<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { api } from '../services/api'
import { maskTelefone } from '../utils/masks'

const route = useRoute()

// ID presente na URL
const petId = route.params.id

const pet = ref(null)
const tutor = ref(null)
const carregando = ref(true)
const erro = ref('')

async function carregarDados() {
  carregando.value = true
  erro.value = ''
  try {
    pet.value = await api.get(`/pets/${petId}`)

    if (pet.value.tutorId) {
      try {
        tutor.value = await api.get(`/tutores/${pet.value.tutorId}`)
      } catch (e) {
        tutor.value = null
      }
    }
  } catch (e) {
    erro.value = 'Pet não encontrado ou o json-server não está rodando (npm run api).'
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
        <h1 class="page-title">Detalhes do Pet</h1>
        <p class="page-subtitle">Veja os dados do pet e do tutor vinculado.</p>
      </div>
      <RouterLink to="/pets" class="btn-soft-blue">
        <i class="bi bi-arrow-left"></i> Voltar para Pets
      </RouterLink>
    </div>

    <div v-if="erro" class="alert-error-ui mb-3">{{ erro }}</div>

    <div v-if="carregando" class="card-ui">
      <div class="empty-state">Carregando dados do pet...</div>
    </div>

    <div v-else-if="pet" class="card-ui">
      <h2 class="card-ui-title">Dados do Pet</h2>

      <div class="row">
        <div class="col-md-4 detail-item">
          <div class="detail-label">ID</div>
          <div class="detail-value">{{ pet.id }}</div>
        </div>

        <div class="col-md-4 detail-item">
          <div class="detail-label">Nome</div>
          <div class="detail-value">{{ pet.nome }}</div>
        </div>

        <div class="col-md-4 detail-item">
          <div class="detail-label">Espécie</div>
          <div class="detail-value">{{ pet.especie }}</div>
        </div>
      </div>

      <h3 class="section-label mt-2">Tutor</h3>

      <template v-if="tutor">
        <div class="row">
          <div class="col-md-4 detail-item">
            <div class="detail-label">Nome Completo</div>
            <div class="detail-value">{{ tutor.nome }}</div>
          </div>

          <div class="col-md-4 detail-item">
            <div class="detail-label">Telefone/Celular/WhatsApp</div>
            <div class="detail-value">{{ maskTelefone(tutor.telefone) }}</div>
          </div>

          <div class="col-md-4 detail-item">
            <div class="detail-label">Acesso rápido</div>
            <RouterLink :to="`/tutores/${tutor.id}`" class="btn-soft-blue">
              <i class="bi bi-eye"></i> Ver tutor
            </RouterLink>
          </div>
        </div>
      </template>

      <div v-else class="empty-state">Este pet não possui tutor vinculado.</div>
    </div>
  </div>
</template>
