let task = 'emailSend'
let to = 'me@me.com'
let body = 'hello'
let subject = 'hi'
let attachments = 'list of files on bucket'
let is_recurring = true
let recurrence_sec = 60 * 60 * 24
let priority = 'low'

process_id = jobExecute({
    task,
    params: {
        to,
        body,
        subject,
        attachments
    },
    priority,
    is_recurring,
    recurrence_sec
})