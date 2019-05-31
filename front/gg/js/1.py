import random
import time

import re
from lxml import etree
import requests

from pymysql import *
conn = connect(host='localhost',port=3306,user='root',passwd='root_mysql',db='blogs',charset='utf8')
cursor = conn.cursor()
headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mo',



}
for i in range(1,18):
    url = 'http://www.heanny.cn/blog-{}.html'.format(i)

    wb_data = requests.get(url,headers=headers)
    html = etree.HTML(wb_data.content.decode())

    ht_data = html.xpath('//*[@id="body_box"]/ul/li/div/div[2]/h3/a/@href')
    ht_img = html.xpath('//*[@id="body_box"]/ul/li/div/div[1]/a/img/@src')

    print(ht_data)
    print(ht_img)
    a = 0
    session = requests.session()
    for i in ht_data:


        url = 'http://www.heanny.cn{}'.format(i)

        data = session.get(url,headers=headers)

        conntent =  re.findall('<div class="NoteBody animate-box">(.*?)</div>', data.content.decode(), re.S)
        ht_tit =  re.findall('<h1 class="fh5co-heading-colored animate-box" style="    padding-top: 10px;">(.*?)<a', data.content.decode(), re.S)

        tit = ht_tit[0].replace('\r\n','')
        img = 'http://www.heanny.cn'+ht_img[a]
        con = conntent[0].replace('\r\n','')

        ti = time.strftime('%Y-%m-%d', time.localtime(time.time()))

        a+=1
        su = random.randint(100, 20000)
        # sql = "insert into tb_blog('title','time','watch','text','img','user_id')values(tit,ti,su,con,img,12)"
        sql = "INSERT INTO tb_blog(title,time,watch,text,img,user_id) VALUES ('%s','%s','%s','%s','%s','%s')" % (tit,ti,su,con,img,12)
        try:
            #执行sql语句
            cursor.execute(sql)
            #提交到数据库执行
            conn.commit()

        except:
            print(tit)



#
import urllib

import requests

# url = 'http://www.heanny.cn/images/error2.gif'
#
#
#
# da = requests.get(url)
#
#
#
# f = open('/Users/linlimeng/Desktop/个人博客/首页/gg/images/error2.gif','wb')
# f.write(da.content)

# !/usr/bin/python
# -*- coding: utf-8 -*-
import json
from urllib.parse import urlencode
import requests
import json
# ----------------------------------
# 天气预报调用示例代码 － 聚合数据
# 在线接口文档：http://www.juhe.cn/docs/73
# ----------------------------------

def main():
    # 配置您申请的APPKey
    appkey = "fe178d53344c2014b2228b54f6a5f337"

    # 1.根据城市查询天气
    request1(appkey, "GET")


# 根据城市查询天气
def request1(appkey, m="GET"):
    url = "http://v.juhe.cn/toutiao/index?type=''&key={}".format(appkey)
    # params = {
    #     "cityname": "",  # 要查询的城市，如：温州、上海、北京
    #     "key": appkey,  # 应用APPKEY(应用详细页查询)
    #     "dtype": "",  # 返回数据的格式,xml或json，默认json
    #
    # }


    f = requests.get(url)

    content = f.content.decode()
    content = json.loads(content)
    for i in content['result']['data']:
        print(i)
    # res = json.loads(content)
    # if res:
    #     error_code = res["error_code"]
    #     if error_code == 0:
    #         # 成功请求
    #         print(res["result"])
    #     else:
    #         print("%s:%s" % (res["error_code"], res["reason"]))
    # else:
    #     print("request api error")


if __name__ == '__main__':
    main()