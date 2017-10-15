export default class MetadataAnalyzer {
  constructor() {
    this.friendsDataPromise = fetch('./quantiphi/friends/metatags/output_E01.json')
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

    this.newsDataPromise = fetch('./smapi/assetdata/1034_20171013170000.json')
    .then(resp => resp.json())
    .then(data => data.events.programSegments)
    .then(segments => {
      return segments.filter(segment => segment.terms.length >= 1)
    })
    .catch(err => {})
  }

  getTag(time) {
    return this.friendsDataPromise.then(tags => tags.find(tag => tag.time >= time))
  }

  getPastSegmentTerms(time) {
    const timeInSeconds = time * 1000
    return this.newsDataPromise.then(segments => {
      return segments.filter(segment => segment.out <= timeInSeconds)
      .map(segment => segment.terms[0])
      .map(this.titleCase)
      .join('\n')
    })
  }

  titleCase(str) {
    return str.toLowerCase().split(' ').map((word) => {
      return word.replace(word[0], word[0].toUpperCase());
    }).join(' ');
  }
} 
