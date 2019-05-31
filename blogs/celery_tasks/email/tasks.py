from celery_tasks.main import app
from django.core.mail import send_mail
from django.conf import settings

@app.task(name="send_verify_mail_url")
def send_verify_mail_url(email,verify_url):

    #1,拼接邮件具体内容
    html_message = '<a href="#">您的验证码是： %s</a>' % (verify_url)

    #2,发送邮件
    send_mail('个人博客注册码', '', settings.EMAIL_FROM, [email],
              html_message=html_message)