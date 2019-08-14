# Linux下搭建DNS服务器

## 一、准备工作

### 1.将虚拟机网络设置为桥接

### 2.配置网卡

    vim /etc/sysconfig/network-scripts/ifcfg-eth0`</pre>

修改如下内容

      <pre>`IPADDR=192.168.X.1
    NETMASK=255.255.255.0
    GATEWAY=192.168.X.254`</pre>

重启网络

      <pre>`service network restart`</pre>

## 二、安装软件包

### 1.虚拟机挂载光驱，镜像文件选择RHEL 6.6.iso

### 2.安装bind和bind-chroot

      <pre>`cd /media/RHEL-6.6\ Server.i386/Packages
    rpm -ivh bind.rpm
    rpm -ivh bind-chroot.rpm`</pre>

## 三、修改配置文件

### 1.修改DNS主配置文件

      <pre>`vim /etc/named.conf`</pre>

修改如下内容

      <pre>`listen on port 53 { any; }
    allow-query { any; }`</pre>

### 2.修改named.rfc1912.zones文件

      <pre>`vim /etc/named.rfc1912.zones`</pre>

编辑如下

![named.rfc1912.zones](https://ws1.sinaimg.cn/large/d14b2608gy1fp40phif68j20b905tdgd.jpg)</img>

### 3.增加并修改正向解析文件和反向解析文件

修改zone配置文件正向解析

      <pre>`cd /var/named
    cp -p named.localhost xxx.com.zone
    vim xxx.com.zone`</pre>

编辑如下

    ![xxx.com.zone](https://ws1.sinaimg.cn/large/d14b2608gy1fp40phze90j20fl08gju9.jpg)</img>

修改zone配置文件反向解析

      <pre>`cp -p named.localhost 192.168.xxx.zone
    vim 192.168.xxx.zone`</pre>

编辑如下

![192.168.xxx.zone](https://ws1.sinaimg.cn/large/d14b2608gy1fp40pikd1yj20dg089n0e.jpg)</img>

## 四、安全策略

### 1.更改selinux设置

      <pre>`setenforce 0`</pre>

### 2.关闭防火墙

      <pre>`service iptables stop`</pre>

或者使用

      <pre>`setup`</pre>
      > 选择Firewall configuration下的Security Level
> 
>     设置为Disabled
> 
>     保存退出

## 五、调试检查

### 1.重启DNS和网络服务

      <pre>`service network restart
    service named restart`</pre>

### 2.测试DNS

      <pre>`nslookup## 一、准备工作
### 1.将虚拟机网络设置为桥接
### 2.配置网卡
    vim /etc/sysconfig/network-scripts/ifcfg-eth0
修改如下内容
```
BOOTPROTO=static
IPADDR=192.168.xxx.1
NETMASK=255.255.255.0
```
重启网络
```
service network restart
```
## 二、安装软件包
### 1.虚拟机挂载光驱，镜像文件选择RHEL 6.6.iso
### 2.安装bind
    cd /media/RHEL-6.6\ Server.i386/Packages
    rpm -ivh bind-9.8.2-0.30.rc1.el6.i686.rpm

## 三、修改配置文件
### 1.修改DNS主配置文件
    vim /etc/named.conf
修改如下内容
```
listen on port 53 { any; }
allow-query { any; }
```
### 2.修改named.rfc1912.zones文件
    vim /etc/named.rfc1912.zones
编辑如下

![named.rfc1912.zones](https://i.loli.net/2019/08/14/4OgEC5IKfFhuRJY.png))
### 3.增加并修改正向解析文件和反向解析文件
修改zone配置文件正向解析
```
cd /var/named
cp -p named.localhost xxx.com.zone
vim xxx.com.zone
```
编辑如下

![xxx.com.zone](https://i.loli.net/2019/08/14/ZDBEWTpCF51JmOP.jpg)

修改zone配置文件反向解析
```
cp -p named.localhost 192.168.xxx.zone
vim 192.168.xxx
```
编辑如下

![192.168.xxx](https://i.loli.net/2019/08/14/7dwKzhXgvJWq51L.jpg)

## 四、安全策略
### 1.更改selinux设置
    setenforce 0
### 2.关闭防火墙
    service iptables stop
或者使用`setup`命令,选择`Firewall configuration`下的`Security Level`并设置为`Disabled`，然后保存退出

## 五、调试检查
### 1.重启DNS和网络服务
    service network restart
    service named restart
### 2.测试DNS
    nslookup
