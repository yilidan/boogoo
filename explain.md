## 通用协议格式:

```
boogoo.app://?pushcode=100001&data=" + data  // data为携带的参数，已对象形式。
data={
    url:"",
    ....
}
```

## pushcode:
- pushcode:100001  跳转到登录页
- pushcode:100002  原生push页面（显示头部信息）
- pushcode:100003  跳转到选择主播页面
- pushcode:100004  跳转到支付页面
- pushcode:100005  跳转到搜索页面
- pushcode:100006  关闭当前页面
- pushcode:100007  右上角按钮显示  分享事件：外部参数主播id,type:2, url带上主播id 录播id 用户id;  跳转事件：type:1
- pushcode:100008  跳转到订单分类页
- pushcode:100009  分享
- pushcode:100010  扫一扫
- pushcode:100011  原生push页面（隐藏头部信息）  
