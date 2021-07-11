export default async (file: File) => {
  const content = await readFile(file)
  const parsed = JSON.parse(content)
  const data = toData(parsed)
  return data
}

// Process file into string
const readFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event?.target?.result) {
        const result = event.target.result.toString()
        console.log('HAR file reading complete.')
        resolve(result)
      } else {
        console.error('HAR File reading error (no event)')
        reject('HAR File reading error (no event)')
      }
      event?.target?.result ? resolve(event?.target?.result?.toString()) : reject('No event')
    }
    reader.onerror = (error) => {
      console.error('HAR File reading error', error)
      reject('HAR File reading error')
    }
    reader.readAsText(file)
  })

// Process parse JSON to data
const toData = (parsed: any) => {
  console.log('Contents converted to JSON.')
  const data: LogData[] = []
  parsed.log.entries.forEach((e: any) => {
    const url = e.request.url
    const ref =
      e.request.headers.find((e: any) => e.name === 'Referer' || e.name === 'referer')?.value.replace('https://', '') ||
      'Undefined'
    const status = e.response.status
    const size = e.response.content.size
    // Check if already recorded
    const index = data.findIndex((e) => e.url === url)
    // New
    if (index < 0) {
      data.push({
        id: data.length,
        url: url,
        referrers: [ref],
        statuses: [status],
        sizes: [size],
        maxSize: size ? size : 0,
        type: e._resourceType,
        count: 1,
        open: false,
      })
      // Duplicate
    } else {
      data[index].count += 1
      data[index].referrers.push(ref)
      data[index].statuses.push(status)
      data[index].sizes.push(size)
      if (size && size > data[index].maxSize) data[index].maxSize = size
      return
    }
    // Remove duplicates from arrays
    data.forEach((e) => {
      e.referrers = [...new Set(e.referrers)]
      e.statuses = [...new Set(e.statuses)]
      e.sizes = [...new Set(e.sizes)]
    })
  })
  console.log('Data processed.', data)
  return data
}

// Log type
export type LogData = {
  id: number
  url: string
  count: number
  type: string
  referrers: string[]
  statuses: string[]
  sizes: string[]
  maxSize: number
  open: boolean
}
