## 安装

`npm i -g vue2wxml`

## 使用

```
cd mp-dir               #进入小程序项目目录
vue2wxml                  #默认参数'./pages'
mp2vue -p ./src/views       #自定义解析目录
```

## wxml 转换

    基本的标签类view,block,text,scroll-view,image,navigator
    基本的属性类wx:if,wx:elif,wx:else,wx:for,wx:key,src,bindtap,catchtap,bindinput,hover-class,class,url
    单位转换 2rpx = 1px,1rpx=1px

## less 转换

    单位转换 2rpx = 1px,1rpx=1px
