import crypto from 'crypto'

export default function RefreshToken(token, grant_id = null){
    this.id = crypto.randomBytes(16).toString('hex')
    this.token = token;
    this.is_used = false,
    this.grant_id = grant_id
}