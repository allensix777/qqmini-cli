#!node
const fs = require('fs');
const path = require('path');
const commander = require('commander')

commander
  .version('1.0.3')
  .option('-p, --page [name]', 'create a page')
  .option('-c, --component [name]', 'create a component')
  .parse(process.argv);

/**
 * 创建小程序页面或者组件
 * @param {*} type 创建文件类型 page:页面  component:组件
 * @param {*} fileName 自定义的文件名字
 */
function createFile(type, fileName) {
    // 当前执行命令的路径
    let root = path.resolve('./');

    let templateArray = type === "page" ? ['pageTemplate.qss', 'pageTemplate.css', 'pageTemplate.qml', 'pageTemplate.js', 'pageTemplate.json'] : ['componentTemplate.qss', 'componentTemplate.css', 'componentTemplate.qml', 'componentTemplate.js', 'componentTemplate.json'];

    // 将要创建的文件对象数组
    let fileArray = templateArray.map((item)=>{
        let file = {fileContent: '', filePath: ''}
        // 获取文件内容
        let content = fs.readFileSync(path.join(__dirname, item), 'utf8');
        let replaceStr = type === "page" ? "pageTemplate" : "componentTemplate";
        // 获取目标文件路径
        let filePath = path.join(root, fileName, item.replace(replaceStr, fileName));
        file.content = content;
        file.filePath = filePath;
        return file;
    })

    let targetDirPath = path.join(root, fileName);
    fileArray.forEach(item => {
        // 创建文件夹
        if (!fs.existsSync(targetDirPath)) {
            fs.mkdirSync(targetDirPath);
            console.log(`${targetDirPath}创建成功`);
        }

        // 创建文件
        let targetFilePath = item.filePath;
        let targetFileContent = item.content;
        if (!fs.existsSync(targetFilePath)) {
            fs.writeFile(targetFilePath, targetFileContent, (err) => {
                if (err) throw err;
                console.log(`${targetFilePath}创建成功`);
            });
        } else {
            console.error(`error: ${targetFilePath}已存在`);
        }

    }); 
}

if (commander.page) {
    let fileName = commander.page;
    createFile("page", fileName);
    
}

if (commander.component) {
    let fileName = commander.component;
    createFile("component", fileName);
}


