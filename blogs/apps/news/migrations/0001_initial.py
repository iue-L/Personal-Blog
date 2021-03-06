# -*- coding: utf-8 -*-
# Generated by Django 1.11.11 on 2019-04-11 05:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Blog',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100, verbose_name='标题')),
                ('time', models.CharField(max_length=11, verbose_name='文章创建时间')),
                ('watch', models.CharField(max_length=100, verbose_name='观看人数')),
                ('text', models.CharField(max_length=21000, verbose_name='文章内容')),
            ],
            options={
                'verbose_name': '博客',
                'verbose_name_plural': '博客',
                'db_table': 'tb_blog',
            },
        ),
    ]
