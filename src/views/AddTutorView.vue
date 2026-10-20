<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import {
  maskCep,
  maskCpfCnpj,
  maskData,
  maskTelefone,
  onlyDigits,
  isEmailValid,
  isTelefoneValid
} from '../utils/masks'

const router = useRouter()

const form = reactive({
  nome: '',
  telefone: '',
  cpfCnpj: '',
  email: '',
  dataNascimento: '',
  endereco: {
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  }
})

const estados = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS',
  'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC',
  'SE', 'SP', 'TO'
]


const touched = reactive({
  nome: false,
  telefone: false,
  email: false
})

const enviando = ref(false)
const erro = ref('')


const nomeInvalido = computed(() => form.nome.trim().length === 0)
const telefoneInvalido = computed(() => !isTelefoneValid(form.telefone))
const emailInvalido = computed(() => !isEmailValid(form.email))

const formValido = computed(
  () => !nomeInvalido.value && !telefoneInvalido.value && !emailInvalido.value
)

function aplicarMascaraTelefone() {
  form.telefone = maskTelefone(form.telefone)
}

function aplicarMascaraCpfCnpj() {
  form.cpfCnpj = maskCpfCnpj(form.cpfCnpj)
}

function aplicarMascaraData() {
  form.dataNascimento = maskData(form.dataNascimento)
}

function aplicarMascaraCep() {
  form.endereco.cep = maskCep(form.endereco.cep)
}

async function salvar() {
  touched.nome = true
  touched.telefone = true
  touched.email = true

  if (!formValido.value || enviando.value) return

  enviando.value = true
  erro.value = ''

  const payload = {
    nome: form.nome.trim(),
    telefone: onlyDigits(form.telefone)
  }

  const cpfCnpj = onlyDigits(form.cpfCnpj)
  if (cpfCnpj) payload.cpfCnpj = cpfCnpj
  if (form.email.trim()) payload.email = form.email.trim()
  if (form.dataNascimento) payload.dataNascimento = form.dataNascimento
  if (form.endereco.rua || form.endereco.cidade) payload.endereco = { ...form.endereco }

  try {
    await api.post('/tutores', payload)
    router.push('/tutores')
  } catch (e) {
    erro.value = 'Não foi possível cadastrar o tutor. Verifique se o json-server está rodando (npm run api).'
    enviando.value = false
  }
}

function cancelar() {
  router.push('/tutores')
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Cadastrar Tutor</h1>
        <p class="page-subtitle">Preencha os dados para cadastrar um novo tutor.</p>
      </div>
    </div>

    <div v-if="erro" class="alert-error-ui mb-3">{{ erro }}</div>

    
    <div class="card-ui">
      <h2 class="card-ui-title">Dados do Tutor</h2>

      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label-ui">ID</label>
          <input class="form-control-ui" value="Gerado automaticamente" disabled />
        </div>

        <div class="col-md-8">
          <label class="form-label-ui">Nome Completo <span class="text-danger">*</span></label>
          <input
            v-model="form.nome"
            class="form-control-ui"
            :class="{ 'is-invalid': touched.nome && nomeInvalido }"
            placeholder="Digite o nome completo"
            @blur="touched.nome = true"
          />
          <div v-if="touched.nome && nomeInvalido" class="field-error">
            Ops, campo obrigatório, por favor preencha-o!
          </div>
        </div>

        <div class="col-md-4">
          <label class="form-label-ui">CPF/CNPJ</label>
          <input
            v-model="form.cpfCnpj"
            class="form-control-ui"
            placeholder="Digite o CPF ou CNPJ"
            maxlength="18"
            @input="aplicarMascaraCpfCnpj"
          />
          <div class="field-hint">
            A máscara muda conforme 11 dígitos (CPF) ou 14 dígitos (CNPJ).
          </div>
        </div>

        <div class="col-md-4">
          <label class="form-label-ui">Telefone/Celular/WhatsApp <span class="text-danger">*</span></label>
          <input
            v-model="form.telefone"
            class="form-control-ui"
            :class="{ 'is-invalid': touched.telefone && telefoneInvalido }"
            placeholder="(00) 00000-0000"
            maxlength="16"
            @input="aplicarMascaraTelefone"
            @blur="touched.telefone = true"
          />
          <div v-if="touched.telefone && telefoneInvalido" class="field-error">
            <span v-if="onlyDigits(form.telefone).length === 0">
              Ops, campo obrigatório, por favor preencha-o!
            </span>
            <span v-else>Formato: (00) 00000-0000</span>
          </div>
          <div v-else class="field-hint">Formato: (00) 00000-0000</div>
        </div>

        <div class="col-md-4">
          <label class="form-label-ui">E-mail</label>
          <input
            v-model="form.email"
            class="form-control-ui"
            :class="{ 'is-invalid': touched.email && emailInvalido }"
            placeholder="nome@example.com"
            @blur="touched.email = true"
          />
          <div v-if="touched.email && emailInvalido" class="field-error">
            Informe um e-mail válido.
          </div>
        </div>

        <div class="col-md-4">
          <label class="form-label-ui">Data de Nascimento</label>
          <input
            v-model="form.dataNascimento"
            class="form-control-ui"
            placeholder="dd/mm/aaaa"
            maxlength="10"
            @input="aplicarMascaraData"
          />
        </div>
      </div>
    </div>

    <div class="card-ui">
      <h2 class="card-ui-title">Endereço</h2>

      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label-ui">Rua</label>
          <input
            v-model="form.endereco.rua"
            class="form-control-ui"
            placeholder="Digite o nome da rua"
          />
        </div>

        <div class="col-md-6">
          <label class="form-label-ui">Número</label>
          <input
            v-model="form.endereco.numero"
            class="form-control-ui"
            placeholder="Número"
          />
        </div>

        <div class="col-md-4">
          <label class="form-label-ui">Bairro</label>
          <input
            v-model="form.endereco.bairro"
            class="form-control-ui"
            placeholder="Digite o bairro"
          />
        </div>

        <div class="col-md-4">
          <label class="form-label-ui">Cidade</label>
          <input
            v-model="form.endereco.cidade"
            class="form-control-ui"
            placeholder="Digite a cidade"
          />
        </div>

        <div class="col-md-2">
          <label class="form-label-ui">Estado</label>
          <select v-model="form.endereco.estado" class="form-select-ui">
            <option value="">Selecione</option>
            <option v-for="uf in estados" :key="uf" :value="uf">{{ uf }}</option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label-ui">CEP</label>
          <input
            v-model="form.endereco.cep"
            class="form-control-ui"
            placeholder="00000-000"
            maxlength="9"
            @input="aplicarMascaraCep"
          />
        </div>
      </div>
    </div>

    <div v-if="!formValido" class="alert-info-ui mb-3">
      Preencha corretamente Nome e Telefone para habilitar o cadastro.
    </div>

    <div class="d-flex justify-content-end gap-2">
      <button class="btn-cancel" @click="cancelar">Cancelar</button>
      <button class="btn-save" :disabled="!formValido || enviando" @click="salvar">
        Cadastrar Tutor
      </button>
    </div>
  </div>
</template>
