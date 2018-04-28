var path = require('path');
//nodejs 中 path对象用于处理目录对象,提高开发效率
//模块导入

module.exports = {
  //入口文件
  entry : './src/main.js',
  //输出
  output : {
    //文件地址,使用绝对path.join绝对路径
    path : path.join(__dirname, './dist'),
    //[name]这里是webpack根据路口文件自动生成的名字
    filename : '[name].js',
    //公共文件生成的地址
    publicPath : '/dist/'
  },
  //服务器相关,自动刷新
  devServer : {
    //Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback : false,
    //hot module replacement 模块热替换,无需刷新整个页面,把改变的部分替换
    hot : false,
    //支持iframe模式和inline模式
    inline : true,
    //进度条
    progress : true
  },
  //加载器
  module : {
    loaders : [
      //解析vue文件
      {test : /\.vue$/, loader : 'vue-loader'},
      //转化ES6语法
      {test : /\.js$/, loader : 'babel-loader', exclude : /node_modules/},
      //编译css并自动添加css前缀
      {test : /\.css$/, loader : 'style-loader!autoprefixer-loader!css-loader'},
      //.scss文件编译
      //需要css-loader,style-loader,sass-loader,node-sass,
      {test : /\.scss$/, loader : 'css-loader!style-loader!sass-loader!node-sass'},
      //图片转化,小于8k的图片转化为base64编码的
      {test : /\.(png|jpg|gif)$/, loader : 'url-loader?limit=8192'},
      //html模板编译
      {test : /\.(html|tpl)$/, loader : 'html-loader'}
    ]
  },
  //.vue的配置
  vue : {
    loaders : {
      css : 'style-loader!autoprefixer-loader'
    }
  },
  //转化为ES5语法
  babel : {
    presets : ['es2015'],
    //合聚代码,不污染区全局
    plugins : ['transform-runtime']
  },
  reslove : {
    //require时省略的扩展名
    extensions : ['','.js','.vue'],
    //别名,可以直接使用别名来代表设定的路径
    alias : {
      filter : path.join(__dirname, './src/filters'),
      components : path.join(__dirname, './src/components')
    }
  },
  //开启source-map
  devtool : 'eval-source-map'
};
