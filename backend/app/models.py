from django.db import models
from django.contrib.auth.models import User

#To be edited..

class Customer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='customers')
    name = models.CharField(max_length=100, blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    xray_image=models.ImageField()

    def __str__(self):
        return self.name


class Report(models.Model):
    RESULT_CHOICES = [
        ('Normal', 'Normal'),
        ('Pneumonia', 'Pneumonia'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='reports')
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    report_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report for {self.customer.name} on {self.report_date.strftime('%Y-%m-%d %H:%M:%S')}"
