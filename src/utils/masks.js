/** Remove tudo que não for número */
export function onlyDigits(value) {
  return (value || '').replace(/\D/g, '')
}

/** Máscara de telefone: (47) 99999-0001 */
export function maskTelefone(value) {
  const d = onlyDigits(value).slice(0, 11)

  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/**
 * Máscara de CPF/CNPJ.
 * A máscara muda conforme a quantidade de caracteres:
 * até 11 dígitos = CPF, acima = CNPJ.
 */
export function maskCpfCnpj(value) {
  const d = onlyDigits(value).slice(0, 14)

  if (d.length <= 11) {
    // CPF: 000.000.000-00
    let out = d.slice(0, 3)
    if (d.length > 3) out += `.${d.slice(3, 6)}`
    if (d.length > 6) out += `.${d.slice(6, 9)}`
    if (d.length > 9) out += `-${d.slice(9, 11)}`
    return out
  }

  // CNPJ: 00.000.000/0000-00
  let out = d.slice(0, 2)
  if (d.length > 2) out += `.${d.slice(2, 5)}`
  if (d.length > 5) out += `.${d.slice(5, 8)}`
  if (d.length > 8) out += `/${d.slice(8, 12)}`
  if (d.length > 12) out += `-${d.slice(12, 14)}`
  return out
}

/** Máscara de data: dd/mm/aaaa */
export function maskData(value) {
  const d = onlyDigits(value).slice(0, 8)

  let out = d.slice(0, 2)
  if (d.length > 2) out += `/${d.slice(2, 4)}`
  if (d.length > 4) out += `/${d.slice(4, 8)}`
  return out
}

/** Máscara de CEP: 00000-000 */
export function maskCep(value) {
  const d = onlyDigits(value).slice(0, 8)

  let out = d.slice(0, 5)
  if (d.length > 5) out += `-${d.slice(5, 8)}`
  return out
}

/** Validação de e-mail */
export function isEmailValid(value) {
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

/** Telefone válido: pelo menos 10 dígitos (fixo) ou 11 (celular) */
export function isTelefoneValid(value) {
  return onlyDigits(value).length >= 10
}
