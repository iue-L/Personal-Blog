import os
from celery import Celery
"""
celery使用流程:
1,加载settings中的环境变量
2,创建celery对象
3,加载配置文件(broker,存储队列)
4,注册任务
5,调用worker来处理任务(终端执行)
celery -A celery_tasks.main worker -l info
"""
# 1,加载settings中的环境变量
# if not os.environ.getdefault("DJANGO_SETTINGS_MODULE"):
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blogs.settings")

# 2,创建celery对象
app = Celery("celery")

# 3,加载配置文件(broker,存储队列)
app.config_from_object("celery_tasks.config")

# 4,注册任务(注册到config中)
app.autodiscover_tasks(['celery_tasks.email','celery_tasks.html'])