export function filterNumbersOnly(value) {
    return value.replace(/\D/g, '')
}

export function filterDecimalCharacters(value) {
    return value.replace(/[^.\d]/g, '')
}

export function formatWithAutoPrecision(value) {
    const digits = Math.ceil(Math.abs(Math.log10(value))) + 4
    if (digits < 1 || digits > 20) return '0'
    return value.toPrecision(digits).replace(/\.?0+$/, '')
}