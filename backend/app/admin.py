from django.contrib import admin
from .models import Customer, Report
from django.utils.html import format_html
from django.urls import reverse

# Register your models here.

@admin.register(Customer)
class CustomerModelAdmin(admin.ModelAdmin):
    list_display=['id', 'name', 'age', 'email', 'contact_number', 'xray_image']

@admin.register(Report)
class CustomerModelAdmin(admin.ModelAdmin):
    list_display=['customer_id', 'customer_info', 'result', 'report_date']

    def customer_info(self, obj):
        link=reverse("admin:app_customer_change", args=[obj.customer.pk])
        return format_html('<a href="{}">{}</a>', link, obj.customer.name)
    
    def customer_id(self, obj):
        link=reverse("admin:app_customer_change", args=[obj.customer.pk])
        return format_html('<a href="{}">{}</a>', link, obj.customer.id)
