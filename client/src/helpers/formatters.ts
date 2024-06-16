export const formatTime = (datestring: string) => {
    const formatter = Intl.DateTimeFormat(['ru-RU'], {
        dateStyle: 'long',
        timeStyle: 'short',
    })
    const date = new Date(datestring)

    return formatter.format(date)
}

export const formatCurrency = (price: number) => {
    const formatter = Intl.NumberFormat(['ru-RU'])

    return formatter.format(price)
}
