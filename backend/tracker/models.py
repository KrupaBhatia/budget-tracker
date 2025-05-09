from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Category(models.Model):
    CATEGORY_TYPE = [('income' ,'Income') , ('expense' , 'Expense')]
    name = models.CharField(max_length = 50)
    type = models.CharField(max_length=7 , choices = CATEGORY_TYPE)
    user = models.ForeignKey(User , on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.type})"




class Transaction(models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    category = models.ForeignKey(Category , on_delete=models.SET_NULL , null = True)
    amount = models.DecimalField(max_digits = 10,decimal_places= 2)
    date = models.DateField()
    description = models.TextField(blank=True)
    type = models.CharField(max_length=7,choices=[('income', 'Income') , ('expense' , 'Expense')])

    def __str__(self):
        return f"{self.type.capitalize()} of ${self.amount} on {self.date}"


class MonthlyBudget(models.Model):
    user = models.ForeignKey(User , on_delete= models.CASCADE)
    month = models.DateField()
    amount = models.DecimalField(max_digits= 10, decimal_places= 2)

    class Meta:
        unique_together = ['user', 'month']

    def __str__(self):
        return f"{self.type.username} - {self.month.strftime('%B %Y')}: ${self.amount}"

