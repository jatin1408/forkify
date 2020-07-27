const path=require('path');
const HWP=require('html-webpack-plugin');
module.exports={
    entry:['./src/js/index.js'],
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'js/bundle.js'
    },
    devServer:{
        contentBase:'./dist'
    },
    plugins:[
        new HWP({
            filename:'index.html',
            template:'./src/index.html'
        })
    ]


};