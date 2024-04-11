import crypto from 'crypto'

export default function User(name, email, password){
    this.id = crypto.randomBytes(16).toString('hex')
    this.name = name,
    this.email = email,
    this.password = password,
    this.created_at = new Date().valueOf()
}