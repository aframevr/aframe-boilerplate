export default class MetadataAnalyzer {
  constructor() {
    this.dataPromise = fetch('./quantiphi/friends/metatags/output_E01.json')
    .then(resp => resp.json())
    .then(data => {
      return Object.entries(data).map((data) => {
        const timeParts = data[0].split(":")
        const hourInSeconds = parseInt(timeParts[0]) * 60 * 60
        const minInSeconds = parseInt(timeParts[1]) * 60 
        const seconds = parseInt(timeParts[2])
        return {
          time: hourInSeconds + minInSeconds + seconds,
          data: data[1] 
        }
      })
    })
  }

  getTag(time) {
    return this.dataPromise.then(tags => tags.find(tag => tag.time >= time))
  }
} 
