var fs = require("fs");
var path = require("path"); //解析需要遍历的文件夹

function fileDisplay(dir) {
  dir = dir || "./src/views";
  var filePath = path.resolve(dir);
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function(err, files) {
    if (err) {
      console.warn(err);
    } else {
      //遍历读取到的文件列表
      files.forEach(function(filename) {
        //获取当前文件的绝对路径
        var s = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(s, function(eror, stats) {
          if (eror) {
            console.warn("获取文件stats失败");
          } else {
            var isFile = stats.isFile(); //是文件
            var isDir = stats.isDirectory(); //是文件夹
            if (isFile) {
              getFile(s, path.resolve(s, ".."), filename);
            }
            if (isDir) {
              fileDisplay(s); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
            }
          }
        });
      });
    }
  });
}

function getFile(flieName, ord, filename) {
  fs.readFile(flieName, "utf8", function(err, data) {
    if (err) {
      console.warn(err);
    } else {
      //匹配到vue文件
      if (flieName.indexOf("vue") != -1) {
        let htmlReg = /<template[^>]*>[\s\S]*?<\/[^>]*template>/gi;
        let lessReg = /<style[^>]*>[\s\S]*?<\/[^>]*style>/gi;
        let html = data.match(htmlReg);
        if (html) {
          replaceHtml(html[0], ord, flieName, filename);
        }
        let styles = data.match(lessReg);
        if (styles) {
          replaceLess(styles[0], ord, flieName, filename);
        }
      }
    }
  });
}
function replaceLess(fileContent, fileUrl, s, fileName) {
  var str = fileContent;
  str = str.replace(/\d+px/g, function(a) {
    let num = parseInt(a);
    return num == 1 ? "1rpx" : num * 2 + "rpx";
  });
  fs.writeFileSync(fileUrl + "/" + fileName.split(".")[0] + ".less", str);
}

function replaceHtml(fileContent, fileUrl, s, fileName) {
  var str = "" + fileContent;

  // 标签类
  str = str.replace(/<div/g, "<view");
  str = str.replace(/div>/g, "view>");
  str = str.replace(/<span/g, "<text");
  str = str.replace(/span>/g, "text>");
  str = str.replace(/<img/g, "<image");
  str = str.replace(/<router-link/g, '<navigator hover-class="none" ');
  str = str.replace(/router-link>/g, "navigator>");
  str = str.replace(/<button/g, '<button hover-class="none" ');

  // 属性类
  str = str.replace(/v-if="[^"]*"/g, function(val) {
    let before = val.substring(0, 4).replace(/v-if/g, "wx:if");
    let after = '="{{' + val.substring(5, val.length).replace(/"/g, "") + '}}"';
    return before + after;
  });
  str = str.replace(/v-else-if="[^"]*"/g, function(val) {
    let before = val.substring(0, 9).replace(/v-else-if/g, "wx:elif");
    let after =
      '="{{' + val.substring(10, val.length).replace(/"/g, "") + '}}"';
    return before + after;
  });
  str = str.replace(/v-else/g, "wx:else");
  str = str.replace(/v-show/g, "wx:if");
  str = str.replace(/:src="[^"]*"/g, function(val) {
    let before = val.substring(1, 4);
    let after = '="{{' + val.substring(5, val.length).replace(/"/g, "") + '}}"';
    return before + after;
  });
  str = str.replace(/v-for="[^"]*"/g, function(val) {
    let before = val.substring(0, 5).replace(/v-for/g, "wx:for");
    let after = '="{{' + val.substring(6, val.length).replace(/"/g, "") + '}}"';
    return before + after;
  });
  str = str.replace(/:key="[^"]*"/g, function(val) {
    let before = "wx" + val.substring(0, 4);
    let after = '="{{' + val.substring(5, val.length).replace(/"/g, "") + '}}"';
    return before + after;
  });
  str = str.replace(/@click/g, "bindtap");
  str = str.replace(/@click\.stop/g, "catchtap");
  str = str.replace(/@input/g, "bindinput");

  str = str.replace(/:class="[^"]*"/g, function(val) {
    let before = val.substring(1, 6);
    let after = '="{{' + val.substring(7, val.length).replace(/"/g, "") + '}}"';
    return before + after;
  });
  str = str.replace(/to=/g, "url=");

  //新建文件
  fs.writeFileSync(fileUrl + "/" + fileName.split(".")[0] + ".wxml", str);
}

module.exports = fileDisplay;
