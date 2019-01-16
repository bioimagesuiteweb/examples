/*  LICENSE
    
    _This file is Copyright 2018 by the Image Processing and Analysis Group (BioImage Suite Team). Dept. of Radiology & Biomedical Imaging, Yale School of Medicine._
    
    BioImage Suite Web is licensed under the Apache License, Version 2.0 (the "License");
    
    - you may not use this software except in compliance with the License.
    - You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)
    
    __Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.__
    
    ENDLICENSE */

"use strict";

const path=require('path');

const basedir=path.resolve(path.join(__dirname,'..'));
const indir=path.resolve(path.join(basedir,'web'));
const outdir=path.resolve(path.join(basedir,path.join('build','web')));

console.log('++++');
console.log('++++ Webpack basedir =',basedir);
console.log('++++         indir   =',indir);
console.log('++++         outdir  =',outdir);
console.log('++++');

module.exports = {
    resolve: {
        extensions: [ '.js'],
        modules : [ path.resolve(basedir,'node_modules'),
                    path.resolve(basedir,'lib/js'),
                    path.resolve(basedir,'code'),
                  ],
    },
    mode : 'development',
    entry : path.join(indir,'index.js'),
    output : {
        path : outdir,
        filename : 'index_bundle.js',
    },
    target : "web",
    externals: {
        "jquery": "jQuery", // require("jquery") is external and available on the global var jQuery
        "three": "THREE",  // available on the global variable THREE
        "bislib": "window.bioimagesuiteweb", // available in window.bioimagesuiteweb
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    }
};


