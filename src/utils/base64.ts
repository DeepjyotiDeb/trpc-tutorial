export function encode(data: String) {
    return Buffer.from(data, 'utf-8').toString('base64')
}
export function decode(data: String) {
    return Buffer.from(data, 'base64').toString('utf-8')
}