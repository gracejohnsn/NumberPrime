module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
	included: true,
    files: [
	  'spec/firebase-nightlight',
	  'public/Classes.js',
	  'spec/testData.js',
      'spec/*Spec.js'
    ],
    browsers: ['Firefox'], //PhantomJS 
    singleRun: true,
    reporters: ['progress', 'coverage'],
    preprocessors: { 'public/Classes.js': ['coverage'] }
  });
};
