# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2019-04-11 06:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0002_blog_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='img',
            field=models.CharField(default='http://127.0.0.1:8080/gg/picture/1903051025511551752751166329.jpg', max_length=100, verbose_name='图片'),
        ),
    ]
