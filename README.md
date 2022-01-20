# newTalk
登录、有导航守卫登录拦截，会调用node写的接口去数据库访问数据，判断用户是否输入正确

忘记密码，可以在这里修改密码，会调用接口访问数据，再调用另外一个接口去修改数据库的信息完成修改密码

注册用户，会调用接口查询用户的信息是否存在，如果不存在才可以注册

每个输入框都有表单验证

成功登录进入就可以多人聊天

创建了两个数据库
create table userTalk(
    -> userId char(20) ,
    -> id char(10) primary key,
    -> talk text,
    -> date dateTime);
    
create table talk(
    -> userId char(20) ,
    -> userName char(10) primary key,
    -> text char(20),
    -> password char(20);
