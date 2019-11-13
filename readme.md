## 安装

`npm i -g vue2wxml`

## 使用

```
cd mp-dir               #进入小程序项目目录
vue2wxml                  #默认参数'./pages'
vue2wxml -p ./src/views       #自定义解析目录
```

## wxml 转换

    基本的标签类div,span,img,router-link,button
    基本的属性类v-if,v-else-if,v-else,v-for,:key,:src,@click,@click.stop,@input,:class,to

## less 转换

    单位转换  1px = 1rpx, 2px = 2rpx
