<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { api } from '../services/api'
import { maskCep, maskCpfCnpj, maskTelefone, onlyDigits } from '../utils/masks'

const route = useRoute()

// ID presente na URL
const tutorId = route.params.id

const tutor = ref(null)
const pets = ref([])
const carregando = ref(true)
const erro = ref('')
const sucesso = ref('')

const novoPet = ref({ nome: '', especie: '' })
const especies = ['Cachorro', 'Gato', 'Pássaro', 'Peixe', 'Coelho', 'Réptil', 'Outro']

const petValido = computed(
  () => novoPet.value.nome.trim().length > 0 && novoPet.value.especie !== ''
)

async function carregarDados() {
  carregando.value = true
  erro.value = ''
  try {
    const [dadosTutor, petsDoTutor] = await Promise.all([
      api.get(`/tutores/${tutorId}`),
      api.get(`/pets?tutorId=${tutorId}`)
    ])
    tutor.value = dadosTutor
    pets.value = petsDoTutor
  } catch (e) {
    erro.value = 'Tutor não encontrado ou o json-server não está rodando (npm run api).'
  } finally {
    carregando.value = false
  }
}

async function cadastrarPet() {
  if (!petValido.value) return

  try {
    await api.post('/pets', {
      nome: novoPet.value.nome.trim(),
      especie: novoPet.value.especie,
      tutorId: String(tutorId)
    })

    novoPet.value = { nome: '', especie: '' }
    sucesso.value = 'Pet cadastrado com sucesso!'
    await carregarPets()
  } catch (e) {
    erro.value = 'Não foi possível cadastrar o pet.'
  }
}

async function carregarPets() {
  try {
    pets.value = await api.get(`/pets?tutorId=${tutorId}`)
  } catch (e) {
    erro.value = 'Não foi possível carregar os pets.'
  }
}

function formatarTelefone(telefone) {
  return maskTelefone(telefone)
}

function formatarCpfCnpj(valor) {
  return maskCpfCnpj(valor)
}

function formatarCep(valor) {
  return maskCep(valor)
}

function temEndereco() {
  return tutor.value?.endereco && Object.values(tutor.value.endereco).some((v) => v)
}

watch(
  () => route.params.id,
  () => carregarDados()
)

onMounted(carregarDados)
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Detalhes do Tutor</h1>
        <p class="page-subtitle">Visualize os dados do tutor e cadastre pets vinculados.</p>
      </div>
      <RouterLink to="/tutores" class="btn-soft-blue">
        <i class="bi bi-arrow-left"></i> Voltar para Tutores
      </RouterLink>
    </div>

    <div v-if="erro" class="alert-error-ui mb-3">{{ erro }}</div>
    <div v-if="sucesso" class="alert-success-ui mb-3">{{ sucesso }}</div>

    <div v-if="carregando" class="card-ui">
      <div class="empty-state">Carregando dados do tutor...</div>
    </div>

    <template v-else-if="tutor">
      <!-- ===== Informações do Tutor ===== -->
      <div class="card-ui">
        <h2 class="card-ui-title">Informações do Tutor</h2>
        <h3 class="section-label">Dados do Tutor</h3>

        <div class="row">
          <div class="col-md-4 detail-item">
            <div class="detail-label">ID</div>
            <div class="detail-value">{{ tutor.id }}</div>
          </div>

          <div class="col-md-4 detail-item">
            <div class="detail-label">Nome Completo</div>
            <div class="detail-value">{{ tutor.nome }}</div>
          </div>

          <div class="col-md-4 detail-item">
            <div class="detail-label">CPF/CNPJ</div>
            <div class="detail-value">
              {{ tutor.cpfCnpj ? formatarCpfCnpj(tutor.cpfCnpj) : '—' }}
            </div>
          </div>

          <div class="col-md-4 detail-item">
            <div class="detail-label">Telefone/Celular/WhatsApp</div>
            <div class="detail-value">{{ formatarTelefone(tutor.telefone) }}</div>
          </div>

          <div class="col-md-4 detail-item">
            <div class="detail-label">E-mail</div>
            <div class="detail-value">{{ tutor.email || '—' }}</div>
          </div>

          <div class="col-md-4 detail-item">
            <div class="detail-label">Data de Nascimento</div>
            <div class="detail-value">{{ tutor.dataNascimento || '—' }}</div>
          </div>
        </div>

        <template v-if="temEndereco()">
          <h3 class="section-label mt-2">Endereço</h3>

          <div class="row">
            <div class="col-md-4 detail-item">
              <div class="detail-label">Rua</div>
              <div class="detail-value">{{ tutor.endereco.rua || '—' }}</div>
            </div>

            <div class="col-md-4 detail-item">
              <div class="detail-label">Número</div>
              <div class="detail-value">{{ tutor.endereco.numero || '—' }}</div>
            </div>

            <div class="col-md-4 detail-item">
              <div class="detail-label">Bairro</div>
              <div class="detail-value">{{ tutor.endereco.bairro || '—' }}</div>
            </div>

            <div class="col-md-4 detail-item">
              <div class="detail-label">Cidade</div>
              <div class="detail-value">{{ tutor.endereco.cidade || '—' }}</div>
            </div>

            <div class="col-md-4 detail-item">
              <div class="detail-label">Estado</div>
              <div class="detail-value">{{ tutor.endereco.estado || '—' }}</div>
            </div>

            <div class="col-md-4 detail-item">
              <div class="detail-label">CEP</div>
              <div class="detail-value">
                {{ tutor.endereco.cep ? formatarCep(tutor.endereco.cep) : '—' }}
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- ===== Pets do Tutor ===== -->
      <h2 class="card-ui-title">Pets do Tutor</h2>

      <div class="pets-layout">
        <!-- Tabela de pets vinculados -->
        <div class="card-ui">
          <div class="d-flex align-items-center gap-2 mb-3">
            <h3 class="section-label mb-0">Pets vinculados</h3>
            <span class="badge-pets">{{ pets.length }} {{ pets.length === 1 ? 'pet' : 'pets' }}</span>
          </div>

          <div v-if="pets.length === 0" class="empty-state">
            Nenhum pet vinculado a este tutor.
          </div>

          <table v-else class="table table-ui">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Espécie</th>
                <th class="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pet in pets" :key="pet.id">
                <td>{{ pet.id }}</td>
                <td>{{ pet.nome }}</td>
                <td>{{ pet.especie }}</td>
                <td class="text-end">
                  <RouterLink :to="`/pets/${pet.id}`" class="btn-soft-blue">
                    <i class="bi bi-eye"></i> Visualizar
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Formulário de cadastro de pet -->
        <div class="card-ui">
          <h3 class="card-ui-title">Cadastrar novo pet</h3>
          <p class="page-subtitle mb-3">
            O pet será vinculado automaticamente a {{ tutor.nome }}.
          </p>

          <div class="mb-3">
            <label class="form-label-ui">Nome do pet</label>
            <input
              v-model="novoPet.nome"
              class="form-control-ui"
              placeholder="Digite o nome do pet"
            />
          </div>

          <div class="mb-3">
            <label class="form-label-ui">Espécie</label>
            <select v-model="novoPet.especie" class="form-select-ui">
              <option value="" disabled>Selecione</option>
              <option v-for="especie in especies" :key="especie" :value="especie">
                {{ especie }}
              </option>
            </select>
          </div>

          <div class="d-flex justify-content-end">
            <button class="btn-green" :disabled="!petValido" @click="cadastrarPet">
              Cadastrar pet
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
