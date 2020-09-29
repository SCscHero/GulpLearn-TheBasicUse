/*
 * gulpfile.js文件，专门编写任务。只能叫这个名字。
 * commonJS规范
 * 1、使用require()将指定模块引入
 * 2、使用这个模块上的函数
 */

/*
 * gulp控制台命令：功能：命令
 * 1、运行你编写好的任务：gulp 任务名
 * 2、
 *
 * gulp方法学习：
 *gulp.src()找到源文件路径
 *gulp.dest()找到目的文件路径【注】如果设置的这个目的文件不存在，会自动创建
 * pipe()理解程序运行管道
 */

//使用const比var更合适，因为不可改变
const gulp = require('gulp');//通过require引入库/插件
const gulp_sass = require('gulp-sass');//引入gulp-sass插件
const gulp_minify_css = require('gulp-minify-css');//引入css代码压缩插件
const gulp_rename = require('gulp-rename');//引入重命名文件插件
const gulp_concat = require('gulp-concat');//引入文件合并插件
const gulp_uglify = require('gulp-uglify');//引入js代码压缩插件
const gulp_connect = require('gulp-connect');//引入启动服务器插件

/*
 * 拓展：一般项目开发中会有两个css版本。
 * 开发版本：index.css
 * 上线版本：index.min.css（压缩后的版本）
 */


/*
 * First task
 * 第一个参数，string：任务的名字  自定义
 * 第二个参数，func：任务执行的功能
 */
gulp.task('my_task', function () {
    setInterval(function () {
        console.log("Execute every five seconds");
    }, 5000);
});

/*
 * 将index.html移动到dist目录下
 */
gulp.task("copy-html", function () {
    return gulp.src(index.html).pipe(gulp.dest("dist/"));
});

/*
 * 整理静态图片文件
 */
gulp.task("images", function () {
    //return gulp.src("img/*.{jpg,png}").pipe.dest("dist/images");//*.{jpg,png}：任意文件名的jpg,png格式的文件
    //return gulp.src("img/*/*).pipe.dest("dist/images");//目录下的子文件夹下的所有文件（不包含目录下的文件）
    //return gulp.src("img/**/*).pipe.dest("dist/images");//目录下及子文件夹下的所有文件
});

/*
 * 拷贝多个文件到一个目录中
 */
gulp.task("data", function () {
    return gulp.src(["json/*.json", "xml/*.xml", "!xml/4.xml"]).pipe(gulp.dest("dist/data"));
});


/*
 * 一次性执行多个任务
 * 参数1：任务名
 * 参数2：多个执行的任务
 * 参数3：回调函数
 */
gulp.task("build", gulp.series("copy-html", "images", "data", function () {
    console.log("任务执行完毕");
}));


/*
 * 监听
 */
gulp.task("watch", function () {
    /*
     * 第一个参数，是文件监听的路径
     * 第二个参数，要去执行的任务
     */
    gulp.watch("index.html", ["copy-html"]);//监听html
    gulp.watch("img/**/*", ["images"]);//监听图片
    gulp.watch(["json/*.json", "xml/*.xml", "!xml/4.xml"], ["images"]);//监听数据文件
    gulp.watch("javascript/*.js",["jsMerge"]);
    gulp.watch("stylesheet/index.scss",["sass"]);
});



//到此，学习完后。发现gulp并没有什么用。
//gulp插件库：https://gulpjs.com/plugins/
/*
 *
 * 插件安装命令：(cnpm/npm) install [插件名字] --save-dev
 * 【备注】--save是将远程下载的插件保存在本地磁盘-dev是将插件保存到package.json
 * 等同于==>
 * 插件安装命令简写：(cnpm/npm) i [插件名字] -D
 *
 * 示例·安装gulp-sass：
 *npm i gulp-sass -D
 */


/*
 * sass()插件使用的测试Task
 */
gulp.task("sass",function(){
    return gulp.src("stylesheet/index.scss")
    .pipe(gulp_sass())
    .pipe(gulp.dest("build/css"))
    .pipe(gulp_minify_css())
    .pipe(gulp_rename("index.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(gulp_connect.reload());//服务器刷新
});


/**
 * 处理JS文件合并
 */
gulp.task("jsMerge",function(){
    return gulp.src("javascript/*.js")
    .pipe(gulp_concat("index.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(gulp_uglify())
    .pipe(gulp_rename("index.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(gulp_connect.reload());//服务器刷新
});



/**
 * 启动服务器
 */
gulp.task("server",function(){
    gulp_connect.server({
        root:"build",//设置根目录
        port:8888
    })
});




/**
 * 同时启动监听和服务  defaultk可以直接通过gulp启动
 */
gulp.task("default",["watch","server"],function(){
    console.log("监听和服务启动完成！");
});