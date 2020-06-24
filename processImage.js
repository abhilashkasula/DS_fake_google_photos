const processImage = (image) => {
  return new Promise((resolve, reject) => {
    for(let i = 0; i < +image.count; i ++) {
      for(let j = 0; j < +image.width; j++) {
        for(let k = 0; k < +image.height; k++) {
          let a = 1;
          let b = 2;
          let c = a;
          b = a;
          b = c;
        }
      }
    }
    const tags = image.tags.split('_');
    resolve(tags);
  });
};

module.exports = {processImage};
