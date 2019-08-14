## 一、准备工作
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
    service network restart

## 二、安全策略
### 1.更改selinux设置
    setenforce 0
### 2.关闭防火墙
    service iptables stop
或者使用`setup`命令,选择`Firewall configuration`下的`Security Level`并设置为`Disabled`，然后保存退出
## 三、安装软件包
### 1.虚拟机挂载光驱，镜像文件选择RHEL 6.6.iso
### 2.安装httpd.rpm
    rpm -ivh httpd-2.2.15-39.el6.i686.rpm

## 四、修改配置文件
### 1.编辑Apache主配置文件
    vim /etc/httpd/conf/httpd.conf
### 2.常用配置修改方法

#### （1）用户个人主页
```
user add long
passwd long
chmod 705 /home/long
mkdir /home/long/public_html
cd /home/long/public_html
echo "This is Long's web" >> index.html
```
配置文件中
```
<IfModule mod_userdir.c>
	UserDir disabled
	#UserDir public_html
</IfModule>
```
修改为
```
<IfModule mod_userdir.c>
	#UserDir disabled
	UserDir public_html
</IfModule>
```
浏览格式为
```
http://域名或IP/~username
```
#### （2）虚拟目录
```
mkdir -p /virdir/
cd /virdir/
echo "This is Virtual Directory sample" >> index.html
chmod 705 index.html
```
配置文件中添加
```
Alias /test "/virdir"
```
浏览
```
http://域名或IP/test
```
即可看到虚拟目录中的页面
## 五、配置虚拟主机
### 1.配置基于IP地址的虚拟主机
#### （1）配置虚拟网卡
```
cd /etc/sysconfig/network-scripts/
cp -p ifcfg-eth0 ifcfg-eth0:1
vim ifcfg-eth0:1
```
修改如下内容
```
DEVICE=eth0:1
BOOTPROTO=static
IPADDR=192.168.xxx.1
NETMASK=255.255.255.0
```
重启网络
```
service network restart
```
#### （2）创建目录和页面
分别创建/var/www/ip1和/var/www/ip2
```
mkdir /var/www/ip1 /var/www/ip2
cd /var/www/ip1
echo "This is 192.168.xxx.1's web" >> index.html
cd /var/www/ip2
echo "This is 192.168.xxx.2's web" >> index.html
```
#### （3）修改主配置文件
```
vim /etc/httpd/conf/httpd.conf
```
到达文件末尾（G）
复制文件末尾最后7行（7yy）
粘贴（p）
```
#<VirtualHost *:80>
#    ServerAdmin webmaster@dummy-host.example.com
#    DocumentRoot /www/docs/dummy-host.example.com
#    ServerName dummy-host.example.com
#    ErrorLog logs/dummy-host.example.com-error_log
#    CustomLog logs/dummy-host.example.com-access_log common
#</VirtualHost>
```
删去注释并修改
```
<VirtualHost 192.168.xxx.1>
    ...
    DocumentRoot /var/www/ip1
    ...
</VirtualHost>
<VirtualHost 192.168.xxx.2>
    ...
    DocumentRoot /var/www/ip2
    ...
</VirtualHost>
```
#### （4）浏览
```
http://192.168.xxx.1
http://192.168.xxx.2
```
### 2.配置基于端口号的虚拟主机
操作同上（2）（3）（4），不过要添加Listen 端口号，在IP后加“:端口“
```
Listen 8080
Listen 8090
...
<VirtualHost 192.168.xxx.1:8080>
    ...
    DocumentRoot /var/www/port8080
    ...
</VirtualHost>
<VirtualHost 192.168.xxx.1:8090>
    ...
    DocumentRoot /var/www/port8090
    ...
</VirtualHost>
```
### 3.配置基于域名的虚拟主机
#### （1）安装bind
```
cd /media/RHEL-6.6\ Server.i386/Packages
rpm -ivh bind-9.8.2-0.30.rc1.el6.i686.rpm
```
修改配置文件
#### （2）修改DNS主配置文件
```
vim /etc/named.conf
```
修改如下内容
```
listen on port 53 { any; }
...
allow-query { any; }
```
#### （3）修改named.rfc1912.zones文件
```
vim /etc/named.rfc1912.zones
```
复制最后11行（11yy） 粘贴（p）修改为
```
zone "long.com" IN {
        type master;
        file "long.com.zone";
        allow-update { none; };
};
```
#### （4）增加并修改正向解析文件
```
cd /var/named
cp -p named.localhost long.com.zone
vim long.com.zone
```
编辑如下
```
$TTL 1D
@	IN SOA	@ root.long.com. (
					0	; serial
					1D	; refresh
					1H	; retry
					1W	; expire
					3H )	; minimum
	NS	@
	A	127.0.0.1
	AAAA	::1
dns	IN	A	192.168.29.1
aaa	IN	A	192.168.29.1
bbb	IN	A	192.168.29.1
```
#### （4）分别创建/var/www/aaa和/var/www/bbb
```
mkdir /var/www/aaa /var/www/bbb
cd /var/www/aaa
echo "This is aaa web" >> index.html
cd /var/www/bbb
echo "This is bbb web" >> index.html
```
#### （5）修改Apache主配置文件
```
NameVirtualhost 192.168.xxx.1
...
<VirtualHost 192.168.xxx.1>
    ...
    ServerName aaa.long.com
    DocumentRoot /var/www/aaa
    ...
</VirtualHost>
<VirtualHost 192.168.xxx.1>
    ...
    ServerName bbb.long.com
    DocumentRoot /var/www/bbb
    ...
</VirtualHost>
```
#### （6）浏览
```
http://aaa.long.com
http://bbb.long.com
```
