class ImageSets {
  constructor() {
    this.imageSets = {};
    this.id = 0;
  }

  addImageSet(imageSet) {
    this.imageSets[this.id] = Object.assign({}, imageSet);
    let jobToSchedule = Object.assign({id: this.id}, imageSet);
    this.imageSets[this.id].status = 'scheduled';
    this.imageSets[this.id].receivedAt = new Date();
    this.id++;
    return jobToSchedule;
  }

  completedProcessing(id, tags) {
    this.imageSets[id].status = 'completed';
    this.imageSets[id].tags = tags;
  }

  get(id) {
    return Object.assign({}, this.imageSets[id]);
  }
}

module.exports = ImageSets;
