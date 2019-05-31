#商品详情页面的静态化
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blogs.settings")

import django
django.setup()
from django.template import loader

from blogs import settings
from celery_tasks.main import app
from news.models import Blog


@app.task(name='product_detail_html')
def generate_static_sku_detail_html(sku_id):
    # global ii
    # 获取分类数据
    data = Blog.objects.filter(id=sku_id)



    try:

        data = data[0]
    except:
        return

    serializer = {'title': data.title, 'id': data.id, 'time': data.time, 'watch': data.watch, 'text': data.text}

    # 组织上下文
    context = {
        'blog_s': serializer

    }

    #1,获取模板
    template = loader.get_template('post.html')

    #2,将数据库查询到的内容,渲染到模板页面
    html_text = template.render(context)

    #3,获取到文件写入到的地址
    file_path = os.path.join(settings.GENERATED_STATIC_HTML_FILES_DIR, 'past/' + str(sku_id) + '.html')

    #4,将数据写入到地址中
    with open(file_path, 'w') as f:
        f.write(html_text)


data = Blog.objects.all()

for i in data:

    generate_static_sku_detail_html(i.id)