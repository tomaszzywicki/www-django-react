# Generated by Django 5.1.4 on 2025-01-11 12:18

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_book_cover_image_alter_loan_return_due_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loan',
            name='return_due_date',
            field=models.DateTimeField(default=datetime.datetime(2025, 2, 10, 12, 18, 58, 111424, tzinfo=datetime.timezone.utc)),
        ),
        migrations.DeleteModel(
            name='Note',
        ),
    ]
