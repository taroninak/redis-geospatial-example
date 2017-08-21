#!/usr/bin/env node

const program = require('commander');

const gen = require('../services/generate');

program
    .version('0.0.1')
    .description('Simple command line interface for generating geospatial data')
    .option('-g, --generate', 'Generate redis geospatial data')
    .parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
} else if (program.generate) {
    console.log('Generated redis geospatial data!');
    gen.generate({ lat: 40.2238, lon: 44.5429617, count: 1000, radius: 10 });
}